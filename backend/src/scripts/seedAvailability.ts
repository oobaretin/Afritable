import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

const timeSlots = [
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', 
  '20:00', '20:30', '21:00', '21:30', '22:00'
];

const partySizes = [2, 4, 6, 8];

async function seedAvailability() {
  try {
    logger.info('🌱 Starting availability seeding...');

    // Get all active restaurants that accept reservations
    const restaurants = await prisma.restaurant.findMany({
      where: {
        isActive: true,
        acceptsReservations: true,
      },
      select: {
        id: true,
        name: true,
      },
    });

    logger.info(`Found ${restaurants.length} restaurants that accept reservations`);

    // Generate availability for the next 30 days
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + 30);

    let totalSlots = 0;

    for (const restaurant of restaurants) {
      logger.info(`Creating availability for ${restaurant.name}...`);

      for (let d = new Date(today); d <= endDate; d.setDate(d.getDate() + 1)) {
        const date = new Date(d);
        
        // Skip past dates
        if (date < today) continue;

        for (const timeSlot of timeSlots) {
          for (const maxPartySize of partySizes) {
            // Create 2-5 available slots per time slot
            const availableSlots = Math.floor(Math.random() * 4) + 2;

            await prisma.availability.upsert({
              where: {
                restaurantId_date_timeSlot: {
                  restaurantId: restaurant.id,
                  date: date,
                  timeSlot: timeSlot,
                },
              },
              update: {
                maxPartySize,
                availableSlots,
              },
              create: {
                restaurantId: restaurant.id,
                date: date,
                timeSlot: timeSlot,
                maxPartySize,
                availableSlots,
              },
            });

            totalSlots++;
          }
        }
      }
    }

    logger.info(`✅ Successfully created ${totalSlots} availability slots`);
    logger.info('🎉 Availability seeding completed!');

  } catch (error) {
    logger.error('❌ Error seeding availability:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
if (require.main === module) {
  seedAvailability()
    .then(() => {
      logger.info('Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Script failed:', error);
      process.exit(1);
    });
}

export { seedAvailability };
