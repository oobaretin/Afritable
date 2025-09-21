import { PrismaClient } from '@prisma/client';
import puppeteer from 'puppeteer';

const prisma = new PrismaClient();

interface RestaurantData {
  phone?: string;
  website?: string;
  rating?: number;
  photos?: string[];
  address?: string;
}

async function searchGoogleMaps(restaurantName: string, city: string, state: string): Promise<RestaurantData | null> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Search for the restaurant on Google Maps
    const searchQuery = `${restaurantName} ${city} ${state}`;
    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;
    
    console.log(`🔍 Searching: ${searchQuery}`);
    await page.goto(mapsUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Wait for results to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Try to click on the first result
    try {
      await page.click('[data-value="Directions"]');
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (e) {
      // If directions button not found, try clicking on the first result
      try {
        await page.click('[role="main"] [data-result-index="0"]');
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e2) {
        console.log(`❌ Could not click on result for ${restaurantName}`);
        return null;
      }
    }
    
    // Extract data from the restaurant page
    const data = await page.evaluate(() => {
      const result: any = {};
      
      // Get phone number
      const phoneElement = (document as any).querySelector('[data-item-id*="phone"]') || 
                          (document as any).querySelector('[aria-label*="phone"]') ||
                          (document as any).querySelector('button[data-value*="phone"]');
      if (phoneElement) {
        result.phone = phoneElement.textContent?.trim() || phoneElement.getAttribute('aria-label')?.trim();
      }
      
      // Get website
      const websiteElement = (document as any).querySelector('[data-item-id*="authority"]') ||
                            (document as any).querySelector('[aria-label*="website"]') ||
                            (document as any).querySelector('a[href*="http"]');
      if (websiteElement) {
        result.website = websiteElement.href || websiteElement.getAttribute('aria-label')?.trim();
      }
      
      // Get rating
      const ratingElement = (document as any).querySelector('[aria-label*="stars"]') ||
                           (document as any).querySelector('.fontDisplayLarge');
      if (ratingElement) {
        const ratingText = ratingElement.textContent || ratingElement.getAttribute('aria-label');
        const ratingMatch = ratingText?.match(/(\d+\.?\d*)/);
        if (ratingMatch) {
          result.rating = parseFloat(ratingMatch[1]);
        }
      }
      
      // Get address
      const addressElement = (document as any).querySelector('[data-item-id*="address"]') ||
                            (document as any).querySelector('[aria-label*="address"]');
      if (addressElement) {
        result.address = addressElement.textContent?.trim() || addressElement.getAttribute('aria-label')?.trim();
      }
      
      // Get photos (first few)
      const photoElements = (document as any).querySelectorAll('img[src*="googleusercontent"]');
      if (photoElements.length > 0) {
        result.photos = Array.from(photoElements)
          .slice(0, 3)
          .map((img: any) => img.src)
          .filter((src: string) => src && !src.includes('avatar') && !src.includes('default'));
      }
      
      return result;
    });
    
    // Clean up the data
    if (data.phone && data.phone.includes('phone')) {
      data.phone = data.phone.replace(/[^\d\-\(\)\s]/g, '').trim();
    }
    
    if (data.website && !data.website.startsWith('http')) {
      data.website = `https://${data.website}`;
    }
    
    return data;
    
  } catch (error) {
    console.error(`❌ Error searching for ${restaurantName}:`, error);
    return null;
  } finally {
    await browser.close();
  }
}

async function enhanceRestaurantsWithGoogleMaps() {
  console.log('🚀 Starting Google Maps data enhancement...');
  
  // Get restaurants that need enhancement (those with placeholder data)
  const restaurants = await prisma.restaurant.findMany({
    where: {
      OR: [
        { phone: { contains: '555' } },
        { phone: { contains: '000-0000' } },
        { phone: { contains: '(555)' } },
        { website: { contains: 'example.com' } },
        { website: { contains: 'placeholder' } }
      ]
    },
    take: 50, // Start with 50 restaurants
    orderBy: { id: 'asc' }
  });
  
  console.log(`📊 Found ${restaurants.length} restaurants to enhance`);
  
  let enhanced = 0;
  let errors = 0;
  
  for (let i = 0; i < restaurants.length; i++) {
    const restaurant = restaurants[i];
    console.log(`\n📍 [${i + 1}/${restaurants.length}] Enhancing: ${restaurant.name} in ${restaurant.city}, ${restaurant.state}`);
    
    try {
      const googleData = await searchGoogleMaps(restaurant.name, restaurant.city, restaurant.state);
      
      if (googleData) {
        const updates: any = {};
        
        if (googleData.phone && googleData.phone.length > 10) {
          updates.phone = googleData.phone;
          console.log(`✅ Found phone: ${googleData.phone}`);
        }
        
        if (googleData.website && !googleData.website.includes('google.com')) {
          updates.website = googleData.website;
          console.log(`✅ Found website: ${googleData.website}`);
        }
        
        if (googleData.rating && googleData.rating > 0) {
          updates.rating = googleData.rating;
          console.log(`✅ Found rating: ${googleData.rating}`);
        }
        
        if (googleData.photos && googleData.photos.length > 0) {
          // Update photos in the database
          await prisma.photo.deleteMany({
            where: { restaurantId: restaurant.id }
          });
          
          for (const photoUrl of googleData.photos) {
            await prisma.photo.create({
              data: {
                url: photoUrl,
                restaurantId: restaurant.id,
                isPrimary: false
              }
            });
          }
          console.log(`✅ Found ${googleData.photos.length} photos`);
        }
        
        if (Object.keys(updates).length > 0) {
          await prisma.restaurant.update({
            where: { id: restaurant.id },
            data: updates
          });
          enhanced++;
          console.log(`✅ Enhanced ${restaurant.name}`);
        } else {
          console.log(`ℹ️  No new data found for ${restaurant.name}`);
        }
      } else {
        console.log(`❌ No data found for ${restaurant.name}`);
        errors++;
      }
      
      // Add delay between requests to be respectful
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`❌ Error enhancing ${restaurant.name}:`, error);
      errors++;
    }
  }
  
  console.log(`\n🎉 Google Maps enhancement complete!`);
  console.log(`✅ Enhanced: ${enhanced} restaurants`);
  console.log(`❌ Errors: ${errors} restaurants`);
  
  await prisma.$disconnect();
}

// Run the enhancement
enhanceRestaurantsWithGoogleMaps().catch(console.error);
