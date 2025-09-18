import { prisma } from '../db';
import { logger } from '../utils/logger';
import * as cron from 'node-cron';

export interface DataQualityMetrics {
  restaurantId: string;
  overallScore: number;
  completenessScore: number;
  accuracyScore: number;
  photoQualityScore: number;
  verificationScore: number;
  lastUpdated: Date;
  issues: DataQualityIssue[];
  recommendations: string[];
}

export interface DataQualityIssue {
  type: 'MISSING_DATA' | 'INACCURATE_DATA' | 'LOW_QUALITY_PHOTOS' | 'OUTDATED_INFO' | 'DUPLICATE_ENTRY';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  field?: string;
  description: string;
  suggestedAction: string;
}

export interface DataMonitoringReport {
  totalRestaurants: number;
  averageQualityScore: number;
  restaurantsNeedingAttention: number;
  dataCompleteness: number;
  photoQuality: number;
  verificationStatus: {
    verified: number;
    pending: number;
    flagged: number;
  };
  topIssues: Array<{
    issue: string;
    count: number;
    percentage: number;
  }>;
  recommendations: string[];
  lastReportGenerated: Date;
}

export class DataMonitoringService {
  private qualityThresholds = {
    MIN_OVERALL_SCORE: 0.7,
    MIN_COMPLETENESS: 0.8,
    MIN_ACCURACY: 0.8,
    MIN_PHOTO_QUALITY: 0.6,
    MIN_VERIFICATION: 0.7
  };

  constructor() {
    this.startMonitoringSchedule();
  }

  async assessRestaurantDataQuality(restaurantId: string): Promise<DataQualityMetrics> {
    try {
      logger.info(`Assessing data quality for restaurant ${restaurantId}`);

      const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId },
        include: { 
          photos: true,
          reviews: true
        }
      });

      if (!restaurant) {
        throw new Error(`Restaurant ${restaurantId} not found`);
      }

      const completenessScore = this.calculateCompletenessScore(restaurant);
      const accuracyScore = await this.calculateAccuracyScore(restaurant);
      const photoQualityScore = this.calculatePhotoQualityScore(restaurant.photos);
      const verificationScore = this.calculateVerificationScore(restaurant);

      const overallScore = (completenessScore + accuracyScore + photoQualityScore + verificationScore) / 4;

      const issues = await this.identifyDataQualityIssues(restaurant);
      const recommendations = this.generateRecommendations(restaurant, issues);

      const metrics: DataQualityMetrics = {
        restaurantId,
        overallScore,
        completenessScore,
        accuracyScore,
        photoQualityScore,
        verificationScore,
        lastUpdated: new Date(),
        issues,
        recommendations
      };

      // Store metrics in database
      await this.storeQualityMetrics(metrics);

      logger.info(`Data quality assessment completed for ${restaurantId}: ${overallScore.toFixed(2)}`);
      return metrics;

    } catch (error) {
      logger.error(`Error assessing data quality for restaurant ${restaurantId}:`, error);
      throw error;
    }
  }

  async generateDataMonitoringReport(): Promise<DataMonitoringReport> {
    try {
      logger.info('Generating data monitoring report');

      const restaurants = await prisma.restaurant.findMany({
        include: { photos: true, reviews: true }
      });

      const totalRestaurants = restaurants.length;
      const qualityScores = await Promise.all(
        restaurants.map(r => this.assessRestaurantDataQuality(r.id))
      );

      const averageQualityScore = qualityScores.reduce((sum, q) => sum + q.overallScore, 0) / totalRestaurants;
      const restaurantsNeedingAttention = qualityScores.filter(q => q.overallScore < this.qualityThresholds.MIN_OVERALL_SCORE).length;

      const dataCompleteness = qualityScores.reduce((sum, q) => sum + q.completenessScore, 0) / totalRestaurants;
      const photoQuality = qualityScores.reduce((sum, q) => sum + q.photoQualityScore, 0) / totalRestaurants;

      const verificationStatus = {
        verified: qualityScores.filter(q => q.verificationScore >= 0.8).length,
        pending: qualityScores.filter(q => q.verificationScore >= 0.6 && q.verificationScore < 0.8).length,
        flagged: qualityScores.filter(q => q.verificationScore < 0.6).length
      };

      const allIssues = qualityScores.flatMap(q => q.issues);
      const issueCounts = this.countIssuesByType(allIssues);
      const topIssues = this.getTopIssues(issueCounts, totalRestaurants);

      const recommendations = this.generateGlobalRecommendations(qualityScores, restaurants);

      const report: DataMonitoringReport = {
        totalRestaurants,
        averageQualityScore,
        restaurantsNeedingAttention,
        dataCompleteness,
        photoQuality,
        verificationStatus,
        topIssues,
        recommendations,
        lastReportGenerated: new Date()
      };

      // Store report
      await this.storeMonitoringReport(report);

      logger.info(`Data monitoring report generated: ${averageQualityScore.toFixed(2)} average quality score`);
      return report;

    } catch (error) {
      logger.error('Error generating data monitoring report:', error);
      throw error;
    }
  }

  async identifyOutdatedRestaurants(): Promise<string[]> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const outdatedRestaurants = await prisma.restaurant.findMany({
        where: {
          lastUpdated: {
            lt: thirtyDaysAgo
          }
        },
        select: { id: true }
      });

      return outdatedRestaurants.map(r => r.id);
    } catch (error) {
      logger.error('Error identifying outdated restaurants:', error);
      return [];
    }
  }

  async flagDataDiscrepancies(): Promise<void> {
    try {
      logger.info('Flagging data discrepancies across sources');

      const restaurants = await prisma.restaurant.findMany({
        where: {
          OR: [
            { googlePlaceId: { not: null } },
            { yelpBusinessId: { not: null } },
            { foursquareId: { not: null } }
          ]
        }
      });

      for (const restaurant of restaurants) {
        const discrepancies = await this.checkForDiscrepancies(restaurant);
        if (discrepancies.length > 0) {
          await this.flagRestaurantForReview(restaurant.id, discrepancies);
        }
      }

      logger.info('Data discrepancy flagging completed');
    } catch (error) {
      logger.error('Error flagging data discrepancies:', error);
    }
  }

  private calculateCompletenessScore(restaurant: any): number {
    const requiredFields = [
      'name', 'address', 'city', 'state', 'zipCode', 'phone', 'website',
      'cuisine', 'description', 'latitude', 'longitude'
    ];

    const optionalFields = [
      'email', 'priceRange', 'rating', 'reviewCount', 'mainImage'
    ];

    let score = 0;
    let maxScore = 0;

    // Required fields (80% of score)
    requiredFields.forEach(field => {
      maxScore += 8;
      if (restaurant[field] && restaurant[field].toString().trim() !== '') {
        score += 8;
      }
    });

    // Optional fields (20% of score)
    optionalFields.forEach(field => {
      maxScore += 2;
      if (restaurant[field] && restaurant[field].toString().trim() !== '') {
        score += 2;
      }
    });

    return score / maxScore;
  }

  private async calculateAccuracyScore(restaurant: any): Promise<number> {
    let score = 0;
    let maxScore = 0;

    // Phone number validation
    maxScore += 20;
    if (this.isValidPhoneNumber(restaurant.phone)) {
      score += 20;
    }

    // Address validation
    maxScore += 20;
    if (this.isValidAddress(restaurant.address, restaurant.latitude, restaurant.longitude)) {
      score += 20;
    }

    // Website validation
    maxScore += 20;
    if (this.isValidWebsite(restaurant.website)) {
      score += 20;
    }

    // Email validation
    maxScore += 20;
    if (this.isValidEmail(restaurant.email)) {
      score += 20;
    }

    // Business hours validation
    maxScore += 20;
    if (this.hasValidBusinessHours(restaurant)) {
      score += 20;
    }

    return score / maxScore;
  }

  private calculatePhotoQualityScore(photos: any[]): number {
    if (photos.length === 0) return 0;

    let score = 0;
    let maxScore = 0;

    photos.forEach(photo => {
      maxScore += 10;
      
      // Check if photo URL is valid
      if (photo.url && this.isValidImageUrl(photo.url)) {
        score += 5;
      }

      // Check if photo has caption
      if (photo.caption && photo.caption.trim() !== '') {
        score += 3;
      }

      // Check if photo is marked as primary
      if (photo.isPrimary) {
        score += 2;
      }
    });

    return Math.min(1, score / maxScore);
  }

  private calculateVerificationScore(restaurant: any): number {
    let score = 0;
    let maxScore = 0;

    // Google Places verification
    maxScore += 25;
    if (restaurant.googlePlaceId) {
      score += 25;
    }

    // Yelp verification
    maxScore += 25;
    if (restaurant.yelpBusinessId) {
      score += 25;
    }

    // Foursquare verification
    maxScore += 25;
    if (restaurant.foursquareId) {
      score += 25;
    }

    // Manual verification
    maxScore += 25;
    if (restaurant.isVerified) {
      score += 25;
    }

    return score / maxScore;
  }

  private async identifyDataQualityIssues(restaurant: any): Promise<DataQualityIssue[]> {
    const issues: DataQualityIssue[] = [];

    // Check for missing required data
    if (!restaurant.phone) {
      issues.push({
        type: 'MISSING_DATA',
        severity: 'HIGH',
        field: 'phone',
        description: 'Phone number is missing',
        suggestedAction: 'Collect phone number from business website or API sources'
      });
    }

    if (!restaurant.website) {
      issues.push({
        type: 'MISSING_DATA',
        severity: 'MEDIUM',
        field: 'website',
        description: 'Website URL is missing',
        suggestedAction: 'Search for restaurant website online'
      });
    }

    if (!restaurant.description || restaurant.description.length < 50) {
      issues.push({
        type: 'MISSING_DATA',
        severity: 'MEDIUM',
        field: 'description',
        description: 'Description is missing or too short',
        suggestedAction: 'Write a comprehensive description based on cuisine and specialties'
      });
    }

    // Check photo quality
    if (restaurant.photos.length === 0) {
      issues.push({
        type: 'LOW_QUALITY_PHOTOS',
        severity: 'HIGH',
        description: 'No photos available',
        suggestedAction: 'Collect photos from Google Places, Yelp, and restaurant website'
      });
    } else if (restaurant.photos.length < 3) {
      issues.push({
        type: 'LOW_QUALITY_PHOTOS',
        severity: 'MEDIUM',
        description: 'Insufficient photos',
        suggestedAction: 'Collect more photos from multiple sources'
      });
    }

    // Check for outdated information
    const lastUpdated = new Date(restaurant.lastUpdated);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    if (lastUpdated < thirtyDaysAgo) {
      issues.push({
        type: 'OUTDATED_INFO',
        severity: 'MEDIUM',
        description: 'Restaurant information is outdated',
        suggestedAction: 'Refresh data from API sources and verify current information'
      });
    }

    return issues;
  }

  private generateRecommendations(restaurant: any, issues: DataQualityIssue[]): string[] {
    const recommendations: string[] = [];

    if (issues.some(i => i.type === 'MISSING_DATA' && i.field === 'phone')) {
      recommendations.push('Collect phone number from restaurant website or call directory assistance');
    }

    if (issues.some(i => i.type === 'LOW_QUALITY_PHOTOS')) {
      recommendations.push('Implement comprehensive photo collection from Google Places, Yelp, and website scraping');
    }

    if (issues.some(i => i.type === 'OUTDATED_INFO')) {
      recommendations.push('Set up automated data refresh schedule for this restaurant');
    }

    if (!restaurant.isVerified) {
      recommendations.push('Verify restaurant information through multiple sources and mark as verified');
    }

    return recommendations;
  }

  private generateGlobalRecommendations(qualityScores: DataQualityMetrics[], restaurants: any[]): string[] {
    const recommendations: string[] = [];

    const avgCompleteness = qualityScores.reduce((sum, q) => sum + q.completenessScore, 0) / qualityScores.length;
    if (avgCompleteness < 0.8) {
      recommendations.push('Improve data completeness by implementing automated data collection from restaurant websites');
    }

    const avgPhotoQuality = qualityScores.reduce((sum, q) => sum + q.photoQualityScore, 0) / qualityScores.length;
    if (avgPhotoQuality < 0.6) {
      recommendations.push('Enhance photo collection system to gather high-quality images from multiple sources');
    }

    const unverifiedCount = restaurants.filter(r => !r.isVerified).length;
    if (unverifiedCount > restaurants.length * 0.3) {
      recommendations.push('Implement systematic verification process for restaurant data accuracy');
    }

    return recommendations;
  }

  private countIssuesByType(issues: DataQualityIssue[]): { [key: string]: number } {
    const counts: { [key: string]: number } = {};
    
    issues.forEach(issue => {
      const key = `${issue.type}_${issue.severity}`;
      counts[key] = (counts[key] || 0) + 1;
    });

    return counts;
  }

  private getTopIssues(issueCounts: { [key: string]: number }, totalRestaurants: number): Array<{ issue: string; count: number; percentage: number }> {
    return Object.entries(issueCounts)
      .map(([issue, count]) => ({
        issue,
        count,
        percentage: Math.round((count / totalRestaurants) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private async checkForDiscrepancies(restaurant: any): Promise<string[]> {
    const discrepancies: string[] = [];

    // This would implement actual cross-source verification
    // For now, return empty array
    return discrepancies;
  }

  private async flagRestaurantForReview(restaurantId: string, discrepancies: string[]): Promise<void> {
    // Flag restaurant for manual review
    await prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        isVerified: false,
        lastUpdated: new Date()
      }
    });
  }

  private startMonitoringSchedule(): void {
    // Run data collection every 6 hours (4 times per day)
    cron.schedule('0 */6 * * *', async () => {
      logger.info('Starting scheduled restaurant data collection');
      try {
        const { restaurantDataCollection } = await import('./restaurantDataCollection');
        await restaurantDataCollection.collectRestaurantData();
        logger.info('Scheduled restaurant data collection completed');
      } catch (error) {
        logger.error('Error in scheduled restaurant data collection:', error);
      }
    });

    // Run data quality assessment daily at 2 AM
    cron.schedule('0 2 * * *', async () => {
      logger.info('Starting scheduled data quality assessment');
      try {
        await this.flagDataDiscrepancies();
        await this.generateDataMonitoringReport();
      } catch (error) {
        logger.error('Error in scheduled data quality assessment:', error);
      }
    });

    // Run outdated restaurant check weekly
    cron.schedule('0 3 * * 0', async () => {
      logger.info('Starting scheduled outdated restaurant check');
      try {
        const outdatedRestaurants = await this.identifyOutdatedRestaurants();
        if (outdatedRestaurants.length > 0) {
          logger.info(`Found ${outdatedRestaurants.length} outdated restaurants`);
          // Trigger data refresh for outdated restaurants
        }
      } catch (error) {
        logger.error('Error in scheduled outdated restaurant check:', error);
      }
    });

    // Run comprehensive metro data collection weekly on Sundays at 4 AM
    cron.schedule('0 4 * * 0', async () => {
      logger.info('Starting scheduled comprehensive metro data collection');
      try {
        const { MetroDataCollectionScript } = await import('../scripts/collectAllMetroData');
        const collectionScript = new MetroDataCollectionScript();
        await collectionScript.run();
        logger.info('Scheduled comprehensive metro data collection completed');
      } catch (error) {
        logger.error('Error in scheduled comprehensive metro data collection:', error);
      }
    });
  }

  private async storeQualityMetrics(metrics: DataQualityMetrics): Promise<void> {
    // Store quality metrics in database
    // This would create a new table for quality metrics
  }

  private async storeMonitoringReport(report: DataMonitoringReport): Promise<void> {
    // Store monitoring report in database
    // This would create a new table for monitoring reports
  }

  // Validation helper methods
  private isValidPhoneNumber(phone: string): boolean {
    if (!phone) return false;
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  private isValidAddress(address: string, lat: number, lng: number): boolean {
    return !!(address && lat && lng && lat !== 0 && lng !== 0);
  }

  private isValidWebsite(website: string): boolean {
    if (!website) return false;
    try {
      new URL(website);
      return true;
    } catch {
      return false;
    }
  }

  private isValidEmail(email: string): boolean {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private hasValidBusinessHours(restaurant: any): boolean {
    const hoursFields = [
      'mondayOpen', 'mondayClose', 'tuesdayOpen', 'tuesdayClose',
      'wednesdayOpen', 'wednesdayClose', 'thursdayOpen', 'thursdayClose',
      'fridayOpen', 'fridayClose', 'saturdayOpen', 'saturdayClose',
      'sundayOpen', 'sundayClose'
    ];

    return hoursFields.some(field => restaurant[field]);
  }

  private isValidImageUrl(url: string): boolean {
    if (!url) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some(ext => url.toLowerCase().includes(ext));
  }

  public initialize(): void {
    logger.info('Initializing data monitoring service...');
    this.startMonitoringSchedule();
    logger.info('Data monitoring service initialized with scheduled tasks');
  }
}

export const dataMonitoringService = new DataMonitoringService();
