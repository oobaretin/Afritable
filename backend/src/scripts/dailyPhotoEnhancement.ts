import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

const GOOGLE_PLACES_API_KEY = 'AIzaSyBgxe92qPzMXUl0vefNRILvbQZxOV-FgOU';
const DAILY_LIMIT = 100; // Process exactly 100 restaurants per day

interface GooglePlaceDetails {
  result: {
    photos?: Array<{
      photo_reference: string;
      height: number;
      width: number;
    }>;
  };
}

async function fetchGooglePlacePhotos(placeId: string): Promise<string[]> {
  try {
    const response = await axios.get<GooglePlaceDetails>(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${GOOGLE_PLACES_API_KEY}`
    );

    if (response.data.result.photos && response.data.result.photos.length > 0) {
      return response.data.result.photos.map(photo => 
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${GOOGLE_PLACES_API_KEY}`
      );
    }
    return [];
  } catch (error) {
    console.error(`Error fetching photos for place ${placeId}:`, error);
    return [];
  }
}

async function addPhotosToRestaurants() {
  try {
    console.log('🚀 Starting daily photo enhancement for African restaurants...');
    
    // Get African restaurants without photos, limited to 100 per day
    const restaurantsWithoutPhotos = await prisma.restaurant.findMany({
      where: {
        photos: {
          none: {}
        }
      },
      take: DAILY_LIMIT,
      select: {
        id: true,
        name: true,
        googlePlaceId: true,
        cuisine: true,
        city: true,
        state: true
      }
    });

    console.log(`📊 Found ${restaurantsWithoutPhotos.length} restaurants without photos`);

    if (restaurantsWithoutPhotos.length === 0) {
      console.log('✅ All restaurants already have photos!');
      return;
    }

    let successCount = 0;
    let errorCount = 0;

    for (const restaurant of restaurantsWithoutPhotos) {
      try {
        if (!restaurant.googlePlaceId) {
          console.log(`⚠️  Skipping ${restaurant.name} - no Google Place ID`);
          continue;
        }

        console.log(`🔄 Processing: ${restaurant.name} (${restaurant.cuisine}) - ${restaurant.city}, ${restaurant.state}`);
        
        const photoUrls = await fetchGooglePlacePhotos(restaurant.googlePlaceId);
        
        if (photoUrls.length > 0) {
          // Create photo records
          const photoRecords = photoUrls.map((url, index) => ({
            url,
            isPrimary: index === 0,
            restaurantId: restaurant.id
          }));

          await prisma.photo.createMany({
            data: photoRecords
          });

          console.log(`✅ Added ${photoUrls.length} photos to ${restaurant.name}`);
          successCount++;
        } else {
          console.log(`⚠️  No photos found for ${restaurant.name}`);
        }

        // Add a small delay to be respectful to the API
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`❌ Error processing ${restaurant.name}:`, error);
        errorCount++;
      }
    }

    console.log('\n📈 Daily Photo Enhancement Summary:');
    console.log(`✅ Successfully processed: ${successCount} restaurants`);
    console.log(`❌ Errors: ${errorCount} restaurants`);
    console.log(`📊 Total restaurants processed: ${successCount + errorCount}`);
    
    // Check how many restaurants still need photos
    const remainingCount = await prisma.restaurant.count({
      where: {
        photos: {
          none: {}
        }
      }
    });
    
    console.log(`📋 Remaining restaurants without photos: ${remainingCount}`);
    
    if (remainingCount > 0) {
      const daysRemaining = Math.ceil(remainingCount / DAILY_LIMIT);
      console.log(`⏰ Estimated days to complete: ${daysRemaining}`);
    } else {
      console.log('🎉 All restaurants now have photos!');
    }

  } catch (error) {
    console.error('❌ Error in daily photo enhancement:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
addPhotosToRestaurants();
