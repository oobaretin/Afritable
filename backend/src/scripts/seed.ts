import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting database seeding...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@afritable.com' },
      update: {},
      create: {
        email: 'admin@afritable.com',
        firstName: 'Admin',
        lastName: 'User',
        password: adminPassword,
        role: 'ADMIN',
      },
    });

    console.log('Admin user created:', admin.email);

    // Create sample restaurants
    const sampleRestaurants = [
      {
        name: 'Addis Ababa Restaurant',
        description: 'Authentic Ethiopian cuisine with traditional injera and flavorful stews.',
        address: '123 Main St',
        city: 'Houston',
        state: 'TX',
        zipCode: '77001',
        latitude: 29.7604,
        longitude: -95.3698,
        phone: '(713) 555-0123',
        website: 'https://addisababa-restaurant.com',
        cuisine: 'Ethiopian,African',
        priceRange: 'MODERATE',
        rating: 4.5,
        reviewCount: 127,
        acceptsReservations: true,
        hasDelivery: true,
        hasTakeout: true,
        hasOutdoorSeating: false,
        hasWifi: true,
        hasParking: true,
        isWheelchairAccessible: true,
        dataSource: 'MANUAL',
        isActive: true,
        isVerified: true,
      },
      {
        name: 'Nigerian Kitchen',
        description: 'Traditional Nigerian dishes including jollof rice, egusi soup, and suya.',
        address: '456 Oak Ave',
        city: 'Houston',
        state: 'TX',
        zipCode: '77002',
        latitude: 29.7604,
        longitude: -95.3698,
        phone: '(713) 555-0456',
        website: 'https://nigerian-kitchen.com',
        cuisine: 'Nigerian,West African',
        priceRange: 'MODERATE',
        rating: 4.3,
        reviewCount: 89,
        acceptsReservations: true,
        hasDelivery: true,
        hasTakeout: true,
        hasOutdoorSeating: true,
        hasWifi: true,
        hasParking: true,
        isWheelchairAccessible: true,
        dataSource: 'MANUAL',
        isActive: true,
        isVerified: true,
      },
      {
        name: 'Marrakech Moroccan Restaurant',
        description: 'Experience the flavors of Morocco with tagines, couscous, and mint tea.',
        address: '789 Pine St',
        city: 'Houston',
        state: 'TX',
        zipCode: '77003',
        latitude: 29.7604,
        longitude: -95.3698,
        phone: '(713) 555-0789',
        website: 'https://marrakech-moroccan.com',
        cuisine: 'Moroccan,North African',
        priceRange: 'EXPENSIVE',
        rating: 4.7,
        reviewCount: 203,
        acceptsReservations: true,
        hasDelivery: false,
        hasTakeout: true,
        hasOutdoorSeating: true,
        hasWifi: true,
        hasParking: true,
        isWheelchairAccessible: true,
        dataSource: 'MANUAL',
        isActive: true,
        isVerified: true,
      },
    ];

    for (const restaurantData of sampleRestaurants) {
      const restaurant = await prisma.restaurant.create({
        data: restaurantData,
      });

      console.log('Sample restaurant created:', restaurant.name);

      // Add sample photos
      const samplePhotos = [
        {
          url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
          caption: 'Restaurant exterior',
          isPrimary: true,
        },
        {
          url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
          caption: 'Interior dining area',
          isPrimary: false,
        },
      ];

      for (const photoData of samplePhotos) {
        await prisma.photo.create({
          data: {
            restaurantId: restaurant.id,
            ...photoData,
          },
        });
      }

      // Add sample menu items
      const sampleMenus = [
        {
          name: 'Signature Dish',
          description: 'Our most popular traditional dish',
          price: 18.99,
          category: 'Main Course',
        },
        {
          name: 'Traditional Soup',
          description: 'Authentic soup with fresh ingredients',
          price: 12.99,
          category: 'Appetizer',
        },
        {
          name: 'Dessert Special',
          description: 'Traditional dessert to end your meal',
          price: 8.99,
          category: 'Dessert',
        },
      ];

      for (const menuData of sampleMenus) {
        await prisma.menu.create({
          data: {
            restaurantId: restaurant.id,
            ...menuData,
          },
        });
      }

      // Add sample availability for the next 7 days
      const today = new Date();
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        const timeSlots = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'];
        
        for (const timeSlot of timeSlots) {
          await prisma.availability.create({
            data: {
              restaurantId: restaurant.id,
              date,
              timeSlot,
              maxPartySize: 8,
              availableSlots: 4,
            },
          });
        }
      }
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
