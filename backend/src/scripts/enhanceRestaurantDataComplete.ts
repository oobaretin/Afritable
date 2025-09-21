import dotenv from 'dotenv';
import { prisma } from '../db';
import { apiIntegrations } from '../services/apiIntegrations';
import { logger } from '../utils/logger';

// Load environment variables
dotenv.config();

async function enhanceRestaurantDataComplete() {
  try {
    logger.info('Starting comprehensive restaurant data enhancement...');
    
    // Get restaurants that need enhancement (missing critical data)
    const restaurants = await prisma.restaurant.findMany({
      where: {
        AND: [
          { isActive: true },
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
      take: 100 // Process in batches
    });

    logger.info(`Found ${restaurants.length} restaurants to enhance`);

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
            const updateData: any = {};
            
            // Update phone if we have it and restaurant doesn't
            if (placeData.formatted_phone_number && !restaurant.phone) {
              updateData.phone = placeData.formatted_phone_number;
            }
            
            // Update website if we have it and restaurant doesn't
            if (placeData.website && !restaurant.website) {
              updateData.website = placeData.website;
            }
            
            // Update email if we have it
            if (placeData.email) {
              updateData.email = placeData.email;
            }
            
            // Update hours if we have them and restaurant doesn't
            if (hours && !restaurant.mondayOpen) {
              updateData.mondayOpen = hours.mondayOpen;
              updateData.mondayClose = hours.mondayClose;
              updateData.tuesdayOpen = hours.tuesdayOpen;
              updateData.tuesdayClose = hours.tuesdayClose;
              updateData.wednesdayOpen = hours.wednesdayOpen;
              updateData.wednesdayClose = hours.wednesdayClose;
              updateData.thursdayOpen = hours.thursdayOpen;
              updateData.thursdayClose = hours.thursdayClose;
              updateData.fridayOpen = hours.fridayOpen;
              updateData.fridayClose = hours.fridayClose;
              updateData.saturdayOpen = hours.saturdayOpen;
              updateData.saturdayClose = hours.saturdayClose;
              updateData.sundayOpen = hours.sundayOpen;
              updateData.sundayClose = hours.sundayClose;
            }
            
            // Only update if we have new data
            if (Object.keys(updateData).length > 0) {
              await prisma.restaurant.update({
                where: { id: restaurant.id },
                data: updateData
              });
              
              enhancedCount++;
              logger.info(`✅ Enhanced ${restaurant.name} with ${Object.keys(updateData).length} new fields`);
            } else {
              logger.info(`ℹ️ No new data for ${restaurant.name}`);
            }
          } else {
            logger.warn(`⚠️ Could not get details for ${restaurant.name}`);
          }
        }

        // Add delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        errorCount++;
        logger.error(`❌ Error enhancing ${restaurant.name}:`, error);
      }
    }

    logger.info(`🎉 Enhancement completed! Enhanced: ${enhancedCount}, Errors: ${errorCount}`);
    
  } catch (error) {
    logger.error('Error in restaurant data enhancement:', error);
  }
}

// Parse opening hours from Google Places API
function parseOpeningHours(openingHours?: any): any {
  if (!openingHours || !openingHours.weekday_text) {
    return null;
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
      // Handle different time formats
      const timeParts = time.split(' – ');
      if (timeParts.length === 2) {
        hours[`${dayKey}Open`] = timeParts[0];
        hours[`${dayKey}Close`] = timeParts[1];
      } else {
        // If no separator, store the whole time as open
        hours[`${dayKey}Open`] = time;
      }
    }
  });

  return hours;
}

// Run the script
enhanceRestaurantDataComplete()
  .then(() => {
    logger.info('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    logger.error('Script failed:', error);
    process.exit(1);
  });
