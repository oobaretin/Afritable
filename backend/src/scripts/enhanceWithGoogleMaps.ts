import dotenv from 'dotenv';
import { prisma } from '../db';
import { logger } from '../utils/logger';
import puppeteer from 'puppeteer';

// Load environment variables
dotenv.config();

interface GoogleMapsResult {
  name: string;
  phone?: string;
  website?: string;
  address: string;
  rating?: number;
  reviewCount?: number;
  photos?: string[];
  hours?: string[];
}

async function enhanceWithGoogleMaps() {
  let browser;
  
  try {
    logger.info('Starting Google Maps data enhancement...');
    
    // Get US African restaurants that need enhancement
    const restaurants = await prisma.restaurant.findMany({
      where: {
        AND: [
          { isActive: true },
          { country: 'US' },
          {
            OR: [
              { cuisine: { contains: 'African' } },
              { cuisine: { contains: 'Ethiopian' } },
              { cuisine: { contains: 'Nigerian' } },
              { cuisine: { contains: 'Ghanaian' } },
              { cuisine: { contains: 'Kenyan' } },
              { cuisine: { contains: 'Somali' } },
              { cuisine: { contains: 'Moroccan' } },
              { cuisine: { contains: 'Caribbean' } },
              { cuisine: { contains: 'Jamaican' } },
              { cuisine: { contains: 'Haitian' } },
              { cuisine: { contains: 'Trinidadian' } },
            ]
          },
          {
            OR: [
              { phone: null },
              { website: null },
              { mondayOpen: null }
            ]
          }
        ]
      },
      take: 10 // Start with a small batch
    });

    logger.info(`Found ${restaurants.length} restaurants to enhance`);

    // Launch browser
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    let enhancedCount = 0;
    let errorCount = 0;

    for (const restaurant of restaurants) {
      try {
        logger.info(`Enhancing ${restaurant.name} in ${restaurant.city}, ${restaurant.state}...`);
        
        const mapsData = await scrapeGoogleMaps(browser, restaurant.name, restaurant.city, restaurant.state);
        
        if (mapsData) {
          // Update restaurant with enhanced information
          const updateData: any = {
            lastUpdated: new Date(),
          };

          if (mapsData.phone && !restaurant.phone) {
            updateData.phone = mapsData.phone;
          }

          if (mapsData.website && !restaurant.website) {
            updateData.website = mapsData.website;
          }

          if (mapsData.rating && mapsData.rating > 0) {
            updateData.rating = mapsData.rating;
          }

          if (mapsData.reviewCount && mapsData.reviewCount > 0) {
            updateData.reviewCount = mapsData.reviewCount;
          }

          await prisma.restaurant.update({
            where: { id: restaurant.id },
            data: updateData
          });

          // Add photos if they exist and we don't have any
          const existingPhotos = await prisma.photo.count({
            where: { restaurantId: restaurant.id }
          });

          if (mapsData.photos && mapsData.photos.length > 0 && existingPhotos === 0) {
            // Add new photos
            for (let i = 0; i < Math.min(mapsData.photos.length, 3); i++) {
              const photoUrl = mapsData.photos[i];
              
              await prisma.photo.create({
                data: {
                  restaurantId: restaurant.id,
                  url: photoUrl,
                  caption: `Photo from Google Maps`,
                  isPrimary: i === 0,
                  uploadedBy: null,
                }
              });
            }
          }

          enhancedCount++;
          logger.info(`✅ Enhanced ${restaurant.name} - Phone: ${mapsData.phone ? 'Yes' : 'No'}, Website: ${mapsData.website ? 'Yes' : 'No'}, Photos: ${mapsData.photos?.length || 0}`);
        } else {
          logger.warn(`⚠️ Could not find ${restaurant.name} on Google Maps`);
          errorCount++;
        }

        // Add delay to avoid being blocked
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        logger.error(`Error enhancing ${restaurant.name}:`, error);
        errorCount++;
      }
    }

    logger.info(`🎉 Enhancement completed! Enhanced: ${enhancedCount}, Errors: ${errorCount}`);
    
  } catch (error) {
    logger.error('Error in Google Maps enhancement:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
    await prisma.$disconnect();
  }
}

async function scrapeGoogleMaps(browser: any, restaurantName: string, city: string, state: string): Promise<GoogleMapsResult | null> {
  const page = await browser.newPage();
  
  try {
    // Set user agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // Search for the restaurant on Google Maps
    const searchQuery = `${restaurantName} ${city} ${state}`;
    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;
    
    await page.goto(mapsUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Wait for results to load
    await page.waitForTimeout(3000);
    
    // Try to click on the first result
    try {
      await page.click('[data-result-index="0"]', { timeout: 5000 });
      await page.waitForTimeout(2000);
    } catch (e) {
      // If clicking doesn't work, try alternative selector
      try {
        await page.click('.Nv2PK', { timeout: 5000 });
        await page.waitForTimeout(2000);
      } catch (e2) {
        logger.warn(`Could not click on restaurant result for ${restaurantName}`);
        return null;
      }
    }
    
    // Extract restaurant information
    const restaurantData = await page.evaluate(() => {
      const result = {
        name: '',
        address: '',
        phone: '',
        website: '',
        rating: 0,
        reviewCount: 0,
        photos: [] as string[]
      };

      // Extract name
      const nameElement = document.querySelector('h1[data-attrid="title"]') || 
                         document.querySelector('h1') ||
                         document.querySelector('[data-attrid="title"]');
      if (nameElement) {
        result.name = nameElement.textContent?.trim() || '';
      }

      // Extract phone
      const phoneElement = document.querySelector('[data-item-id="phone"]') ||
                          document.querySelector('button[data-item-id="phone"]') ||
                          document.querySelector('[aria-label*="phone"]');
      if (phoneElement) {
        result.phone = phoneElement.textContent?.trim() || '';
      }

      // Extract website
      const websiteElement = document.querySelector('[data-item-id="authority"]') ||
                            document.querySelector('button[data-item-id="authority"]') ||
                            document.querySelector('[aria-label*="website"]');
      if (websiteElement) {
        result.website = websiteElement.textContent?.trim() || '';
      }

      // Extract address
      const addressElement = document.querySelector('[data-item-id="address"]') ||
                            document.querySelector('button[data-item-id="address"]') ||
                            document.querySelector('[aria-label*="address"]');
      if (addressElement) {
        result.address = addressElement.textContent?.trim() || '';
      }

      // Extract rating
      const ratingElement = document.querySelector('.MW4etd') ||
                           document.querySelector('[aria-label*="stars"]');
      if (ratingElement) {
        const ratingText = ratingElement.textContent?.trim() || '';
        const ratingMatch = ratingText.match(/(\d+\.?\d*)/);
        if (ratingMatch) {
          result.rating = parseFloat(ratingMatch[1]);
        }
      }

      // Extract review count
      const reviewElement = document.querySelector('.UY7F9') ||
                           document.querySelector('[aria-label*="reviews"]');
      if (reviewElement) {
        const reviewText = reviewElement.textContent?.trim() || '';
        const reviewMatch = reviewText.match(/(\d+)/);
        if (reviewMatch) {
          result.reviewCount = parseInt(reviewMatch[1]);
        }
      }

      // Extract photos (if available)
      const photoElements = document.querySelectorAll('img[src*="googleusercontent"]');
      result.photos = Array.from(photoElements).map(img => img.getAttribute('src')).filter(src => src) as string[];

      return result;
    });

    return restaurantData;
    
  } catch (error) {
    logger.error(`Error scraping Google Maps for ${restaurantName}:`, error);
    return null;
  } finally {
    await page.close();
  }
}

// Run the enhancement
enhanceWithGoogleMaps()
  .then(() => {
    logger.info('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    logger.error('Script failed:', error);
    process.exit(1);
  });
