import dotenv from 'dotenv';
import { prisma } from '../db';
import { logger } from '../utils/logger';

// Load environment variables
dotenv.config();

async function addSampleData() {
  try {
    logger.info('Adding sample phone numbers and photos to restaurants...');
    
    // Get a few US African restaurants to enhance
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
      take: 10
    });

    logger.info(`Found ${restaurants.length} restaurants to enhance`);

    // Sample data for different types of restaurants
    const sampleData = [
      {
        phone: '(404) 555-0123',
        website: 'https://www.ethiopianrestaurant.com',
        email: 'info@ethiopianrestaurant.com',
        mondayOpen: '11:00 AM',
        mondayClose: '10:00 PM',
        fridayOpen: '11:00 AM',
        fridayClose: '11:00 PM',
        saturdayOpen: '10:00 AM',
        saturdayClose: '11:00 PM',
        sundayOpen: '12:00 PM',
        sundayClose: '9:00 PM'
      },
      {
        phone: '(713) 555-0456',
        website: 'https://www.nigeriankitchen.com',
        email: 'contact@nigeriankitchen.com',
        mondayOpen: '10:00 AM',
        mondayClose: '9:00 PM',
        fridayOpen: '10:00 AM',
        fridayClose: '10:00 PM',
        saturdayOpen: '9:00 AM',
        saturdayClose: '10:00 PM',
        sundayOpen: '11:00 AM',
        sundayClose: '8:00 PM'
      },
      {
        phone: '(305) 555-0789',
        website: 'https://www.caribbeanflavors.com',
        email: 'hello@caribbeanflavors.com',
        mondayOpen: '12:00 PM',
        mondayClose: '10:00 PM',
        fridayOpen: '12:00 PM',
        fridayClose: '11:00 PM',
        saturdayOpen: '11:00 AM',
        saturdayClose: '11:00 PM',
        sundayOpen: '12:00 PM',
        sundayClose: '9:00 PM'
      },
      {
        phone: '(206) 555-0321',
        website: 'https://www.africanbistro.com',
        email: 'info@africanbistro.com',
        mondayOpen: '11:30 AM',
        mondayClose: '9:30 PM',
        fridayOpen: '11:30 AM',
        fridayClose: '10:30 PM',
        saturdayOpen: '10:30 AM',
        saturdayClose: '10:30 PM',
        sundayOpen: '12:00 PM',
        sundayClose: '8:30 PM'
      },
      {
        phone: '(312) 555-0654',
        website: 'https://www.moroccanpalace.com',
        email: 'reservations@moroccanpalace.com',
        mondayOpen: '5:00 PM',
        mondayClose: '10:00 PM',
        fridayOpen: '5:00 PM',
        fridayClose: '11:00 PM',
        saturdayOpen: '4:00 PM',
        saturdayClose: '11:00 PM',
        sundayOpen: '4:00 PM',
        sundayClose: '9:00 PM'
      }
    ];

    // Sample photo URLs (using placeholder images)
    const samplePhotos = [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop'
    ];

    let enhancedCount = 0;

    for (let i = 0; i < restaurants.length; i++) {
      const restaurant = restaurants[i];
      const dataIndex = i % sampleData.length;
      const sampleInfo = sampleData[dataIndex];

      try {
        logger.info(`Enhancing ${restaurant.name}...`);

        // Update restaurant with sample data
        await prisma.restaurant.update({
          where: { id: restaurant.id },
          data: {
            phone: sampleInfo.phone,
            website: sampleInfo.website,
            email: sampleInfo.email,
            mondayOpen: sampleInfo.mondayOpen,
            mondayClose: sampleInfo.mondayClose,
            fridayOpen: sampleInfo.fridayOpen,
            fridayClose: sampleInfo.fridayClose,
            saturdayOpen: sampleInfo.saturdayOpen,
            saturdayClose: sampleInfo.saturdayClose,
            sundayOpen: sampleInfo.sundayOpen,
            sundayClose: sampleInfo.sundayClose,
            lastUpdated: new Date(),
          }
        });

        // Check if restaurant already has photos
        const existingPhotos = await prisma.photo.count({
          where: { restaurantId: restaurant.id }
        });

        // Add sample photos if none exist
        if (existingPhotos === 0) {
          for (let j = 0; j < 2; j++) {
            const photoIndex = (i + j) % samplePhotos.length;
            await prisma.photo.create({
              data: {
                restaurantId: restaurant.id,
                url: samplePhotos[photoIndex],
                caption: `Photo of ${restaurant.name}`,
                isPrimary: j === 0,
                uploadedBy: null,
              }
            });
          }
        }

        enhancedCount++;
        logger.info(`✅ Enhanced ${restaurant.name} - Phone: ${sampleInfo.phone}, Website: ${sampleInfo.website}, Photos: 2`);
        
      } catch (error) {
        logger.error(`Error enhancing ${restaurant.name}:`, error);
      }
    }

    logger.info(`🎉 Sample data enhancement completed! Enhanced: ${enhancedCount} restaurants`);
    
  } catch (error) {
    logger.error('Error in sample data enhancement:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the enhancement
addSampleData()
  .then(() => {
    logger.info('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    logger.error('Script failed:', error);
    process.exit(1);
  });
