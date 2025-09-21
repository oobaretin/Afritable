import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

const GOOGLE_PLACES_API_KEY = 'AIzaSyBgxe92qPzMXUl0vefNRILvbQZxOV-FgOU';

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

async function addPhotosToRestaurant(restaurantId: string, photoUrls: string[]) {
  try {
    for (let i = 0; i < photoUrls.length; i++) {
      const photoUrl = photoUrls[i];
      await prisma.photo.create({
        data: {
          restaurantId,
          url: photoUrl,
          caption: `Restaurant photo ${i + 1}`,
          isPrimary: i === 0, // First photo is primary
        },
      });
    }
    console.log(`✅ Added ${photoUrls.length} photos to restaurant ${restaurantId}`);
  } catch (error) {
    console.error(`Error adding photos to restaurant ${restaurantId}:`, error);
  }
}

async function fetchMissingPhotos() {
  try {
    console.log('🔍 Finding restaurants without photos...');
    
    // Find restaurants that have Google Place IDs but no photos
    const restaurantsWithoutPhotos = await prisma.restaurant.findMany({
      where: {
        googlePlaceId: {
          not: null,
        },
        photos: {
          none: {},
        },
      },
      select: {
        id: true,
        name: true,
        googlePlaceId: true,
        city: true,
        state: true,
      },
      take: 20, // Process 20 at a time to avoid rate limits
    });

    console.log(`📸 Found ${restaurantsWithoutPhotos.length} restaurants without photos`);

    for (const restaurant of restaurantsWithoutPhotos) {
      if (!restaurant.googlePlaceId) continue;

      console.log(`\n🔄 Processing: ${restaurant.name} (${restaurant.city}, ${restaurant.state})`);
      
      // Add delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const photoUrls = await fetchGooglePlacePhotos(restaurant.googlePlaceId);
      
      if (photoUrls.length > 0) {
        await addPhotosToRestaurant(restaurant.id, photoUrls);
      } else {
        console.log(`❌ No photos found for ${restaurant.name}`);
      }
    }

    console.log('\n✅ Photo fetching completed!');
  } catch (error) {
    console.error('Error in fetchMissingPhotos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
fetchMissingPhotos();
