import dotenv from 'dotenv';
import { prisma } from '../db';
import { logger } from '../utils/logger';

// Load environment variables
dotenv.config();

async function quickPhoneUpdate() {
  try {
    logger.info('Adding sample phone numbers to restaurants...');
    
    // Get first 5 US African restaurants
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
          }
        ]
      },
      take: 5
    });

    logger.info(`Found ${restaurants.length} restaurants to update`);

    const samplePhones = [
      '(404) 555-0123',
      '(713) 555-0456', 
      '(305) 555-0789',
      '(206) 555-0321',
      '(312) 555-0654'
    ];

    for (let i = 0; i < restaurants.length; i++) {
      const restaurant = restaurants[i];
      const phone = samplePhones[i % samplePhones.length];

      try {
        await prisma.restaurant.update({
          where: { id: restaurant.id },
          data: {
            phone: phone,
            lastUpdated: new Date(),
          }
        });

        logger.info(`✅ Updated ${restaurant.name} with phone: ${phone}`);
      } catch (error) {
        logger.error(`Error updating ${restaurant.name}:`, error);
      }
    }

    logger.info('🎉 Phone number update completed!');
    
  } catch (error) {
    logger.error('Error in phone update:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update
quickPhoneUpdate()
  .then(() => {
    logger.info('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    logger.error('Script failed:', error);
    process.exit(1);
  });
