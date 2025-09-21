import { PrismaClient } from '@prisma/client';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

interface RestaurantData {
  name: string;
  address: string;
  phone?: string;
  website?: string;
  photos: string[];
  rating?: number;
  reviewCount?: number;
}

class AfricanRestaurantEnhancer {
  private browser: any;
  private page: any;
  private enhancedCount = 0;
  private errorCount = 0;

  async initialize() {
    console.log('🚀 Initializing browser...');
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    
    // Set user agent to avoid detection
    await this.page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // Set viewport
    await this.page.setViewport({ width: 1366, height: 768 });
  }

  async enhanceRestaurant(restaurant: any): Promise<RestaurantData | null> {
    try {
      const searchQuery = `${restaurant.name} ${restaurant.address}`;
      console.log(`🔍 Searching for: ${searchQuery}`);
      
      // Navigate to Google Maps
      await this.page.goto('https://www.google.com/maps', { waitUntil: 'networkidle2' });
      
      // Wait for search box and enter query
      await this.page.waitForSelector('input#searchboxinput', { timeout: 10000 });
      await this.page.type('input#searchboxinput', searchQuery);
      await this.page.keyboard.press('Enter');
      
      // Wait for results
      await this.page.waitForTimeout(3000);
      
      // Try to click on the first result
      try {
        await this.page.waitForSelector('[data-result-index="0"]', { timeout: 5000 });
        await this.page.click('[data-result-index="0"]');
        await this.page.waitForTimeout(2000);
      } catch (e) {
        console.log('⚠️  Could not click first result, trying alternative...');
        // Try clicking on the first business card
        try {
          await this.page.waitForSelector('[role="article"]', { timeout: 5000 });
          await this.page.click('[role="article"]');
          await this.page.waitForTimeout(2000);
        } catch (e2) {
          console.log('⚠️  Could not find business card');
          return null;
        }
      }
      
      // Extract data from the business page
      const restaurantData = await this.page.evaluate(() => {
        const result = {
          name: '',
          address: '',
          phone: '',
          website: '',
          photos: [] as string[],
          rating: 0,
          reviewCount: 0
        };
        
        try {
          // Get business name
          const nameElement = (document as any).querySelector('h1[data-attrid="title"]') || 
                             (document as any).querySelector('h1') ||
                             (document as any).querySelector('[data-attrid="title"]');
          if (nameElement) {
            result.name = nameElement.textContent?.trim() || '';
          }
          
          // Get address
          const addressElement = (document as any).querySelector('[data-item-id="address"]') ||
                                (document as any).querySelector('[data-attrid="kc:/location/location:address"]') ||
                                (document as any).querySelector('button[data-item-id="address"]');
          if (addressElement) {
            result.address = addressElement.textContent?.trim() || '';
          }
          
          // Get phone number
          const phoneElement = (document as any).querySelector('[data-item-id="phone"]') ||
                              (document as any).querySelector('[data-attrid="kc:/business/telephone:telephone"]') ||
                              (document as any).querySelector('button[data-item-id="phone"]');
          if (phoneElement) {
            result.phone = phoneElement.textContent?.trim() || '';
          }
          
          // Get website
          const websiteElement = (document as any).querySelector('[data-item-id="authority"]') ||
                                (document as any).querySelector('[data-attrid="kc:/business/website:website"]') ||
                                (document as any).querySelector('a[data-item-id="authority"]');
          if (websiteElement) {
            result.website = websiteElement.getAttribute('href') || websiteElement.textContent?.trim() || '';
          }
          
          // Get rating
          const ratingElement = (document as any).querySelector('[data-attrid="kc:/business/rating:rating"]') ||
                               (document as any).querySelector('[aria-label*="stars"]');
          if (ratingElement) {
            const ratingText = ratingElement.textContent || ratingElement.getAttribute('aria-label') || '';
            const ratingMatch = ratingText.match(/(\d+\.?\d*)/);
            if (ratingMatch) {
              result.rating = parseFloat(ratingMatch[1]);
            }
          }
          
          // Get review count
          const reviewElement = (document as any).querySelector('[data-attrid="kc:/business/rating:review_count"]') ||
                               (document as any).querySelector('[aria-label*="reviews"]');
          if (reviewElement) {
            const reviewText = reviewElement.textContent || reviewElement.getAttribute('aria-label') || '';
            const reviewMatch = reviewText.match(/(\d+)/);
            if (reviewMatch) {
              result.reviewCount = parseInt(reviewMatch[1]);
            }
          }
          
          // Get photos (try to find photo elements)
          const photoElements = (document as any).querySelectorAll('img[src*="googleusercontent.com"], img[src*="maps.googleapis.com"]');
          photoElements.forEach((img: any, index: number) => {
            if (index < 5 && img.getAttribute('src')) { // Limit to 5 photos
              result.photos.push(img.getAttribute('src'));
            }
          });
          
        } catch (error) {
          console.log('Error in page evaluation:', error);
        }
        
        return result;
      }) as RestaurantData;
      
      // Clean up the data
      if (restaurantData.phone) {
        restaurantData.phone = restaurantData.phone.replace(/[^\d\-\+\(\)\s]/g, '').trim();
      }
      
      if (restaurantData.website && !restaurantData.website.startsWith('http')) {
        restaurantData.website = 'https://' + restaurantData.website;
      }
      
      console.log(`✅ Found data for ${restaurant.name}:`, {
        phone: restaurantData.phone ? 'Yes' : 'No',
        website: restaurantData.website ? 'Yes' : 'No',
        photos: restaurantData.photos.length,
        rating: restaurantData.rating
      });
      
      return restaurantData;
      
    } catch (error) {
      console.log(`❌ Error enhancing ${restaurant.name}:`, (error as Error).message);
      this.errorCount++;
      return null;
    }
  }

  async updateRestaurant(restaurant: any, enhancedData: RestaurantData) {
    try {
      const updateData: any = {};
      
      // Update phone if found and not already present
      if (enhancedData.phone && !restaurant.phone) {
        updateData.phone = enhancedData.phone;
      }
      
      // Update website if found and not already present
      if (enhancedData.website && !restaurant.website) {
        updateData.website = enhancedData.website;
      }
      
      // Update rating if found and better than current
      if (enhancedData.rating && enhancedData.rating > (restaurant.rating || 0)) {
        updateData.rating = enhancedData.rating;
      }
      
      // Add photos if found
      if (enhancedData.photos.length > 0) {
        // Create photo records
        const photoRecords = enhancedData.photos.map((url, index) => ({
          url,
          isPrimary: index === 0,
          restaurantId: restaurant.id
        }));
        
        // Delete existing photos and add new ones
        await prisma.photo.deleteMany({
          where: { restaurantId: restaurant.id }
        });
        
        await prisma.photo.createMany({
          data: photoRecords
        });
      }
      
      // Update restaurant if we have any data to update
      if (Object.keys(updateData).length > 0) {
        await prisma.restaurant.update({
          where: { id: restaurant.id },
          data: updateData
        });
        
        this.enhancedCount++;
        console.log(`✅ Updated ${restaurant.name} with:`, Object.keys(updateData));
      }
      
    } catch (error) {
      console.log(`❌ Error updating ${restaurant.name}:`, (error as Error).message);
    }
  }

  async enhanceRestaurants(limit = 50) {
    console.log(`🎯 Starting enhancement of ${limit} African restaurants...`);
    
    // Get restaurants that need enhancement (missing phone, website, or photos)
    const restaurants = await prisma.restaurant.findMany({
      where: {
        isActive: true,
        OR: [
          { phone: null },
          { website: null },
          { photos: { none: {} } }
        ]
      },
      take: limit,
      orderBy: { rating: 'desc' } // Start with higher rated restaurants
    });
    
    console.log(`📊 Found ${restaurants.length} restaurants to enhance`);
    
    for (let i = 0; i < restaurants.length; i++) {
      const restaurant = restaurants[i];
      console.log(`\n📍 [${i + 1}/${restaurants.length}] Enhancing: ${restaurant.name}`);
      
      const enhancedData = await this.enhanceRestaurant(restaurant);
      
      if (enhancedData) {
        await this.updateRestaurant(restaurant, enhancedData);
      }
      
      // Add delay to avoid being blocked
      await this.page.waitForTimeout(2000);
      
      // Save progress every 10 restaurants
      if ((i + 1) % 10 === 0) {
        console.log(`\n📈 Progress: ${i + 1}/${restaurants.length} completed`);
        console.log(`✅ Enhanced: ${this.enhancedCount}, ❌ Errors: ${this.errorCount}`);
      }
    }
    
    console.log(`\n🎉 Enhancement complete!`);
    console.log(`✅ Successfully enhanced: ${this.enhancedCount} restaurants`);
    console.log(`❌ Errors encountered: ${this.errorCount} restaurants`);
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
    await prisma.$disconnect();
  }
}

async function main() {
  const enhancer = new AfricanRestaurantEnhancer();
  
  try {
    await enhancer.initialize();
    
    // Start with a small batch to test
    const limit = process.argv[2] ? parseInt(process.argv[2]) : 20;
    await enhancer.enhanceRestaurants(limit);
    
  } catch (error) {
    console.error('❌ Enhancement failed:', error);
  } finally {
    await enhancer.close();
  }
}

if (require.main === module) {
  main();
}

export { AfricanRestaurantEnhancer };
