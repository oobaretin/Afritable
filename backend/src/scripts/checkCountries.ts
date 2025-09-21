import dotenv from 'dotenv';
import { prisma } from '../db';
import { logger } from '../utils/logger';

// Load environment variables
dotenv.config();

async function checkCountries() {
  try {
    logger.info('Checking countries in database...');
    
    // Get all unique countries
    const countries = await prisma.restaurant.groupBy({
      by: ['country'],
      _count: {
        country: true
      },
      where: {
        isActive: true
      }
    });

    logger.info('Countries found in database:');
    countries.forEach(country => {
      logger.info(`- ${country.country}: ${country._count.country} restaurants`);
    });

    // Get some sample restaurants with different countries
    const sampleRestaurants = await prisma.restaurant.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        name: true,
        country: true,
        city: true,
        state: true
      },
      take: 10
    });

    logger.info('\nSample restaurants:');
    sampleRestaurants.forEach(restaurant => {
      logger.info(`- ${restaurant.name} (${restaurant.city}, ${restaurant.state}) - Country: ${restaurant.country}`);
    });
    
  } catch (error) {
    logger.error('Error checking countries:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the check
checkCountries()
  .then(() => {
    logger.info('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    logger.error('Script failed:', error);
    process.exit(1);
  });
