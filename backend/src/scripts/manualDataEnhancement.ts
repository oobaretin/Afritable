import dotenv from 'dotenv';
import { prisma } from '../db';
import { logger } from '../utils/logger';
import readline from 'readline';

// Load environment variables
dotenv.config();

interface EnhancementData {
  phone?: string;
  website?: string;
  email?: string;
  mondayOpen?: string;
  mondayClose?: string;
  tuesdayOpen?: string;
  tuesdayClose?: string;
  wednesdayOpen?: string;
  wednesdayClose?: string;
  thursdayOpen?: string;
  thursdayClose?: string;
  fridayOpen?: string;
  fridayClose?: string;
  saturdayOpen?: string;
  saturdayClose?: string;
  sundayOpen?: string;
  sundayClose?: string;
}

async function manualDataEnhancement() {
  try {
    logger.info('Starting manual data enhancement...');
    
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
              { mondayOpen: null }
            ]
          }
        ]
      },
      take: 5 // Start with a small batch
    });

    logger.info(`Found ${restaurants.length} restaurants to enhance`);

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const question = (query: string): Promise<string> => {
      return new Promise((resolve) => {
        rl.question(query, resolve);
      });
    };

    let enhancedCount = 0;

    for (const restaurant of restaurants) {
      try {
        console.log(`\n--- Enhancing: ${restaurant.name} ---`);
        console.log(`Location: ${restaurant.address}, ${restaurant.city}, ${restaurant.state}`);
        console.log(`Current phone: ${restaurant.phone || 'Not available'}`);
        console.log(`Current website: ${restaurant.website || 'Not available'}`);
        
        const enhancementData: EnhancementData = {};

        // Ask for phone number
        const phone = await question('Enter phone number (or press Enter to skip): ');
        if (phone.trim()) {
          enhancementData.phone = phone.trim();
        }

        // Ask for website
        const website = await question('Enter website URL (or press Enter to skip): ');
        if (website.trim()) {
          enhancementData.website = website.trim();
        }

        // Ask for email
        const email = await question('Enter email (or press Enter to skip): ');
        if (email.trim()) {
          enhancementData.email = email.trim();
        }

        // Ask for hours (simplified - just ask for a few key days)
        console.log('\n--- Hours of Operation ---');
        const mondayHours = await question('Monday hours (e.g., "9:00 AM - 10:00 PM" or press Enter to skip): ');
        if (mondayHours.trim()) {
          const [open, close] = mondayHours.split(' - ');
          if (open && close) {
            enhancementData.mondayOpen = open.trim();
            enhancementData.mondayClose = close.trim();
          }
        }

        const fridayHours = await question('Friday hours (e.g., "9:00 AM - 11:00 PM" or press Enter to skip): ');
        if (fridayHours.trim()) {
          const [open, close] = fridayHours.split(' - ');
          if (open && close) {
            enhancementData.fridayOpen = open.trim();
            enhancementData.fridayClose = close.trim();
          }
        }

        const saturdayHours = await question('Saturday hours (e.g., "10:00 AM - 11:00 PM" or press Enter to skip): ');
        if (saturdayHours.trim()) {
          const [open, close] = saturdayHours.split(' - ');
          if (open && close) {
            enhancementData.saturdayOpen = open.trim();
            enhancementData.saturdayClose = close.trim();
          }
        }

        // Ask for photo URLs
        console.log('\n--- Photos ---');
        const photo1 = await question('Enter photo URL 1 (or press Enter to skip): ');
        if (photo1.trim()) {
          await prisma.photo.create({
            data: {
              restaurantId: restaurant.id,
              url: photo1.trim(),
              caption: 'Restaurant photo',
              isPrimary: true,
              uploadedBy: null,
            }
          });
        }

        const photo2 = await question('Enter photo URL 2 (or press Enter to skip): ');
        if (photo2.trim()) {
          await prisma.photo.create({
            data: {
              restaurantId: restaurant.id,
              url: photo2.trim(),
              caption: 'Restaurant photo',
              isPrimary: false,
              uploadedBy: null,
            }
          });
        }

        // Update restaurant with enhancement data
        if (Object.keys(enhancementData).length > 0) {
          await prisma.restaurant.update({
            where: { id: restaurant.id },
            data: {
              ...enhancementData,
              lastUpdated: new Date(),
            }
          });
        }

        enhancedCount++;
        logger.info(`✅ Enhanced ${restaurant.name}`);
        
        const continueEnhancement = await question('\nContinue with next restaurant? (y/n): ');
        if (continueEnhancement.toLowerCase() !== 'y') {
          break;
        }
        
      } catch (error) {
        logger.error(`Error enhancing ${restaurant.name}:`, error);
      }
    }

    rl.close();
    logger.info(`🎉 Enhancement completed! Enhanced: ${enhancedCount} restaurants`);
    
  } catch (error) {
    logger.error('Error in manual data enhancement:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the enhancement
manualDataEnhancement()
  .then(() => {
    logger.info('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    logger.error('Script failed:', error);
    process.exit(1);
  });
