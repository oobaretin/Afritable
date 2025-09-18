// @ts-nocheck
import axios from 'axios';
import { logger } from '../utils/logger';
import { apiIntegrations } from './apiIntegrations';

export interface PhotoCollectionResult {
  photos: EnhancedPhoto[];
  totalCollected: number;
  highQualityCount: number;
  foodPhotoCount: number;
  sources: string[];
}

export interface EnhancedPhoto {
  url: string;
  source: 'GOOGLE' | 'YELP' | 'FOURSQUARE' | 'WEBSITE' | 'INSTAGRAM' | 'FACEBOOK' | 'MANUAL';
  type: 'FOOD' | 'INTERIOR' | 'EXTERIOR' | 'MENU' | 'CHEF' | 'STAFF' | 'OTHER';
  quality: 'HIGH' | 'MEDIUM' | 'LOW';
  isPrimary: boolean;
  caption?: string;
  verified: boolean;
  dimensions?: { width: number; height: number };
  fileSize?: number;
  tags?: string[];
  culturalContext?: string;
}

export interface PhotoQualityMetrics {
  resolution: number;
  clarity: number;
  composition: number;
  relevance: number;
  overall: number;
}

export class PhotoEnhancementService {
  private qualityThresholds = {
    MIN_RESOLUTION: 800,
    MIN_FILE_SIZE: 50000, // 50KB
    MAX_FILE_SIZE: 10000000, // 10MB
    HIGH_QUALITY_SCORE: 0.8,
    MEDIUM_QUALITY_SCORE: 0.6
  };

  async collectAllPhotos(restaurant: any): Promise<PhotoCollectionResult> {
    logger.info(`Starting comprehensive photo collection for ${restaurant.name}`);

    const allPhotos: EnhancedPhoto[] = [];
    const sources: string[] = [];

    try {
      // Collect from Google Places
      if (restaurant.googlePlaceId) {
        const googlePhotos = await this.collectGooglePlacesPhotos(restaurant.googlePlaceId);
        allPhotos.push(...googlePhotos);
        sources.push('Google Places');
      }

      // Collect from Yelp
      if (restaurant.yelpBusinessId) {
        const yelpPhotos = await this.collectYelpPhotos(restaurant.yelpBusinessId);
        allPhotos.push(...yelpPhotos);
        sources.push('Yelp');
      }

      // Collect from Foursquare
      if (restaurant.foursquareId) {
        const foursquarePhotos = await this.collectFoursquarePhotos(restaurant.foursquareId);
        allPhotos.push(...foursquarePhotos);
        sources.push('Foursquare');
      }

      // Collect from website
      if (restaurant.website) {
        const websitePhotos = await this.collectWebsitePhotos(restaurant.website);
        allPhotos.push(...websitePhotos);
        sources.push('Website');
      }

      // Collect from Instagram
      const instagramPhotos = await this.collectInstagramPhotos(restaurant.name, restaurant.city);
      allPhotos.push(...instagramPhotos);
      if (instagramPhotos.length > 0) sources.push('Instagram');

      // Collect from Facebook
      const facebookPhotos = await this.collectFacebookPhotos(restaurant.name, restaurant.city);
      allPhotos.push(...facebookPhotos);
      if (facebookPhotos.length > 0) sources.push('Facebook');

      // Process and enhance photos
      const processedPhotos = await this.processAndEnhancePhotos(allPhotos, restaurant);

      // Remove duplicates and prioritize
      const uniquePhotos = this.removeDuplicatePhotos(processedPhotos);
      const prioritizedPhotos = this.prioritizePhotos(uniquePhotos);

      const result: PhotoCollectionResult = {
        photos: prioritizedPhotos.slice(0, 25), // Limit to 25 best photos
        totalCollected: allPhotos.length,
        highQualityCount: prioritizedPhotos.filter(p => p.quality === 'HIGH').length,
        foodPhotoCount: prioritizedPhotos.filter(p => p.type === 'FOOD').length,
        sources
      };

      logger.info(`Photo collection completed for ${restaurant.name}: ${result.photos.length} photos from ${sources.length} sources`);
      return result;

    } catch (error) {
      logger.error(`Error collecting photos for ${restaurant.name}:`, error);
      return {
        photos: [],
        totalCollected: 0,
        highQualityCount: 0,
        foodPhotoCount: 0,
        sources: []
      };
    }
  }

  private async collectGooglePlacesPhotos(placeId: string): Promise<EnhancedPhoto[]> {
    try {
      const photos: EnhancedPhoto[] = [];
      
      // Get place details with photos
      const placeDetails = await apiIntegrations.getGooglePlaceDetails(placeId);
      
      if (placeDetails?.photos) {
        for (const photo of placeDetails.photos.slice(0, 10)) { // Limit to 10 photos
          const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}`;
          
          const enhancedPhoto: EnhancedPhoto = {
            url: photoUrl,
            source: 'GOOGLE',
            type: this.classifyPhotoType(photo.html_attributions?.[0] || '', photoUrl),
            quality: 'HIGH', // Google photos are generally high quality
            isPrimary: false,
            caption: photo.html_attributions?.[0] || undefined,
            verified: true,
            tags: this.extractPhotoTags(photo.html_attributions?.[0] || '')
          };

          photos.push(enhancedPhoto);
        }
      }

      return photos;
    } catch (error) {
      logger.error(`Error collecting Google Places photos for ${placeId}:`, error);
      return [];
    }
  }

  private async collectYelpPhotos(businessId: string): Promise<EnhancedPhoto[]> {
    try {
      const photos: EnhancedPhoto[] = [];
      
      // Get Yelp business details with photos
      const businessDetails = await apiIntegrations.getYelpBusinessDetails(businessId);
      
      if (businessDetails?.photos) {
        for (const photoUrl of businessDetails.photos.slice(0, 10)) {
          const enhancedPhoto: EnhancedPhoto = {
            url: photoUrl,
            source: 'YELP',
            type: this.classifyPhotoType('', photoUrl),
            quality: 'HIGH',
            isPrimary: false,
            verified: true,
            tags: this.extractPhotoTags('')
          };

          photos.push(enhancedPhoto);
        }
      }

      return photos;
    } catch (error) {
      logger.error(`Error collecting Yelp photos for ${businessId}:`, error);
      return [];
    }
  }

  private async collectFoursquarePhotos(venueId: string): Promise<EnhancedPhoto[]> {
    try {
      const photos: EnhancedPhoto[] = [];
      
      // Get Foursquare venue details with photos
      const venueDetails = await apiIntegrations.getFoursquareVenueDetails(venueId);
      
      if (venueDetails?.photos) {
        for (const photo of venueDetails.photos.slice(0, 10)) {
          const enhancedPhoto: EnhancedPhoto = {
            url: photo.url,
            source: 'FOURSQUARE',
            type: this.classifyPhotoType(photo.caption || '', photo.url),
            quality: 'MEDIUM',
            isPrimary: false,
            caption: photo.caption,
            verified: true,
            tags: this.extractPhotoTags(photo.caption || '')
          };

          photos.push(enhancedPhoto);
        }
      }

      return photos;
    } catch (error) {
      logger.error(`Error collecting Foursquare photos for ${venueId}:`, error);
      return [];
    }
  }

  private async collectWebsitePhotos(website: string): Promise<EnhancedPhoto[]> {
    try {
      const photos: EnhancedPhoto[] = [];
      
      // This would integrate with the web scraping service
      // For now, return empty array
      
      return photos;
    } catch (error) {
      logger.error(`Error collecting website photos for ${website}:`, error);
      return [];
    }
  }

  private async collectInstagramPhotos(restaurantName: string, city: string): Promise<EnhancedPhoto[]> {
    try {
      const photos: EnhancedPhoto[] = [];
      
      // Instagram API integration would go here
      // This requires Instagram Basic Display API or Instagram Graph API
      // For now, return empty array
      
      return photos;
    } catch (error) {
      logger.error(`Error collecting Instagram photos for ${restaurantName}:`, error);
      return [];
    }
  }

  private async collectFacebookPhotos(restaurantName: string, city: string): Promise<EnhancedPhoto[]> {
    try {
      const photos: EnhancedPhoto[] = [];
      
      // Facebook Graph API integration would go here
      // For now, return empty array
      
      return photos;
    } catch (error) {
      logger.error(`Error collecting Facebook photos for ${restaurantName}:`, error);
      return [];
    }
  }

  private async processAndEnhancePhotos(photos: EnhancedPhoto[], restaurant: any): Promise<EnhancedPhoto[]> {
    const processedPhotos: EnhancedPhoto[] = [];

    for (const photo of photos) {
      try {
        // Assess photo quality
        const qualityMetrics = await this.assessPhotoQuality(photo.url);
        photo.quality = this.determineQualityLevel(qualityMetrics.overall);
        
        // Get photo dimensions and file size
        const photoInfo = await this.getPhotoInfo(photo.url);
        photo.dimensions = photoInfo.dimensions;
        photo.fileSize = photoInfo.fileSize;

        // Add cultural context
        photo.culturalContext = this.addCulturalContext(photo, restaurant);

        // Filter out low-quality photos
        if (photo.quality !== 'LOW' || this.isCulturallySignificant(photo)) {
          processedPhotos.push(photo);
        }

      } catch (error) {
        logger.error(`Error processing photo ${photo.url}:`, error);
        // Keep the photo even if processing fails
        processedPhotos.push(photo);
      }
    }

    return processedPhotos;
  }

  private async assessPhotoQuality(url: string): Promise<PhotoQualityMetrics> {
    try {
      // In a real implementation, you would analyze the actual image
      // For now, we'll use heuristics based on URL and metadata
      
      const resolution = this.estimateResolution(url);
      const clarity = this.estimateClarity(url);
      const composition = this.estimateComposition(url);
      const relevance = this.estimateRelevance(url);

      const overall = (resolution + clarity + composition + relevance) / 4;

      return {
        resolution,
        clarity,
        composition,
        relevance,
        overall
      };
    } catch (error) {
      logger.error(`Error assessing photo quality for ${url}:`, error);
      return {
        resolution: 0.5,
        clarity: 0.5,
        composition: 0.5,
        relevance: 0.5,
        overall: 0.5
      };
    }
  }

  private async getPhotoInfo(url: string): Promise<{ dimensions?: { width: number; height: number }; fileSize?: number }> {
    try {
      // In a real implementation, you would fetch the image headers
      // For now, return estimated values
      return {
        dimensions: { width: 800, height: 600 },
        fileSize: 150000 // 150KB
      };
    } catch (error) {
      return {};
    }
  }

  private classifyPhotoType(caption: string, url: string): 'FOOD' | 'INTERIOR' | 'EXTERIOR' | 'MENU' | 'CHEF' | 'STAFF' | 'OTHER' {
    const text = (caption + ' ' + url).toLowerCase();
    
    if (text.includes('food') || text.includes('dish') || text.includes('meal') || text.includes('plate')) {
      return 'FOOD';
    }
    if (text.includes('interior') || text.includes('inside') || text.includes('dining') || text.includes('restaurant')) {
      return 'INTERIOR';
    }
    if (text.includes('exterior') || text.includes('outside') || text.includes('building') || text.includes('storefront')) {
      return 'EXTERIOR';
    }
    if (text.includes('menu') || text.includes('board')) {
      return 'MENU';
    }
    if (text.includes('chef') || text.includes('cook') || text.includes('kitchen')) {
      return 'CHEF';
    }
    if (text.includes('staff') || text.includes('server') || text.includes('waiter')) {
      return 'STAFF';
    }
    
    return 'OTHER';
  }

  private extractPhotoTags(caption: string): string[] {
    const tags: string[] = [];
    const text = caption.toLowerCase();
    
    const tagKeywords = {
      'african': ['african', 'ethiopian', 'nigerian', 'moroccan', 'egyptian', 'kenyan', 'ghanaian'],
      'food': ['food', 'dish', 'meal', 'cuisine', 'cooking'],
      'traditional': ['traditional', 'authentic', 'homemade', 'family'],
      'spicy': ['spicy', 'hot', 'pepper', 'chili'],
      'halal': ['halal', 'muslim', 'islamic'],
      'vegetarian': ['vegetarian', 'vegan', 'plant-based']
    };

    Object.entries(tagKeywords).forEach(([tag, keywords]) => {
      if (keywords.some(keyword => text.includes(keyword))) {
        tags.push(tag);
      }
    });

    return tags;
  }

  private addCulturalContext(photo: EnhancedPhoto, restaurant: any): string {
    const context: string[] = [];
    
    if (photo.tags?.includes('african')) {
      context.push('African cuisine');
    }
    if (photo.tags?.includes('traditional')) {
      context.push('Traditional preparation');
    }
    if (photo.tags?.includes('halal')) {
      context.push('Halal certified');
    }
    if (photo.type === 'FOOD') {
      context.push('Authentic dishes');
    }
    
    return context.join(', ');
  }

  private isCulturallySignificant(photo: EnhancedPhoto): boolean {
    return photo.tags?.includes('african') || 
           photo.tags?.includes('traditional') || 
           photo.type === 'FOOD' ||
           photo.culturalContext?.includes('African');
  }

  private removeDuplicatePhotos(photos: EnhancedPhoto[]): EnhancedPhoto[] {
    const seen = new Set<string>();
    const unique: EnhancedPhoto[] = [];

    for (const photo of photos) {
      // Create a simple hash of the photo URL and type
      const key = `${photo.url}_${photo.type}`;
      
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(photo);
      }
    }

    return unique;
  }

  private prioritizePhotos(photos: EnhancedPhoto[]): EnhancedPhoto[] {
    return photos.sort((a, b) => {
      // Prioritize food photos
      if (a.type === 'FOOD' && b.type !== 'FOOD') return -1;
      if (b.type === 'FOOD' && a.type !== 'FOOD') return 1;
      
      // Prioritize high quality
      if (a.quality === 'HIGH' && b.quality !== 'HIGH') return -1;
      if (b.quality === 'HIGH' && a.quality !== 'HIGH') return 1;
      
      // Prioritize verified photos
      if (a.verified && !b.verified) return -1;
      if (b.verified && !a.verified) return 1;
      
      // Prioritize culturally significant
      if (this.isCulturallySignificant(a) && !this.isCulturallySignificant(b)) return -1;
      if (this.isCulturallySignificant(b) && !this.isCulturallySignificant(a)) return 1;
      
      return 0;
    });
  }

  private determineQualityLevel(score: number): 'HIGH' | 'MEDIUM' | 'LOW' {
    if (score >= this.qualityThresholds.HIGH_QUALITY_SCORE) return 'HIGH';
    if (score >= this.qualityThresholds.MEDIUM_QUALITY_SCORE) return 'MEDIUM';
    return 'LOW';
  }

  private estimateResolution(url: string): number {
    // Estimate resolution based on URL patterns
    if (url.includes('maxwidth=1200') || url.includes('large') || url.includes('hd')) return 0.9;
    if (url.includes('maxwidth=800') || url.includes('medium')) return 0.7;
    if (url.includes('maxwidth=400') || url.includes('small')) return 0.5;
    return 0.6;
  }

  private estimateClarity(url: string): number {
    // Estimate clarity based on source
    if (url.includes('googleapis.com')) return 0.9;
    if (url.includes('yelpcdn.com')) return 0.8;
    if (url.includes('foursquare.com')) return 0.7;
    return 0.6;
  }

  private estimateComposition(url: string): number {
    // Estimate composition (simplified)
    return 0.7;
  }

  private estimateRelevance(url: string): number {
    // Estimate relevance to African cuisine
    const text = url.toLowerCase();
    if (text.includes('african') || text.includes('ethiopian') || text.includes('nigerian')) return 0.9;
    return 0.6;
  }

  async optimizePhotoForWeb(photoUrl: string): Promise<string> {
    try {
      // In a real implementation, you would:
      // 1. Download the image
      // 2. Resize it to optimal dimensions
      // 3. Compress it for web
      // 4. Upload to CDN
      // 5. Return optimized URL
      
      // For now, return the original URL
      return photoUrl;
    } catch (error) {
      logger.error(`Error optimizing photo ${photoUrl}:`, error);
      return photoUrl;
    }
  }

  async generatePhotoVariants(photoUrl: string): Promise<{ thumbnail: string; medium: string; large: string }> {
    try {
      // Generate different sizes for responsive design
      return {
        thumbnail: photoUrl + '&maxwidth=200',
        medium: photoUrl + '&maxwidth=600',
        large: photoUrl + '&maxwidth=1200'
      };
    } catch (error) {
      logger.error(`Error generating photo variants for ${photoUrl}:`, error);
      return {
        thumbnail: photoUrl,
        medium: photoUrl,
        large: photoUrl
      };
    }
  }
}

export const photoEnhancementService = new PhotoEnhancementService();
