import axios from 'axios';
import { prisma } from '../db';
import { logger } from '../utils/logger';
import { RestaurantData } from './apiIntegrations';

export interface EnhancedRestaurantData {
  id: string;
  name: string;
  description?: string;
  cuisine?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  email?: string;
  priceRange: string;
  rating: number;
  reviewCount: number;
  dataQualityScore: number;
  verificationStatus: 'VERIFIED' | 'PENDING' | 'FLAGGED';
  lastVerified: Date;
  sources: string[];
  discrepancies: DataDiscrepancy[];
  photos: EnhancedPhoto[];
  menuItems?: MenuItem[];
  socialMedia?: SocialMediaLinks;
  businessHours?: BusinessHours;
  dietaryOptions?: string[];
  culturalContext?: CulturalContext;
}

export interface DataDiscrepancy {
  field: string;
  sources: { [key: string]: any };
  resolution: any;
  confidence: number;
}

export interface EnhancedPhoto {
  url: string;
  source: 'GOOGLE' | 'YELP' | 'FOURSQUARE' | 'WEBSITE' | 'INSTAGRAM' | 'MANUAL';
  type: 'FOOD' | 'INTERIOR' | 'EXTERIOR' | 'MENU' | 'CHEF' | 'OTHER';
  quality: 'HIGH' | 'MEDIUM' | 'LOW';
  isPrimary: boolean;
  caption?: string;
  verified: boolean;
}

export interface MenuItem {
  name: string;
  description: string;
  price?: string;
  category: string;
  dietaryTags: string[];
  isPopular: boolean;
}

export interface SocialMediaLinks {
  website?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  tiktok?: string;
}

export interface BusinessHours {
  monday: { open: string; close: string; closed: boolean };
  tuesday: { open: string; close: string; closed: boolean };
  wednesday: { open: string; close: string; closed: boolean };
  thursday: { open: string; close: string; closed: boolean };
  friday: { open: string; close: string; closed: boolean };
  saturday: { open: string; close: string; closed: boolean };
  sunday: { open: string; close: string; closed: boolean };
}

export interface CulturalContext {
  country: string;
  region: string;
  specialties: string[];
  culturalSignificance: string;
  familyOwned: boolean;
  establishedYear?: number;
  story?: string;
}

export class DataEnhancementService {
  private qualityThresholds = {
    MIN_PHONE_VERIFICATION: 0.8,
    MIN_ADDRESS_ACCURACY: 0.9,
    MIN_PHOTO_QUALITY: 0.7,
    MIN_DATA_COMPLETENESS: 0.85,
    MAX_DISCREPANCY_THRESHOLD: 0.3
  };

  async enhanceRestaurantData(restaurantId: string): Promise<EnhancedRestaurantData | null> {
    try {
      logger.info(`Starting data enhancement for restaurant ${restaurantId}`);

      // Get existing restaurant data
      const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId },
        include: { photos: true }
      });

      if (!restaurant) {
        logger.error(`Restaurant ${restaurantId} not found`);
        return null;
      }

      // Multi-source verification
      const verifiedData = await this.performMultiSourceVerification(restaurant);
      
      // Enhanced photo collection
      const enhancedPhotos = await this.collectEnhancedPhotos(restaurant);
      
      // Business information validation
      const validatedInfo = await this.validateBusinessInformation(restaurant);
      
      // Web scraping for additional data
      const scrapedData = await this.scrapeRestaurantWebsite(restaurant);
      
      // Cuisine classification enhancement
      const enhancedCuisine = await this.enhanceCuisineClassification(restaurant);
      
      // Calculate data quality score
      const qualityScore = this.calculateDataQualityScore({
        verifiedData,
        enhancedPhotos,
        validatedInfo,
        scrapedData,
        enhancedCuisine
      });

      // Create enhanced restaurant data
      const enhancedData: EnhancedRestaurantData = {
        id: restaurant.id,
        name: restaurant.name,
        description: restaurant.description || undefined,
        cuisine: restaurant.cuisine || undefined,
        address: restaurant.address,
        city: restaurant.city,
        state: restaurant.state,
        zipCode: restaurant.zipCode,
        country: restaurant.country,
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
        phone: restaurant.phone || undefined,
        website: restaurant.website || undefined,
        email: restaurant.email || undefined,
        priceRange: restaurant.priceRange,
        rating: restaurant.rating,
        reviewCount: restaurant.reviewCount,
        dataQualityScore: qualityScore,
        verificationStatus: qualityScore > 0.8 ? 'VERIFIED' : qualityScore > 0.6 ? 'PENDING' : 'FLAGGED',
        lastVerified: new Date(),
        sources: ['GOOGLE_PLACES', 'YELP', 'FOURSQUARE', 'WEBSITE_SCRAPING'],
        discrepancies: verifiedData.discrepancies,
        photos: enhancedPhotos,
        menuItems: scrapedData.menuItems,
        socialMedia: scrapedData.socialMedia,
        businessHours: validatedInfo.businessHours || undefined,
        dietaryOptions: enhancedCuisine.dietaryOptions,
        culturalContext: enhancedCuisine.culturalContext || undefined
      };

      // Update database with enhanced data
      await this.updateRestaurantWithEnhancedData(restaurantId, enhancedData);

      logger.info(`Data enhancement completed for restaurant ${restaurantId} with quality score: ${qualityScore}`);
      return enhancedData;

    } catch (error) {
      logger.error(`Error enhancing restaurant data for ${restaurantId}:`, error);
      return null;
    }
  }

  private async performMultiSourceVerification(restaurant: any) {
    logger.info(`Performing multi-source verification for ${restaurant.name}`);
    
    const sources: any = {
      google: await this.getGooglePlacesDetails(restaurant.googlePlaceId),
      yelp: await this.getYelpBusinessDetails(restaurant.yelpBusinessId),
      foursquare: await this.getFoursquareVenueDetails(restaurant.foursquareId)
    };

    const discrepancies: DataDiscrepancy[] = [];
    const verifiedData: any = {};

    // Compare phone numbers
    const phoneNumbers = Object.values(sources).map((s: any) => s?.phone).filter(Boolean);
    if (phoneNumbers.length > 1) {
      const uniquePhones = [...new Set(phoneNumbers)];
      if (uniquePhones.length > 1) {
        discrepancies.push({
          field: 'phone',
          sources: Object.fromEntries(Object.entries(sources).map(([k, v]: [string, any]) => [k, v?.phone])),
          resolution: this.resolvePhoneDiscrepancy(uniquePhones),
          confidence: 0.7
        });
      }
    }

    // Compare addresses
    const addresses = Object.values(sources).map((s: any) => s?.address).filter(Boolean);
    if (addresses.length > 1) {
      const uniqueAddresses = [...new Set(addresses)];
      if (uniqueAddresses.length > 1) {
        discrepancies.push({
          field: 'address',
          sources: Object.fromEntries(Object.entries(sources).map(([k, v]: [string, any]) => [k, v?.address])),
          resolution: this.resolveAddressDiscrepancy(uniqueAddresses),
          confidence: 0.8
        });
      }
    }

    // Compare business hours
    const hours = Object.values(sources).map((s: any) => s?.hours).filter(Boolean);
    if (hours.length > 1) {
      const uniqueHours = [...new Set(hours)];
      if (uniqueHours.length > 1) {
        discrepancies.push({
          field: 'hours',
          sources: Object.fromEntries(Object.entries(sources).map(([k, v]: [string, any]) => [k, v?.hours])),
          resolution: this.resolveHoursDiscrepancy(uniqueHours),
          confidence: 0.6
        });
      }
    }

    // Use majority voting for conflicting information
    verifiedData.phone = this.getMajorityVote(phoneNumbers) || restaurant.phone;
    verifiedData.address = this.getMajorityVote(addresses) || restaurant.address;
    verifiedData.hours = this.getMajorityVote(hours) || restaurant.hours;

    return { verifiedData, discrepancies, sources };
  }

  private async collectEnhancedPhotos(restaurant: any): Promise<EnhancedPhoto[]> {
    logger.info(`Collecting enhanced photos for ${restaurant.name}`);
    
    const photos: EnhancedPhoto[] = [];

    // Get photos from Google Places
    if (restaurant.googlePlaceId) {
      const googlePhotos = await this.getGooglePlacesPhotos(restaurant.googlePlaceId);
      photos.push(...googlePhotos.map(photo => ({
        ...photo,
        source: 'GOOGLE' as const,
        quality: this.assessPhotoQuality(photo.url),
        verified: true
      })));
    }

    // Get photos from Yelp
    if (restaurant.yelpBusinessId) {
      const yelpPhotos = await this.getYelpPhotos(restaurant.yelpBusinessId);
      photos.push(...yelpPhotos.map(photo => ({
        ...photo,
        source: 'YELP' as const,
        quality: this.assessPhotoQuality(photo.url),
        verified: true
      })));
    }

    // Get photos from Foursquare
    if (restaurant.foursquareId) {
      const foursquarePhotos = await this.getFoursquarePhotos(restaurant.foursquareId);
      photos.push(...foursquarePhotos.map(photo => ({
        ...photo,
        source: 'FOURSQUARE' as const,
        quality: this.assessPhotoQuality(photo.url),
        verified: true
      })));
    }

    // Scrape website for photos
    const websitePhotos = await this.scrapeWebsitePhotos(restaurant.website);
    photos.push(...websitePhotos.map(photo => ({
      ...photo,
      source: 'WEBSITE' as const,
      quality: this.assessPhotoQuality(photo.url),
      verified: false
    })));

    // Get Instagram photos
    const instagramPhotos = await this.getInstagramPhotos(restaurant.name, restaurant.city);
    photos.push(...instagramPhotos.map(photo => ({
      ...photo,
      source: 'INSTAGRAM' as const,
      quality: this.assessPhotoQuality(photo.url),
      verified: false
    })));

    // Remove duplicates and prioritize high-quality photos
    const uniquePhotos = this.removeDuplicatePhotos(photos);
    const sortedPhotos = this.prioritizePhotos(uniquePhotos);

    return sortedPhotos.slice(0, 20); // Limit to 20 best photos
  }

  private async validateBusinessInformation(restaurant: any) {
    logger.info(`Validating business information for ${restaurant.name}`);
    
    const validation = {
      phoneValid: await this.validatePhoneNumber(restaurant.phone),
      addressValid: await this.validateAddress(restaurant.address, restaurant.latitude, restaurant.longitude),
      websiteValid: await this.validateWebsite(restaurant.website),
      businessHours: await this.validateBusinessHours(restaurant),
      businessStatus: await this.checkBusinessStatus(restaurant)
    };

    return validation;
  }

  private async scrapeRestaurantWebsite(restaurant: any) {
    logger.info(`Scraping website for ${restaurant.name}`);
    
    if (!restaurant.website) {
      return { menuItems: [], socialMedia: {} };
    }

    try {
      const scrapedData = await this.performWebScraping(restaurant.website);
      return scrapedData;
    } catch (error) {
      logger.error(`Error scraping website for ${restaurant.name}:`, error);
      return { menuItems: [], socialMedia: {} };
    }
  }

  private async enhanceCuisineClassification(restaurant: any) {
    logger.info(`Enhancing cuisine classification for ${restaurant.name}`);
    
    const cuisineAnalysis = await this.analyzeCuisineDetails(restaurant);
    const culturalContext = await this.gatherCulturalContext(restaurant);
    const dietaryOptions = await this.identifyDietaryOptions(restaurant);

    return {
      enhancedCuisine: cuisineAnalysis,
      culturalContext,
      dietaryOptions
    };
  }

  private calculateDataQualityScore(data: any): number {
    let score = 0;
    let maxScore = 0;

    // Phone validation (20 points)
    maxScore += 20;
    if (data.validatedInfo.phoneValid) score += 20;

    // Address validation (20 points)
    maxScore += 20;
    if (data.validatedInfo.addressValid) score += 20;

    // Photo quality (25 points)
    maxScore += 25;
    const photoScore = this.calculatePhotoQualityScore(data.enhancedPhotos);
    score += photoScore;

    // Data completeness (20 points)
    maxScore += 20;
    const completenessScore = this.calculateCompletenessScore(data);
    score += completenessScore;

    // Discrepancy resolution (15 points)
    maxScore += 15;
    const discrepancyScore = this.calculateDiscrepancyScore(data.verifiedData.discrepancies);
    score += discrepancyScore;

    return Math.round((score / maxScore) * 100) / 100;
  }

  private async updateRestaurantWithEnhancedData(restaurantId: string, enhancedData: EnhancedRestaurantData) {
    // Update restaurant with enhanced data
    await prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        phone: enhancedData.phone,
        website: enhancedData.website,
        description: enhancedData.description,
        cuisine: enhancedData.cuisine,
        // Add more fields as needed
      }
    });

    // Update photos
    await prisma.photo.deleteMany({
      where: { restaurantId }
    });

    for (const photo of enhancedData.photos) {
      await prisma.photo.create({
        data: {
          restaurantId,
          url: photo.url,
          caption: photo.caption,
          isPrimary: photo.isPrimary
        }
      });
    }

    // Log data quality metrics
    await this.logDataQualityMetrics(restaurantId, enhancedData);
  }

  // Helper methods for data processing
  private getMajorityVote(values: any[]): any {
    const counts: { [key: string]: number } = {};
    values.forEach(value => {
      if (value) {
        counts[value] = (counts[value] || 0) + 1;
      }
    });
    
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, '');
  }

  private resolvePhoneDiscrepancy(phones: string[]): string {
    // Implement phone number resolution logic
    return phones[0]; // Simplified for now
  }

  private resolveAddressDiscrepancy(addresses: string[]): string {
    // Implement address resolution logic
    return addresses[0]; // Simplified for now
  }

  private resolveHoursDiscrepancy(hours: any[]): any {
    // Implement hours resolution logic
    return hours[0]; // Simplified for now
  }

  private assessPhotoQuality(url: string): 'HIGH' | 'MEDIUM' | 'LOW' {
    // Implement photo quality assessment
    return 'MEDIUM'; // Simplified for now
  }

  private removeDuplicatePhotos(photos: EnhancedPhoto[]): EnhancedPhoto[] {
    // Implement duplicate photo removal
    return photos; // Simplified for now
  }

  private prioritizePhotos(photos: EnhancedPhoto[]): EnhancedPhoto[] {
    // Implement photo prioritization logic
    return photos.sort((a, b) => {
      if (a.quality === 'HIGH' && b.quality !== 'HIGH') return -1;
      if (b.quality === 'HIGH' && a.quality !== 'HIGH') return 1;
      if (a.type === 'FOOD' && b.type !== 'FOOD') return -1;
      if (b.type === 'FOOD' && a.type !== 'FOOD') return 1;
      return 0;
    });
  }

  private calculatePhotoQualityScore(photos: EnhancedPhoto[]): number {
    if (photos.length === 0) return 0;
    
    const highQualityCount = photos.filter(p => p.quality === 'HIGH').length;
    const foodPhotoCount = photos.filter(p => p.type === 'FOOD').length;
    
    return Math.min(25, (highQualityCount * 5) + (foodPhotoCount * 3));
  }

  private calculateCompletenessScore(data: any): number {
    let score = 0;
    const requiredFields = ['phone', 'address', 'website', 'description', 'cuisine'];
    
    requiredFields.forEach(field => {
      if (data.verifiedData[field] || data.scrapedData[field]) {
        score += 4; // 4 points per field
      }
    });
    
    return Math.min(20, score);
  }

  private calculateDiscrepancyScore(discrepancies: DataDiscrepancy[]): number {
    if (discrepancies.length === 0) return 15;
    
    const resolvedDiscrepancies = discrepancies.filter(d => d.confidence > 0.7).length;
    return Math.max(0, 15 - (discrepancies.length - resolvedDiscrepancies) * 3);
  }

  private async logDataQualityMetrics(restaurantId: string, enhancedData: EnhancedRestaurantData) {
    await prisma.apiUsage.create({
      data: {
        apiName: 'DATA_ENHANCEMENT',
        endpoint: 'enhance_restaurant',
        requests: 1
      }
    });
  }

  // Placeholder methods for external API calls
  private async getGooglePlacesDetails(placeId: string) {
    // Implement Google Places details API call
    return null;
  }

  private async getYelpBusinessDetails(businessId: string) {
    // Implement Yelp business details API call
    return null;
  }

  private async getFoursquareVenueDetails(venueId: string) {
    // Implement Foursquare venue details API call
    return null;
  }

  private async getGooglePlacesPhotos(placeId: string): Promise<EnhancedPhoto[]> {
    // Implement Google Places photos API call
    return [];
  }

  private async getYelpPhotos(businessId: string): Promise<EnhancedPhoto[]> {
    // Implement Yelp photos API call
    return [];
  }

  private async getFoursquarePhotos(venueId: string): Promise<EnhancedPhoto[]> {
    // Implement Foursquare photos API call
    return [];
  }

  private async scrapeWebsitePhotos(website: string): Promise<EnhancedPhoto[]> {
    // Implement website photo scraping
    return [];
  }

  private async getInstagramPhotos(restaurantName: string, city: string): Promise<EnhancedPhoto[]> {
    // Implement Instagram photo collection
    return [];
  }

  private async validatePhoneNumber(phone: string): Promise<boolean> {
    // Implement phone number validation
    return phone ? true : false;
  }

  private async validateAddress(address: string, lat: number, lng: number): Promise<boolean> {
    // Implement address validation
    return address && lat && lng ? true : false;
  }

  private async validateWebsite(website: string): Promise<boolean> {
    // Implement website validation
    return website ? true : false;
  }

  private async validateBusinessHours(restaurant: any): Promise<BusinessHours | null> {
    // Implement business hours validation
    return null;
  }

  private async checkBusinessStatus(restaurant: any): Promise<string> {
    // Implement business status check
    return 'OPEN';
  }

  private async performWebScraping(website: string): Promise<any> {
    // Implement web scraping logic
    return { menuItems: [], socialMedia: {} };
  }

  private async analyzeCuisineDetails(restaurant: any): Promise<any> {
    // Implement cuisine analysis
    return {};
  }

  private async gatherCulturalContext(restaurant: any): Promise<CulturalContext | null> {
    // Implement cultural context gathering
    return null;
  }

  private async identifyDietaryOptions(restaurant: any): Promise<string[]> {
    // Implement dietary options identification
    return [];
  }
}

export const dataEnhancementService = new DataEnhancementService();
