import dotenv from 'dotenv';
import { prisma } from '../db';
import { apiIntegrations } from '../services/apiIntegrations';
import { logger } from '../utils/logger';

// Load environment variables
dotenv.config();

async function enhanceSampleRestaurants() {
  try {
    logger.info('Starting sample restaurant enhancement...');
    
    // Get a few restaurants to test
    const restaurants = await prisma.restaurant.findMany({
      where: {
        AND: [
          { isActive: true },
          { googlePlaceId: { not: null } }
        ]
      },
      take: 5 // Just 5 restaurants for testing
    });

    logger.info(`Found ${restaurants.length} restaurants to enhance`);

    for (const restaurant of restaurants) {
      try {
        logger.info(`Enhancing ${restaurant.name}...`);
        
        // Get detailed information from Google Places
        if (!restaurant.googlePlaceId) {
          logger.warn(`⚠️ No Google Place ID for ${restaurant.name}`);
          continue;
        }
        
        const detailsResponse = await apiIntegrations.getGooglePlaceDetails(restaurant.googlePlaceId);
        
        if (detailsResponse.success && detailsResponse.data) {
          const placeData = detailsResponse.data;
          
          // Parse opening hours
          const hours = parseOpeningHours(placeData.opening_hours);
          
          // Update restaurant with enhanced information
          const updateData: any = {};
          
          // Update phone if we have it
          if (placeData.formatted_phone_number) {
            updateData.phone = placeData.formatted_phone_number;
          }
          
          // Update website if we have it
          if (placeData.website) {
            updateData.website = placeData.website;
          }
          
          // Update email if we have it
          if (placeData.email) {
            updateData.email = placeData.email;
          }
          
          // Update hours if we have them
          if (hours) {
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
          
          // Update the restaurant
          await prisma.restaurant.update({
            where: { id: restaurant.id },
            data: updateData
          });
          
          logger.info(`✅ Enhanced ${restaurant.name}:`);
          logger.info(`   📞 Phone: ${updateData.phone || 'No change'}`);
          logger.info(`   🌐 Website: ${updateData.website || 'No change'}`);
          logger.info(`   🕒 Hours: ${hours ? 'Updated' : 'No change'}`);
        } else {
          logger.warn(`⚠️ Could not get details for ${restaurant.name}`);
        }

        // Add delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        logger.error(`❌ Error enhancing ${restaurant.name}:`, error);
      }
    }

    logger.info(`🎉 Sample enhancement completed!`);
    
  } catch (error) {
    logger.error('Error in sample restaurant enhancement:', error);
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
enhanceSampleRestaurants()
  .then(() => {
    logger.info('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    logger.error('Script failed:', error);
    process.exit(1);
  });
