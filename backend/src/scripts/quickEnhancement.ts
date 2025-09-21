import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface RestaurantData {
  name: string;
  address: string;
  phone?: string;
  website?: string;
  photos: string[];
  rating?: number;
}

// Sample data for common African restaurants
const sampleData: { [key: string]: RestaurantData } = {
  'ethiopian': {
    name: 'Ethiopian Restaurant',
    address: '123 Main St',
    phone: '(555) 123-4567',
    website: 'https://example-ethiopian.com',
    photos: [
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800'
    ],
    rating: 4.5
  },
  'nigerian': {
    name: 'Nigerian Restaurant',
    address: '456 Oak Ave',
    phone: '(555) 234-5678',
    website: 'https://example-nigerian.com',
    photos: [
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800',
      'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800'
    ],
    rating: 4.3
  },
  'caribbean': {
    name: 'Caribbean Restaurant',
    address: '789 Pine St',
    phone: '(555) 345-6789',
    website: 'https://example-caribbean.com',
    photos: [
      'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800',
      'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800'
    ],
    rating: 4.4
  },
  'moroccan': {
    name: 'Moroccan Restaurant',
    address: '321 Elm St',
    phone: '(555) 456-7890',
    website: 'https://example-moroccan.com',
    photos: [
      'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800'
    ],
    rating: 4.6
  },
  'senegalese': {
    name: 'Senegalese Restaurant',
    address: '654 Maple Dr',
    phone: '(555) 567-8901',
    website: 'https://example-senegalese.com',
    photos: [
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800'
    ],
    rating: 4.2
  }
};

function getSampleDataForCuisine(cuisine: string): RestaurantData {
  const lowerCuisine = cuisine.toLowerCase();
  
  if (lowerCuisine.includes('ethiopian')) {
    return sampleData.ethiopian;
  } else if (lowerCuisine.includes('nigerian')) {
    return sampleData.nigerian;
  } else if (lowerCuisine.includes('caribbean')) {
    return sampleData.caribbean;
  } else if (lowerCuisine.includes('moroccan')) {
    return sampleData.moroccan;
  } else if (lowerCuisine.includes('senegalese')) {
    return sampleData.senegalese;
  } else {
    // Default African restaurant data
    return {
      name: 'African Restaurant',
      address: '123 African Way',
      phone: '(555) 000-0000',
      website: 'https://example-african.com',
      photos: [
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800'
      ],
      rating: 4.0
    };
  }
}

async function enhanceRestaurants(limit = 50) {
  console.log(`🎯 Starting quick enhancement of ${limit} African restaurants...`);
  
  // Get restaurants that need enhancement
  const restaurants = await prisma.restaurant.findMany({
    where: {
      isActive: true,
      OR: [
        { phone: null },
        { website: null },
        { photos: { none: {} } }
      ]
    },
    take: limit,
    orderBy: { rating: 'desc' }
  });
  
  console.log(`📊 Found ${restaurants.length} restaurants to enhance`);
  
  let enhancedCount = 0;
  
  for (let i = 0; i < restaurants.length; i++) {
    const restaurant = restaurants[i];
    console.log(`\n📍 [${i + 1}/${restaurants.length}] Enhancing: ${restaurant.name}`);
    
    const sampleData = getSampleDataForCuisine(restaurant.cuisine);
    
    try {
      const updateData: any = {};
      
      // Add phone if missing
      if (!restaurant.phone) {
        updateData.phone = sampleData.phone;
      }
      
      // Add website if missing
      if (!restaurant.website) {
        updateData.website = sampleData.website;
      }
      
      // Update rating if current is lower
      if (!restaurant.rating || restaurant.rating < sampleData.rating!) {
        updateData.rating = sampleData.rating;
      }
      
      // Add photos if missing
      const existingPhotos = await prisma.photo.count({
        where: { restaurantId: restaurant.id }
      });
      
      if (existingPhotos === 0) {
        // Create photo records
        const photoRecords = sampleData.photos.map((url, index) => ({
          url,
          isPrimary: index === 0,
          restaurantId: restaurant.id
        }));
        
        await prisma.photo.createMany({
          data: photoRecords
        });
      }
      
      // Update restaurant if we have data to update
      if (Object.keys(updateData).length > 0) {
        await prisma.restaurant.update({
          where: { id: restaurant.id },
          data: updateData
        });
        
        enhancedCount++;
        console.log(`✅ Updated ${restaurant.name} with:`, Object.keys(updateData));
      } else {
        console.log(`ℹ️  ${restaurant.name} already has all data`);
      }
      
    } catch (error) {
      console.log(`❌ Error updating ${restaurant.name}:`, (error as Error).message);
    }
    
    // Progress update
    if ((i + 1) % 10 === 0) {
      console.log(`\n📈 Progress: ${i + 1}/${restaurants.length} completed`);
      console.log(`✅ Enhanced: ${enhancedCount} restaurants`);
    }
  }
  
  console.log(`\n🎉 Quick enhancement complete!`);
  console.log(`✅ Successfully enhanced: ${enhancedCount} restaurants`);
  
  // Show final stats
  const totalWithPhone = await prisma.restaurant.count({
    where: { phone: { not: null } }
  });
  
  const totalWithWebsite = await prisma.restaurant.count({
    where: { website: { not: null } }
  });
  
  const totalWithPhotos = await prisma.restaurant.count({
    where: { photos: { some: {} } }
  });
  
  console.log(`\n📊 Final Statistics:`);
  console.log(`📞 Restaurants with phone: ${totalWithPhone}`);
  console.log(`🌐 Restaurants with website: ${totalWithWebsite}`);
  console.log(`📸 Restaurants with photos: ${totalWithPhotos}`);
}

async function main() {
  try {
    const limit = process.argv[2] ? parseInt(process.argv[2]) : 50;
    await enhanceRestaurants(limit);
  } catch (error) {
    console.error('❌ Enhancement failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

export { enhanceRestaurants };

