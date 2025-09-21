import { PrismaClient } from '@prisma/client';
import puppeteer from 'puppeteer';

const prisma = new PrismaClient();

interface RealRestaurantData {
  name: string;
  phone?: string;
  website?: string;
  photos: string[];
  rating?: number;
  reviewCount?: number;
}

class RealGoogleMapsEnhancer {
  private browser: any;
  private page: any;
  private enhancedCount = 0;
  private errorCount = 0;

  async initialize() {
    console.log('🚀 Initializing browser for real Google Maps scraping...');
    this.browser = await puppeteer.launch({
      headless: false, // Set to false to see what's happening
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
    });
    this.page = await this.browser.newPage();
    
    // Set realistic user agent
    await this.page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Set viewport
    await this.page.setViewport({ width: 1366, height: 768 });
    
    // Block images and CSS to speed up loading
    await this.page.setRequestInterception(true);
    this.page.on('request', (req: any) => {
      if (req.resourceType() === 'image' || req.resourceType() === 'stylesheet') {
        req.abort();
      } else {
        req.continue();
      }
    });
  }

  async searchAndExtractData(restaurant: any): Promise<RealRestaurantData | null> {
    try {
      const searchQuery = `${restaurant.name} ${restaurant.address}`;
      console.log(`🔍 Searching Google Maps for: ${searchQuery}`);
      
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
      
      // Extract real data from the business page
      const realData = await this.page.evaluate(() => {
        const result = {
          name: '',
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
          
          // Get phone number - try multiple selectors
          const phoneSelectors = [
            '[data-item-id="phone"]',
            '[data-attrid="kc:/business/telephone:telephone"]',
            'button[data-item-id="phone"]',
            '[aria-label*="phone"]',
            '[aria-label*="call"]'
          ];
          
          for (const selector of phoneSelectors) {
            const phoneElement = (document as any).querySelector(selector);
            if (phoneElement) {
              const phoneText = phoneElement.textContent || phoneElement.getAttribute('aria-label') || '';
              if (phoneText && phoneText.match(/\d/)) {
                result.phone = phoneText.trim();
                break;
              }
            }
          }
          
          // Get website - try multiple selectors
          const websiteSelectors = [
            '[data-item-id="authority"]',
            '[data-attrid="kc:/business/website:website"]',
            'a[data-item-id="authority"]',
            '[aria-label*="website"]',
            '[aria-label*="web"]'
          ];
          
          for (const selector of websiteSelectors) {
            const websiteElement = (document as any).querySelector(selector);
            if (websiteElement) {
              const websiteUrl = websiteElement.getAttribute('href') || websiteElement.textContent?.trim() || '';
              if (websiteUrl && (websiteUrl.startsWith('http') || websiteUrl.includes('.'))) {
                result.website = websiteUrl;
                break;
              }
            }
          }
          
          // Get rating
          const ratingElement = (document as any).querySelector('[data-attrid="kc:/business/rating:rating"]') ||
                               (document as any).querySelector('[aria-label*="stars"]') ||
                               (document as any).querySelector('[aria-label*="rating"]');
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
          
          // Get photos - look for actual Google Maps photo URLs
          const photoElements = (document as any).querySelectorAll('img[src*="googleusercontent.com"], img[src*="maps.googleapis.com"], img[src*="lh3.googleusercontent.com"]');
          photoElements.forEach((img: any, index: number) => {
            if (index < 3 && img.getAttribute('src')) { // Limit to 3 photos
              const src = img.getAttribute('src');
              if (src && !src.includes('data:image')) { // Avoid data URLs
                result.photos.push(src);
              }
            }
          });
          
        } catch (error) {
          console.log('Error in page evaluation:', error);
        }
        
        return result;
      }) as RealRestaurantData;
      
      // Clean up the data
      if (realData.phone) {
        // Clean phone number - keep only digits, spaces, dashes, parentheses, and plus
        realData.phone = realData.phone.replace(/[^\d\-\+\(\)\s]/g, '').trim();
        // Remove if it's still a placeholder
        if (realData.phone.includes('555') || realData.phone.length < 10) {
          realData.phone = '';
        }
      }
      
      if (realData.website) {
        // Clean website URL
        if (!realData.website.startsWith('http')) {
          realData.website = 'https://' + realData.website;
        }
        // Remove if it's a placeholder
        if (realData.website.includes('example') || realData.website.includes('placeholder')) {
          realData.website = '';
        }
      }
      
      // Filter out placeholder photos
      realData.photos = realData.photos.filter((photo: string) => 
        !photo.includes('unsplash.com') && 
        !photo.includes('example') && 
        !photo.includes('placeholder')
      );
      
      console.log(`✅ Found real data for ${restaurant.name}:`, {
        phone: realData.phone ? 'Yes' : 'No',
        website: realData.website ? 'Yes' : 'No',
        photos: realData.photos.length,
        rating: realData.rating
      });
      
      return realData;
      
    } catch (error) {
      console.log(`❌ Error enhancing ${restaurant.name}:`, (error as Error).message);
      this.errorCount++;
      return null;
    }
  }

  async updateRestaurantWithRealData(restaurant: any, realData: RealRestaurantData) {
    try {
      const updateData: any = {};
      
      // Update phone if found and not placeholder
      if (realData.phone && realData.phone !== '(555) 000-0000' && !restaurant.phone?.includes('555')) {
        updateData.phone = realData.phone;
      }
      
      // Update website if found and not placeholder
      if (realData.website && !realData.website.includes('example') && !restaurant.website?.includes('example')) {
        updateData.website = realData.website;
      }
      
      // Update rating if found and better than current
      if (realData.rating && realData.rating > (restaurant.rating || 0)) {
        updateData.rating = realData.rating;
      }
      
      // Add real photos if found
      if (realData.photos.length > 0) {
        // Delete existing placeholder photos
        await prisma.photo.deleteMany({
          where: { 
            restaurantId: restaurant.id,
            OR: [
              { url: { contains: 'unsplash.com' } },
              { url: { contains: 'example' } }
            ]
          }
        });
        
        // Create real photo records
        const photoRecords = realData.photos.map((url, index) => ({
          url,
          isPrimary: index === 0,
          restaurantId: restaurant.id
        }));
        
        await prisma.photo.createMany({
          data: photoRecords
        });
      }
      
      // Update restaurant if we have real data to update
      if (Object.keys(updateData).length > 0) {
        await prisma.restaurant.update({
          where: { id: restaurant.id },
          data: updateData
        });
        
        this.enhancedCount++;
        console.log(`✅ Updated ${restaurant.name} with REAL data:`, Object.keys(updateData));
      } else {
        console.log(`ℹ️  ${restaurant.name} - no new real data found`);
      }
      
    } catch (error) {
      console.log(`❌ Error updating ${restaurant.name}:`, (error as Error).message);
    }
  }

  async enhanceWithRealData(limit = 10) {
    console.log(`🎯 Starting REAL Google Maps enhancement of ${limit} restaurants...`);
    
    // Get restaurants that have placeholder data
    const restaurants = await prisma.restaurant.findMany({
      where: {
        isActive: true,
        OR: [
          { phone: { contains: '555' } },
          { website: { contains: 'example' } },
          { photos: { some: { url: { contains: 'unsplash.com' } } } }
        ]
      },
      take: limit,
      orderBy: { rating: 'desc' }
    });
    
    console.log(`📊 Found ${restaurants.length} restaurants with placeholder data to enhance`);
    
    for (let i = 0; i < restaurants.length; i++) {
      const restaurant = restaurants[i];
      console.log(`\n📍 [${i + 1}/${restaurants.length}] Enhancing: ${restaurant.name}`);
      
      const realData = await this.searchAndExtractData(restaurant);
      
      if (realData) {
        await this.updateRestaurantWithRealData(restaurant, realData);
      }
      
      // Add delay to avoid being blocked
      await this.page.waitForTimeout(3000);
      
      // Save progress every 5 restaurants
      if ((i + 1) % 5 === 0) {
        console.log(`\n📈 Progress: ${i + 1}/${restaurants.length} completed`);
        console.log(`✅ Enhanced: ${this.enhancedCount}, ❌ Errors: ${this.errorCount}`);
      }
    }
    
    console.log(`\n🎉 Real enhancement complete!`);
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
  const enhancer = new RealGoogleMapsEnhancer();
  
  try {
    await enhancer.initialize();
    
    // Start with a small batch to test
    const limit = process.argv[2] ? parseInt(process.argv[2]) : 5;
    await enhancer.enhanceWithRealData(limit);
    
  } catch (error) {
    console.error('❌ Real enhancement failed:', error);
  } finally {
    await enhancer.close();
  }
}

if (require.main === module) {
  main();
}

export { RealGoogleMapsEnhancer };
