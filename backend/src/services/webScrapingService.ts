// @ts-nocheck
import axios from 'axios';
import * as cheerio from 'cheerio';
import { logger } from '../utils/logger';

export interface ScrapedRestaurantData {
  menuItems: MenuItem[];
  socialMedia: SocialMediaLinks;
  businessHours: BusinessHours;
  photos: ScrapedPhoto[];
  description: string;
  specialties: string[];
  pricing: PricingInfo;
  contactInfo: ContactInfo;
  reviews: ScrapedReview[];
}

export interface MenuItem {
  name: string;
  description: string;
  price?: string;
  category: string;
  dietaryTags: string[];
  isPopular: boolean;
  ingredients?: string[];
}

export interface SocialMediaLinks {
  website?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  tiktok?: string;
  yelp?: string;
  google?: string;
}

export interface BusinessHours {
  monday: { open: string; close: string; closed: boolean };
  tuesday: { open: string; close: string; closed: boolean };
  wednesday: { open: string; close: string; closed: boolean };
  thursday: { open: string; close: string; closed: boolean };
  friday: { open: string; close: string; closed: boolean };
  saturday: { open: string; close: string; closed: boolean };
  sunday: { open: string; close: string; closed: boolean };
  specialHours?: string;
}

export interface ScrapedPhoto {
  url: string;
  alt: string;
  type: 'FOOD' | 'INTERIOR' | 'EXTERIOR' | 'MENU' | 'CHEF' | 'OTHER';
  quality: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface PricingInfo {
  averagePrice: string;
  priceRange: 'BUDGET' | 'MODERATE' | 'EXPENSIVE';
  currency: string;
  notes?: string;
}

export interface ContactInfo {
  phone?: string;
  email?: string;
  address?: string;
  reservationPhone?: string;
  cateringPhone?: string;
}

export interface ScrapedReview {
  rating: number;
  text: string;
  author: string;
  date: string;
  source: string;
}

export class WebScrapingService {
  private userAgents = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  ];

  async scrapeRestaurantWebsite(url: string): Promise<ScrapedRestaurantData> {
    try {
      logger.info(`Scraping restaurant website: ${url}`);

      const response = await this.makeRequest(url);
      const $ = cheerio.load(response.data);

      const scrapedData: ScrapedRestaurantData = {
        menuItems: await this.extractMenuItems($, url),
        socialMedia: this.extractSocialMediaLinks($),
        businessHours: this.extractBusinessHours($),
        photos: await this.extractPhotos($, url),
        description: this.extractDescription($),
        specialties: this.extractSpecialties($),
        pricing: this.extractPricingInfo($),
        contactInfo: this.extractContactInfo($),
        reviews: this.extractReviews($)
      };

      logger.info(`Successfully scraped data from ${url}`);
      return scrapedData;

    } catch (error) {
      logger.error(`Error scraping website ${url}:`, error);
      return this.getEmptyScrapedData();
    }
  }

  async scrapeInstagramProfile(username: string): Promise<ScrapedPhoto[]> {
    try {
      logger.info(`Scraping Instagram profile: ${username}`);

      // Note: Instagram scraping requires authentication and has rate limits
      // This is a simplified implementation
      const photos: ScrapedPhoto[] = [];

      // In a real implementation, you would use Instagram's API or a scraping service
      // For now, we'll return empty array
      
      return photos;

    } catch (error) {
      logger.error(`Error scraping Instagram ${username}:`, error);
      return [];
    }
  }

  async scrapeYelpBusiness(businessId: string): Promise<ScrapedRestaurantData> {
    try {
      logger.info(`Scraping Yelp business: ${businessId}`);

      const url = `https://www.yelp.com/biz/${businessId}`;
      const response = await this.makeRequest(url);
      const $ = cheerio.load(response.data);

      const scrapedData: ScrapedRestaurantData = {
        menuItems: this.extractYelpMenuItems($),
        socialMedia: this.extractYelpSocialMedia($),
        businessHours: this.extractYelpBusinessHours($),
        photos: this.extractYelpPhotos($),
        description: this.extractYelpDescription($),
        specialties: this.extractYelpSpecialties($),
        pricing: this.extractYelpPricing($),
        contactInfo: this.extractYelpContactInfo($),
        reviews: this.extractYelpReviews($)
      };

      return scrapedData;

    } catch (error) {
      logger.error(`Error scraping Yelp business ${businessId}:`, error);
      return this.getEmptyScrapedData();
    }
  }

  private async makeRequest(url: string): Promise<any> {
    const userAgent = this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      timeout: 10000,
      maxRedirects: 5
    });

    return response;
  }

  private async extractMenuItems($: any, baseUrl: string): Promise<MenuItem[]> {
    const menuItems: MenuItem[] = [];

    // Common menu selectors
    const menuSelectors = [
      '.menu-item',
      '.menu-item-name',
      '.dish',
      '.food-item',
      '.menu-section .item',
      '.menu-category .item',
      '[class*="menu"][class*="item"]',
      '.menu-list .item'
    ];

    for (const selector of menuSelectors) {
      $(selector).each((index: any, element: any) => {
        const $item = $(element);
        
        const name = this.cleanText($item.find('.name, .title, .item-name, h3, h4').first().text());
        const description = this.cleanText($item.find('.description, .details, .ingredients').first().text());
        const price = this.cleanText($item.find('.price, .cost, .amount').first().text());
        const category = this.cleanText($item.closest('.menu-section, .category').find('.section-title, .category-title').first().text());

        if (name && name.length > 2) {
          menuItems.push({
            name,
            description,
            price: price || undefined,
            category: category || 'Main',
            dietaryTags: this.extractDietaryTags(description),
            isPopular: this.isPopularItem(name, description),
            ingredients: this.extractIngredients(description)
          });
        }
      });

      if (menuItems.length > 0) break; // Stop if we found items with this selector
    }

    return menuItems;
  }

  private extractSocialMediaLinks($: any): SocialMediaLinks {
    const socialMedia: SocialMediaLinks = {};

    // Extract social media links
    $('a[href*="instagram.com"]').each((index, element) => {
      const href = $(element).attr('href');
      if (href) {
        socialMedia.instagram = this.normalizeSocialMediaUrl(href, 'instagram');
      }
    });

    $('a[href*="facebook.com"]').each((index, element) => {
      const href = $(element).attr('href');
      if (href) {
        socialMedia.facebook = this.normalizeSocialMediaUrl(href, 'facebook');
      }
    });

    $('a[href*="twitter.com"], a[href*="x.com"]').each((index, element) => {
      const href = $(element).attr('href');
      if (href) {
        socialMedia.twitter = this.normalizeSocialMediaUrl(href, 'twitter');
      }
    });

    $('a[href*="tiktok.com"]').each((index, element) => {
      const href = $(element).attr('href');
      if (href) {
        socialMedia.tiktok = this.normalizeSocialMediaUrl(href, 'tiktok');
      }
    });

    return socialMedia;
  }

  private extractBusinessHours($: any): BusinessHours {
    const hours: BusinessHours = {
      monday: { open: '', close: '', closed: false },
      tuesday: { open: '', close: '', closed: false },
      wednesday: { open: '', close: '', closed: false },
      thursday: { open: '', close: '', closed: false },
      friday: { open: '', close: '', closed: false },
      saturday: { open: '', close: '', closed: false },
      sunday: { open: '', close: '', closed: false }
    };

    // Common hours selectors
    const hoursSelectors = [
      '.hours',
      '.business-hours',
      '.opening-hours',
      '.schedule',
      '[class*="hour"]',
      '.time'
    ];

    for (const selector of hoursSelectors) {
      const $hoursContainer = $(selector);
      if ($hoursContainer.length > 0) {
        $hoursContainer.find('li, .day, .hours-item').each((index, element) => {
          const $day = $(element);
          const dayText = $day.text().toLowerCase();
          const timeText = $day.text();

          const dayMatch = dayText.match(/(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/);
          if (dayMatch) {
            const day = dayMatch[1] as keyof typeof hours;
            const timeMatch = timeText.match(/(\d{1,2}:\d{2}\s*[ap]m)\s*-\s*(\d{1,2}:\d{2}\s*[ap]m)/i);
            
            if (timeMatch) {
              hours[day] = {
                open: timeMatch[1],
                close: timeMatch[2],
                closed: false
              };
            } else if (timeText.includes('closed')) {
              hours[day] = {
                open: '',
                close: '',
                closed: true
              };
            }
          }
        });
        break;
      }
    }

    return hours;
  }

  private async extractPhotos($: any, baseUrl: string): Promise<ScrapedPhoto[]> {
    const photos: ScrapedPhoto[] = [];

    $('img').each((index, element) => {
      const $img = $(element);
      const src = $img.attr('src') || $img.attr('data-src') || $img.attr('data-lazy');
      const alt = $img.attr('alt') || '';

      if (src && this.isValidImageUrl(src)) {
        const fullUrl = this.resolveUrl(src, baseUrl);
        const type = this.classifyImageType(alt, src);
        const quality = this.assessImageQuality(fullUrl);

        photos.push({
          url: fullUrl,
          alt,
          type,
          quality
        });
      }
    });

    return photos;
  }

  private extractDescription($: any): string {
    const descriptionSelectors = [
      '.description',
      '.about',
      '.story',
      '.bio',
      '.intro',
      '.content',
      'meta[name="description"]',
      '.restaurant-description'
    ];

    for (const selector of descriptionSelectors) {
      const $desc = $(selector);
      if ($desc.length > 0) {
        const text = selector.includes('meta') ? $desc.attr('content') : $desc.text();
        if (text && text.length > 50) {
          return this.cleanText(text);
        }
      }
    }

    return '';
  }

  private extractSpecialties($: any): string[] {
    const specialties: string[] = [];

    const specialtySelectors = [
      '.specialties',
      '.signature-dishes',
      '.popular-items',
      '.featured',
      '.highlights'
    ];

    for (const selector of specialtySelectors) {
      $(selector).find('li, .item, .dish').each((index, element) => {
        const specialty = this.cleanText($(element).text());
        if (specialty && specialty.length > 3) {
          specialties.push(specialty);
        }
      });
    }

    return specialties;
  }

  private extractPricingInfo($: any): PricingInfo {
    const pricing: PricingInfo = {
      averagePrice: '',
      priceRange: 'MODERATE',
      currency: 'USD'
    };

    // Look for price indicators
    const priceText = $('.price, .cost, .pricing, [class*="price"]').text();
    const priceMatch = priceText.match(/\$(\d+)/g);
    
    if (priceMatch) {
      const prices = priceMatch.map(p => parseInt(p.replace('$', '')));
      const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
      
      pricing.averagePrice = `$${Math.round(avgPrice)}`;
      
      if (avgPrice < 15) pricing.priceRange = 'BUDGET';
      else if (avgPrice > 30) pricing.priceRange = 'EXPENSIVE';
    }

    return pricing;
  }

  private extractContactInfo($: any): ContactInfo {
    const contact: ContactInfo = {};

    // Extract phone numbers
    const phoneRegex = /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
    const text = $('body').text();
    const phoneMatch = text.match(phoneRegex);
    if (phoneMatch) {
      contact.phone = phoneMatch[0];
    }

    // Extract email
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emailMatch = text.match(emailRegex);
    if (emailMatch) {
      contact.email = emailMatch[0];
    }

    return contact;
  }

  private extractReviews($: any): ScrapedReview[] {
    const reviews: ScrapedReview[] = [];

    $('.review, .testimonial, .customer-review').each((index, element) => {
      const $review = $(element);
      const rating = this.extractRating($review);
      const text = this.cleanText($review.find('.text, .content, .review-text').text());
      const author = this.cleanText($review.find('.author, .name, .reviewer').text());
      const date = this.cleanText($review.find('.date, .time').text());

      if (text && text.length > 10) {
        reviews.push({
          rating,
          text,
          author,
          date,
          source: 'website'
        });
      }
    });

    return reviews;
  }

  // Yelp-specific extraction methods
  private extractYelpMenuItems($: any): MenuItem[] {
    // Yelp-specific menu extraction logic
    return [];
  }

  private extractYelpSocialMedia($: any): SocialMediaLinks {
    // Yelp-specific social media extraction
    return {};
  }

  private extractYelpBusinessHours($: any): BusinessHours {
    // Yelp-specific hours extraction
    return {
      monday: { open: '', close: '', closed: false },
      tuesday: { open: '', close: '', closed: false },
      wednesday: { open: '', close: '', closed: false },
      thursday: { open: '', close: '', closed: false },
      friday: { open: '', close: '', closed: false },
      saturday: { open: '', close: '', closed: false },
      sunday: { open: '', close: '', closed: false }
    };
  }

  private extractYelpPhotos($: any): ScrapedPhoto[] {
    // Yelp-specific photo extraction
    return [];
  }

  private extractYelpDescription($: any): string {
    // Yelp-specific description extraction
    return '';
  }

  private extractYelpSpecialties($: any): string[] {
    // Yelp-specific specialties extraction
    return [];
  }

  private extractYelpPricing($: any): PricingInfo {
    // Yelp-specific pricing extraction
    return {
      averagePrice: '',
      priceRange: 'MODERATE',
      currency: 'USD'
    };
  }

  private extractYelpContactInfo($: any): ContactInfo {
    // Yelp-specific contact extraction
    return {};
  }

  private extractYelpReviews($: any): ScrapedReview[] {
    // Yelp-specific reviews extraction
    return [];
  }

  // Helper methods
  private cleanText(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
  }

  private extractDietaryTags(description: string): string[] {
    const tags: string[] = [];
    const dietaryKeywords = {
      'halal': ['halal', 'halal certified'],
      'kosher': ['kosher', 'kosher certified'],
      'vegan': ['vegan', 'plant-based'],
      'vegetarian': ['vegetarian', 'veggie'],
      'gluten-free': ['gluten-free', 'gluten free', 'gf'],
      'dairy-free': ['dairy-free', 'dairy free', 'lactose-free']
    };

    const lowerDesc = description.toLowerCase();
    Object.entries(dietaryKeywords).forEach(([tag, keywords]) => {
      if (keywords.some(keyword => lowerDesc.includes(keyword))) {
        tags.push(tag);
      }
    });

    return tags;
  }

  private isPopularItem(name: string, description: string): boolean {
    const popularKeywords = ['popular', 'favorite', 'signature', 'specialty', 'best', 'recommended'];
    const text = (name + ' ' + description).toLowerCase();
    return popularKeywords.some(keyword => text.includes(keyword));
  }

  private extractIngredients(description: string): string[] {
    // Simple ingredient extraction - could be enhanced with NLP
    const commonIngredients = ['chicken', 'beef', 'lamb', 'fish', 'rice', 'beans', 'tomatoes', 'onions', 'garlic', 'ginger'];
    const foundIngredients: string[] = [];
    
    const lowerDesc = description.toLowerCase();
    commonIngredients.forEach(ingredient => {
      if (lowerDesc.includes(ingredient)) {
        foundIngredients.push(ingredient);
      }
    });

    return foundIngredients;
  }

  private normalizeSocialMediaUrl(url: string, platform: string): string {
    // Normalize social media URLs
    if (url.includes('instagram.com')) {
      const match = url.match(/instagram\.com\/([^\/\?]+)/);
      return match ? `https://instagram.com/${match[1]}` : url;
    }
    return url;
  }

  private isValidImageUrl(url: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some(ext => url.toLowerCase().includes(ext));
  }

  private resolveUrl(url: string, baseUrl: string): string {
    if (url.startsWith('http')) return url;
    if (url.startsWith('//')) return 'https:' + url;
    if (url.startsWith('/')) {
      const base = new URL(baseUrl);
      return base.origin + url;
    }
    return new URL(url, baseUrl).href;
  }

  private classifyImageType(alt: string, src: string): 'FOOD' | 'INTERIOR' | 'EXTERIOR' | 'MENU' | 'CHEF' | 'OTHER' {
    const altLower = alt.toLowerCase();
    const srcLower = src.toLowerCase();

    if (altLower.includes('food') || altLower.includes('dish') || altLower.includes('meal')) return 'FOOD';
    if (altLower.includes('interior') || altLower.includes('inside') || altLower.includes('dining')) return 'INTERIOR';
    if (altLower.includes('exterior') || altLower.includes('outside') || altLower.includes('building')) return 'EXTERIOR';
    if (altLower.includes('menu') || srcLower.includes('menu')) return 'MENU';
    if (altLower.includes('chef') || altLower.includes('cook')) return 'CHEF';
    
    return 'OTHER';
  }

  private assessImageQuality(url: string): 'HIGH' | 'MEDIUM' | 'LOW' {
    // Simple quality assessment based on URL patterns
    if (url.includes('high') || url.includes('large') || url.includes('hd')) return 'HIGH';
    if (url.includes('medium') || url.includes('med')) return 'MEDIUM';
    return 'LOW';
  }

  private extractRating($element: any): number {
    // Extract rating from various formats
    const ratingText = $element.find('.rating, .stars, .score').text();
    const ratingMatch = ratingText.match(/(\d+(?:\.\d+)?)/);
    return ratingMatch ? parseFloat(ratingMatch[1]) : 0;
  }

  private getEmptyScrapedData(): ScrapedRestaurantData {
    return {
      menuItems: [],
      socialMedia: {},
      businessHours: {
        monday: { open: '', close: '', closed: false },
        tuesday: { open: '', close: '', closed: false },
        wednesday: { open: '', close: '', closed: false },
        thursday: { open: '', close: '', closed: false },
        friday: { open: '', close: '', closed: false },
        saturday: { open: '', close: '', closed: false },
        sunday: { open: '', close: '', closed: false }
      },
      photos: [],
      description: '',
      specialties: [],
      pricing: {
        averagePrice: '',
        priceRange: 'MODERATE',
        currency: 'USD'
      },
      contactInfo: {},
      reviews: []
    };
  }
}

export const webScrapingService = new WebScrapingService();
