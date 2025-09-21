import dotenv from 'dotenv';
import { prisma } from '../db';
import { apiIntegrations } from '../services/apiIntegrations';
import { logger } from '../utils/logger';

// Load environment variables
dotenv.config();

async function enhanceExistingGooglePlaces() {
  try {
    logger.info('Starting enhancement for restaurants with existing Google Place IDs...');
    
    // Get US African restaurants that have Google Place IDs but missing phone/website
    const restaurants = await prisma.restaurant.findMany({
      where: {
        AND: [
          { isActive: true },
          { country: 'US' },
          { googlePlaceId: { not: null } },
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
      take: 20 // Process in smaller batches
    });

    logger.info(`Found ${restaurants.length} US African restaurants with Google Place IDs to enhance`);

    let enhancedCount = 0;
    let errorCount = 0;

    for (const restaurant of restaurants) {
      try {
        logger.info(`Enhancing ${restaurant.name} (${restaurant.googlePlaceId})...`);
        
        // Get detailed information from Google Places
        const detailsResponse = await apiIntegrations.getGooglePlaceDetails(restaurant.googlePlaceId!);
        
        if (detailsResponse.success && detailsResponse.data) {
          const placeData = detailsResponse.data;
          
          // Parse opening hours
          const hours = parseOpeningHours(placeData.opening_hours);
          
          // Update restaurant with enhanced information
          await prisma.restaurant.update({
            where: { id: restaurant.id },
            data: {
              phone: placeData.formatted_phone_number || restaurant.phone,
              website: placeData.website || restaurant.website,
              email: placeData.email || restaurant.email,
              ...hours,
              lastUpdated: new Date(),
            }
          });

          // Add photos if they exist and we don't have any
          const existingPhotos = await prisma.photo.count({
            where: { restaurantId: restaurant.id }
          });

          if (placeData.photos && placeData.photos.length > 0 && existingPhotos === 0) {
            // Add new photos
            for (let i = 0; i < Math.min(placeData.photos.length, 3); i++) {
              const photo = placeData.photos[i];
              const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}`;
              
              await prisma.photo.create({
                data: {
                  restaurantId: restaurant.id,
                  url: photoUrl,
                  caption: photo.html_attributions?.[0] || null,
                  isPrimary: i === 0,
                  uploadedBy: null,
                }
              });
            }
          }

          enhancedCount++;
          logger.info(`✅ Enhanced ${restaurant.name} - Phone: ${placeData.formatted_phone_number ? 'Yes' : 'No'}, Website: ${placeData.website ? 'Yes' : 'No'}, Photos: ${placeData.photos?.length || 0}`);
        } else {
          logger.warn(`⚠️ Could not get details for ${restaurant.name}`);
          errorCount++;
        }

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        logger.error(`Error enhancing ${restaurant.name}:`, error);
        errorCount++;
      }
    }

    logger.info(`🎉 Enhancement completed! Enhanced: ${enhancedCount}, Errors: ${errorCount}`);
    
  } catch (error) {
    logger.error('Error in restaurant enhancement:', error);
  } finally {
    await prisma.$disconnect();
  }
}

function parseOpeningHours(openingHours: any) {
  if (!openingHours || !openingHours.weekday_text) {
    return {};
  }

  const hours: any = {};
  const dayMap: { [key: string]: string } = {
    'Monday': 'monday',
    'Tuesday': 'tuesday', 
    'Wednesday': 'wednesday',
    'Thursday': 'thursday',
    'Friday': 'friday',
    'Saturday': 'saturday',
    'Sunday': 'sunday'
  };

  openingHours.weekday_text.forEach((dayText: string) => {
    const [day, time] = dayText.split(': ');
    const dayKey = dayMap[day];
    
    if (dayKey && time && time !== 'Closed') {
      const [open, close] = time.split(' – ');
      hours[`${dayKey}Open`] = open;
      hours[`${dayKey}Close`] = close;
    }
  });

  return hours;
}

// Run the enhancement
enhanceExistingGooglePlaces()
  .then(() => {
    logger.info('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    logger.error('Script failed:', error);
    process.exit(1);
  });
