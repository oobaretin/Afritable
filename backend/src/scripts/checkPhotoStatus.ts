import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkPhotoStatus() {
  try {
    console.log('📊 Checking restaurant photo status...\n');
    
    // Get total restaurant count
    const totalRestaurants = await prisma.restaurant.count();
    
    // Get restaurants with photos
    const restaurantsWithPhotos = await prisma.restaurant.count({
      where: {
        photos: {
          some: {}
        }
      }
    });
    
    // Get restaurants without photos
    const restaurantsWithoutPhotos = await prisma.restaurant.count({
      where: {
        photos: {
          none: {}
        }
      }
    });
    
    // Calculate percentages
    const withPhotosPercentage = ((restaurantsWithPhotos / totalRestaurants) * 100).toFixed(1);
    const withoutPhotosPercentage = ((restaurantsWithoutPhotos / totalRestaurants) * 100).toFixed(1);
    
    console.log('📈 Photo Status Summary:');
    console.log(`📊 Total restaurants: ${totalRestaurants}`);
    console.log(`✅ Restaurants with photos: ${restaurantsWithPhotos} (${withPhotosPercentage}%)`);
    console.log(`❌ Restaurants without photos: ${restaurantsWithoutPhotos} (${withoutPhotosPercentage}%)`);
    
    if (restaurantsWithoutPhotos > 0) {
      const daysRemaining = Math.ceil(restaurantsWithoutPhotos / 100);
      console.log(`\n⏰ Estimated days to complete (100 per day): ${daysRemaining} days`);
      console.log(`📅 Estimated completion date: ${new Date(Date.now() + (daysRemaining * 24 * 60 * 60 * 1000)).toLocaleDateString()}`);
    } else {
      console.log('\n🎉 All restaurants have photos!');
    }
    
    // Show some examples of restaurants without photos
    if (restaurantsWithoutPhotos > 0) {
      console.log('\n📋 Sample restaurants without photos:');
      const sampleRestaurants = await prisma.restaurant.findMany({
        where: {
          photos: {
            none: {}
          }
        },
        take: 5,
        select: {
          id: true,
          name: true,
          city: true,
          state: true,
          googlePlaceId: true
        }
      });
      
      sampleRestaurants.forEach((restaurant, index) => {
        console.log(`${index + 1}. ${restaurant.name} (${restaurant.city}, ${restaurant.state}) - ${restaurant.googlePlaceId ? 'Has Place ID' : 'No Place ID'}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking photo status:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
checkPhotoStatus();
