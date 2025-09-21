import dotenv from 'dotenv';
import { prisma } from '../db';
import { apiIntegrations } from '../services/apiIntegrations';
import { logger } from '../utils/logger';

// Load environment variables
dotenv.config();

async function enhanceUSAfricanRestaurants() {
  try {
    logger.info('Starting US African restaurant data enhancement...');
    
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
              { mondayOpen: null },
              { googlePlaceId: { not: null } }
            ]
          }
        ]
      },
      take: 50 // Process in smaller batches
    });

    logger.info(`Found ${restaurants.length} US African restaurants to enhance`);

    let enhancedCount = 0;
    let errorCount = 0;

    for (const restaurant of restaurants) {
      try {
        if (restaurant.googlePlaceId) {
          logger.info(`Enhancing ${restaurant.name}...`);
          
          // Get detailed information from Google Places
          const detailsResponse = await apiIntegrations.getGooglePlaceDetails(restaurant.googlePlaceId);
          
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

            // Add photos if they exist
            if (placeData.photos && placeData.photos.length > 0) {
              // Delete existing photos
              await prisma.photo.deleteMany({
                where: { restaurantId: restaurant.id }
              });

              // Add new photos
              for (let i = 0; i < Math.min(placeData.photos.length, 5); i++) {
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
            logger.info(`✅ Enhanced ${restaurant.name} - Phone: ${placeData.formatted_phone_number ? 'Yes' : 'No'}, Photos: ${placeData.photos?.length || 0}`);
          } else {
            logger.warn(`⚠️ Could not get details for ${restaurant.name}`);
            errorCount++;
          }
        } else {
          // Try to find the restaurant using Google Places Text Search
          logger.info(`Searching for ${restaurant.name} in ${restaurant.city}, ${restaurant.state}...`);
          
          const searchQuery = `${restaurant.name} ${restaurant.city} ${restaurant.state}`;
          const location = `${restaurant.city}, ${restaurant.state}, US`;
          const searchResponse = await apiIntegrations.searchGooglePlaces(searchQuery, location);
          
          if (searchResponse.success && searchResponse.data && searchResponse.data.length > 0) {
            const place = searchResponse.data[0];
            
            // Get detailed information
            const detailsResponse = await apiIntegrations.getGooglePlaceDetails(place.place_id);
            
            if (detailsResponse.success && detailsResponse.data) {
              const placeData = detailsResponse.data;
              const hours = parseOpeningHours(placeData.opening_hours);
              
              // Update restaurant
              await prisma.restaurant.update({
                where: { id: restaurant.id },
                data: {
                  googlePlaceId: place.place_id,
                  phone: placeData.formatted_phone_number || restaurant.phone,
                  website: placeData.website || restaurant.website,
                  email: placeData.email || restaurant.email,
                  ...hours,
                  lastUpdated: new Date(),
                }
              });

              // Add photos
              if (placeData.photos && placeData.photos.length > 0) {
                await prisma.photo.deleteMany({
                  where: { restaurantId: restaurant.id }
                });

                for (let i = 0; i < Math.min(placeData.photos.length, 5); i++) {
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
              logger.info(`✅ Found and enhanced ${restaurant.name} - Phone: ${placeData.formatted_phone_number ? 'Yes' : 'No'}, Photos: ${placeData.photos?.length || 0}`);
            } else {
              logger.warn(`⚠️ Could not get details for ${restaurant.name}`);
              errorCount++;
            }
          } else {
            logger.warn(`⚠️ Could not find ${restaurant.name} in Google Places`);
            errorCount++;
          }
        }

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
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
enhanceUSAfricanRestaurants()
  .then(() => {
    logger.info('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    logger.error('Script failed:', error);
    process.exit(1);
  });
