import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface GoogleMapsResult {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  formatted_phone_number?: string;
  website?: string;
  rating?: number;
  user_ratings_total?: number;
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  business_status?: string;
}

async function searchGoogleMaps(restaurantName: string, city: string, state: string): Promise<GoogleMapsResult | null> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.log('❌ Google Maps API key not found');
    return null;
  }

  try {
    // Search for the restaurant using Google Places API
    const searchQuery = `${restaurantName} ${city} ${state}`;
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${apiKey}`;
    
    console.log(`🔍 Searching: ${searchQuery}`);
    
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json() as any;
    
    if (searchData.status !== 'OK' || !searchData.results || searchData.results.length === 0) {
      console.log(`❌ No results found for ${restaurantName}`);
      return null;
    }
    
    // Get the first result
    const place = searchData.results[0];
    
    // Get detailed information using Place Details API
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=place_id,name,formatted_address,geometry,formatted_phone_number,website,rating,user_ratings_total,photos,business_status&key=${apiKey}`;
    
    const detailsResponse = await fetch(detailsUrl);
    const detailsData = await detailsResponse.json() as any;
    
    if (detailsData.status !== 'OK') {
      console.log(`❌ Failed to get details for ${restaurantName}`);
      return null;
    }
    
    return detailsData.result;
    
  } catch (error) {
    console.error(`❌ Error searching for ${restaurantName}:`, error);
    return null;
  }
}

async function getPhotoUrl(photoReference: string, apiKey: string): Promise<string> {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoReference}&key=${apiKey}`;
}

async function enhanceRestaurantsWithGoogleMaps() {
  console.log('🚀 Starting Google Maps data enhancement...');
  
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.log('❌ Google Maps API key not found. Please set GOOGLE_MAPS_API_KEY environment variable.');
    return;
  }
  
  // Get restaurants that need enhancement (those without coordinates or with placeholder data)
  const restaurants = await prisma.restaurant.findMany({
    where: {
      OR: [
        { phone: { contains: '555' } },
        { phone: { contains: '000-0000' } },
        { phone: { contains: '(555)' } },
        { website: { contains: 'example.com' } },
        { website: { contains: 'placeholder' } }
      ]
    },
    take: 50, // Start with 50 restaurants
    orderBy: { id: 'asc' }
  });
  
  console.log(`📊 Found ${restaurants.length} restaurants to enhance`);
  
  let enhanced = 0;
  let errors = 0;
  
  for (let i = 0; i < restaurants.length; i++) {
    const restaurant = restaurants[i];
    console.log(`\n📍 [${i + 1}/${restaurants.length}] Enhancing: ${restaurant.name} in ${restaurant.city}, ${restaurant.state}`);
    
    try {
      const googleData = await searchGoogleMaps(restaurant.name, restaurant.city, restaurant.state);
      
      if (googleData) {
        const updates: any = {};
        
        // Update coordinates
        if (googleData.geometry?.location) {
          updates.latitude = googleData.geometry.location.lat;
          updates.longitude = googleData.geometry.location.lng;
          console.log(`✅ Found coordinates: ${updates.latitude}, ${updates.longitude}`);
        }
        
        // Update address
        if (googleData.formatted_address) {
          updates.address = googleData.formatted_address;
          console.log(`✅ Found address: ${updates.address}`);
        }
        
        // Update phone number
        if (googleData.formatted_phone_number) {
          updates.phone = googleData.formatted_phone_number;
          console.log(`✅ Found phone: ${updates.phone}`);
        }
        
        // Update website
        if (googleData.website) {
          updates.website = googleData.website;
          console.log(`✅ Found website: ${updates.website}`);
        }
        
        // Update rating
        if (googleData.rating && googleData.rating > 0) {
          updates.rating = googleData.rating;
          console.log(`✅ Found rating: ${updates.rating}`);
        }
        
        // Update review count
        if (googleData.user_ratings_total) {
          updates.reviewCount = googleData.user_ratings_total;
          console.log(`✅ Found review count: ${updates.reviewCount}`);
        }
        
        // Update photos
        if (googleData.photos && googleData.photos.length > 0) {
          // Delete existing photos
          await prisma.photo.deleteMany({
            where: { restaurantId: restaurant.id }
          });
          
          // Add new photos (limit to 3)
          for (let j = 0; j < Math.min(googleData.photos.length, 3); j++) {
            const photoUrl = await getPhotoUrl(googleData.photos[j].photo_reference, apiKey);
            await prisma.photo.create({
              data: {
                url: photoUrl,
                restaurantId: restaurant.id,
                isPrimary: j === 0
              }
            });
          }
          console.log(`✅ Added ${Math.min(googleData.photos.length, 3)} photos`);
        }
        
        // Update the restaurant
        if (Object.keys(updates).length > 0) {
          await prisma.restaurant.update({
            where: { id: restaurant.id },
            data: updates
          });
          enhanced++;
          console.log(`✅ Enhanced ${restaurant.name}`);
        } else {
          console.log(`ℹ️  No new data found for ${restaurant.name}`);
        }
      } else {
        console.log(`❌ No data found for ${restaurant.name}`);
        errors++;
      }
      
      // Add delay between requests to respect API limits
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`❌ Error enhancing ${restaurant.name}:`, error);
      errors++;
    }
  }
  
  console.log(`\n🎉 Google Maps enhancement complete!`);
  console.log(`✅ Enhanced: ${enhanced} restaurants`);
  console.log(`❌ Errors: ${errors} restaurants`);
  
  await prisma.$disconnect();
}

// Run the enhancement
enhanceRestaurantsWithGoogleMaps().catch(console.error);
