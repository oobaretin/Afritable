import dotenv from 'dotenv';
import { prisma } from '../db';
import { apiIntegrations } from '../services/apiIntegrations';
import { logger } from '../utils/logger';

// Load environment variables
dotenv.config();

async function enhanceRestaurantContactInfo() {
  try {
    logger.info('Starting restaurant contact info enhancement...');
    
    // Get restaurants that need enhancement (missing phone, website, or hours)
    const restaurants = await prisma.restaurant.findMany({
      where: {
        OR: [
          { phone: null },
          { website: null },
          { mondayOpen: null },
          { googlePlaceId: { not: null } }
        ]
      },
      take: 50 // Process in batches to avoid rate limits
    });

    logger.info(`Found ${restaurants.length} restaurants to enhance`);

    for (const restaurant of restaurants) {
      try {
        if (restaurant.googlePlaceId) {
          // Get detailed information from Google Places
          const details = await apiIntegrations.getGooglePlaceDetails(restaurant.googlePlaceId);
          
          if (details.success && details.data) {
            const placeData = details.data;
            
            // Update restaurant with enhanced information
            await prisma.restaurant.update({
              where: { id: restaurant.id },
              data: {
                phone: placeData.formatted_phone_number || restaurant.phone,
                website: placeData.website || restaurant.website,
                email: placeData.email || restaurant.email,
                // Update hours if available
                ...(placeData.opening_hours && {
                  mondayOpen: placeData.opening_hours.mondayOpen,
                  mondayClose: placeData.opening_hours.mondayClose,
                  tuesdayOpen: placeData.opening_hours.tuesdayOpen,
                  tuesdayClose: placeData.opening_hours.tuesdayClose,
                  wednesdayOpen: placeData.opening_hours.wednesdayOpen,
                  wednesdayClose: placeData.opening_hours.wednesdayClose,
                  thursdayOpen: placeData.opening_hours.thursdayOpen,
                  thursdayClose: placeData.opening_hours.thursdayClose,
                  fridayOpen: placeData.opening_hours.fridayOpen,
                  fridayClose: placeData.opening_hours.fridayClose,
                  saturdayOpen: placeData.opening_hours.saturdayOpen,
                  saturdayClose: placeData.opening_hours.saturdayClose,
                  sundayOpen: placeData.opening_hours.sundayOpen,
                  sundayClose: placeData.opening_hours.sundayClose,
                })
              }
            });

            logger.info(`Enhanced contact info for ${restaurant.name}`);
          }
        }

        // Add delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        logger.error(`Error enhancing ${restaurant.name}:`, error);
      }
    }

    logger.info('Restaurant contact info enhancement completed');
    
  } catch (error) {
    logger.error('Error in restaurant contact info enhancement:', error);
  }
}

// Run the script
enhanceRestaurantContactInfo()
  .then(() => {
    logger.info('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    logger.error('Script failed:', error);
    process.exit(1);
  });
