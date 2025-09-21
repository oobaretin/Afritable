import { prisma } from '../db';
import { logger } from '../utils/logger';

// African countries to exclude (restaurants in these countries should be removed)
const AFRICAN_COUNTRIES = [
  'Nigeria', 'Ethiopia', 'Kenya', 'Ghana', 'Morocco', 'Egypt', 'South Africa',
  'Tanzania', 'Uganda', 'Algeria', 'Sudan', 'Mozambique', 'Madagascar',
  'Cameroon', 'Angola', 'Niger', 'Burkina Faso', 'Mali', 'Malawi', 'Zambia',
  'Somalia', 'Senegal', 'Chad', 'Sierra Leone', 'Libya', 'Liberia', 'Central African Republic',
  'Mauritania', 'Eritrea', 'Gambia', 'Guinea-Bissau', 'Gabon', 'Lesotho', 'Guinea',
  'Equatorial Guinea', 'Mauritius', 'Eswatini', 'Djibouti', 'Comoros', 'Cape Verde',
  'Sao Tome and Principe', 'Seychelles', 'Rwanda', 'Burundi', 'Togo', 'Benin',
  'Cote d\'Ivoire', 'Ivory Coast', 'Zimbabwe', 'Botswana', 'Namibia', 'Republic of the Congo',
  'Democratic Republic of the Congo', 'DRC', 'Congo', 'Tunisia', 'Algeria'
];

// Non-African cuisines to remove
const NON_AFRICAN_CUISINES = [
  'American', 'Italian', 'Mexican', 'Chinese', 'Japanese', 'Thai', 'Indian',
  'French', 'Spanish', 'German', 'British', 'Korean', 'Vietnamese', 'Greek',
  'Turkish', 'Lebanese', 'Mediterranean', 'Asian', 'European', 'Latin American',
  'Brazilian', 'Argentine', 'Peruvian', 'Colombian', 'Venezuelan', 'Chilean',
  'Uruguayan', 'Paraguayan', 'Bolivian', 'Ecuadorian', 'Guyanese', 'Surinamese',
  'Fast Food', 'Pizza', 'Burgers', 'Sandwiches', 'Seafood', 'Steakhouse',
  'Barbecue', 'Tex-Mex', 'Cajun', 'Creole', 'Southern', 'Soul Food'
];

// Keywords that indicate food trucks or mobile food
const FOOD_TRUCK_KEYWORDS = [
  'food truck', 'truck', 'mobile', 'cart', 'stand', 'trailer', 'van',
  'pop-up', 'temporary', 'roaming', 'street food', 'vendor'
];

async function cleanupRestaurants() {
  try {
    logger.info('Starting restaurant cleanup...');
    logger.info('Keeping only: African restaurants in US + Caribbean restaurants in US');
    
    // Get initial count
    const initialCount = await prisma.restaurant.count();
    logger.info(`Initial restaurant count: ${initialCount}`);
    
    // Remove all restaurants that are NOT:
    // 1. African restaurants in the United States
    // 2. Caribbean restaurants in the United States
    logger.info('Removing all restaurants except African and Caribbean restaurants in US...');
    
    const removals = await prisma.restaurant.deleteMany({
      where: {
        NOT: {
          OR: [
            {
              // African restaurants in US
              AND: [
                {
                  cuisine: {
                    contains: 'African'
                  }
                },
                {
                  country: 'US'
                }
              ]
            },
            {
              // Caribbean restaurants in US
              AND: [
                {
                  cuisine: {
                    contains: 'Caribbean'
                  }
                },
                {
                  country: 'US'
                }
              ]
            }
          ]
        }
      }
    });
    logger.info(`Removed ${removals.count} restaurants that don't match criteria`);
    
    // Get final count and summary
    const finalCount = await prisma.restaurant.count();
    const totalRemoved = initialCount - finalCount;
    
    logger.info('=== CLEANUP SUMMARY ===');
    logger.info(`Initial count: ${initialCount}`);
    logger.info(`Final count: ${finalCount}`);
    logger.info(`Total removed: ${totalRemoved}`);
    
    // Show remaining cuisine distribution
    const cuisineStats = await prisma.restaurant.groupBy({
      by: ['cuisine'],
      _count: {
        cuisine: true
      },
      orderBy: {
        _count: {
          cuisine: 'desc'
        }
      }
    });
    
    logger.info('=== REMAINING CUISINE DISTRIBUTION ===');
    cuisineStats.forEach(stat => {
      logger.info(`${stat.cuisine}: ${stat._count.cuisine} restaurants`);
    });
    
    // Show country distribution
    const countryStats = await prisma.restaurant.groupBy({
      by: ['country'],
      _count: {
        country: true
      },
      orderBy: {
        _count: {
          country: 'desc'
        }
      }
    });
    
    logger.info('=== REMAINING COUNTRY DISTRIBUTION ===');
    countryStats.forEach(stat => {
      logger.info(`${stat.country}: ${stat._count.country} restaurants`);
    });
    
    logger.info('Restaurant cleanup completed successfully!');
    
  } catch (error) {
    logger.error('Error during restaurant cleanup:', error);
    throw error;
  }
}

// Run the cleanup
cleanupRestaurants()
  .then(() => {
    logger.info('Cleanup script completed');
    process.exit(0);
  })
  .catch((error) => {
    logger.error('Cleanup script failed:', error);
    process.exit(1);
  });
