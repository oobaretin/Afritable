import dotenv from 'dotenv';
import { restaurantDataCollection } from '../services/restaurantDataCollection';
import { logger } from '../utils/logger';

// Load environment variables
dotenv.config();

async function main() {
  try {
    logger.info('Starting restaurant data collection script...');
    
    await restaurantDataCollection.collectRestaurantData();
    
    logger.info('Restaurant data collection script completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Restaurant data collection script failed:', error);
    process.exit(1);
  }
}

// Run the script
main();
