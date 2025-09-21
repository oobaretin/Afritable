const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Replace this with your actual Google Places API key
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || 'YOUR_GOOGLE_PLACES_API_KEY_HERE';

async function getRealGooglePlacesImages() {
  console.log('🚀 Getting REAL restaurant images from Google Places API...');
  
  if (GOOGLE_PLACES_API_KEY === 'YOUR_GOOGLE_PLACES_API_KEY_HERE') {
    console.log('❌ Please set your Google Places API key in the GOOGLE_PLACES_API_KEY environment variable');
    console.log('   Or replace the API key in this script');
    return;
  }

  try {
    // Get restaurants that need real images
    const restaurants = await prisma.restaurant.findMany({
      where: {
        photos: {
          some: {}
        }
      },
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        state: true,
        cuisine: true
      },
      take: 100 // Process 100 restaurants at a time
    });

    console.log(`Found ${restaurants.length} restaurants to process`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < restaurants.length; i++) {
      const restaurant = restaurants[i];
      console.log(`\n[${i + 1}/${restaurants.length}] Processing: ${restaurant.name} (${restaurant.city}, ${restaurant.state})`);

      try {
        // Search for restaurant on Google Places
        const searchQuery = `${restaurant.name} ${restaurant.address} ${restaurant.city} ${restaurant.state}`;
        const realImages = await searchGooglePlaces(searchQuery, restaurant);

        if (realImages.length > 0) {
          // Delete existing photos
          await prisma.photo.deleteMany({
            where: {
              restaurantId: restaurant.id
            }
          });

          // Create new photos with real Google Places images
          for (let j = 0; j < realImages.length; j++) {
            await prisma.photo.create({
              data: {
                restaurantId: restaurant.id,
                url: realImages[j],
                caption: `${restaurant.name} - ${restaurant.cuisine} restaurant in ${restaurant.city}, ${restaurant.state}`,
                isPrimary: j === 0
              }
            });
          }

          console.log(`  ✅ Found ${realImages.length} real Google Places images for ${restaurant.name}`);
          successCount++;
        } else {
          console.log(`  ⚠️  No real images found for ${restaurant.name}`);
          errorCount++;
        }

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.log(`  ❌ Error processing ${restaurant.name}: ${error.message}`);
        errorCount++;
      }
    }

    console.log(`\n🎉 Processing complete!`);
    console.log(`✅ Successfully processed: ${successCount} restaurants`);
    console.log(`❌ Errors: ${errorCount} restaurants`);

  } catch (error) {
    console.error('Error in main process:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function searchGooglePlaces(query, restaurant) {
  try {
    // Step 1: Search for the place
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_PLACES_API_KEY}`;
    
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.status !== 'OK' || !searchData.results || searchData.results.length === 0) {
      console.log(`    No results found for: ${query}`);
      return [];
    }

    const place = searchData.results[0];
    const placeId = place.place_id;

    // Step 2: Get place details including photos
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${GOOGLE_PLACES_API_KEY}`;
    
    const detailsResponse = await fetch(detailsUrl);
    const detailsData = await detailsResponse.json();

    if (detailsData.status !== 'OK' || !detailsData.result.photos) {
      console.log(`    No photos found for: ${restaurant.name}`);
      return [];
    }

    // Step 3: Convert photo references to URLs
    const photoUrls = detailsData.result.photos.slice(0, 3).map(photo => {
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${GOOGLE_PLACES_API_KEY}`;
    });

    console.log(`    Found ${photoUrls.length} real photos for ${restaurant.name}`);
    return photoUrls;

  } catch (error) {
    console.log(`    Error searching Google Places: ${error.message}`);
    return [];
  }
}

getRealGooglePlacesImages();
