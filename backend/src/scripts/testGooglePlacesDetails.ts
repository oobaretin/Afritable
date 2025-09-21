import dotenv from 'dotenv';
import axios from 'axios';

// Load environment variables
dotenv.config();

async function testGooglePlacesDetails() {
  try {
    const googleApiKey = process.env.GOOGLE_PLACES_API_KEY;
    
    if (!googleApiKey) {
      console.error('❌ Google Places API key not found');
      return;
    }

    // Test with a known restaurant
    const placeId = 'ChIJIRWg2mndQIYRUvpgYdPEyZ0'; // Hastes African market
    
    console.log('🔍 Testing Google Places API details...');
    
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
      params: {
        place_id: placeId,
        key: googleApiKey,
        fields: 'name,formatted_phone_number,website,opening_hours,photos,rating,user_ratings_total,formatted_address'
      }
    });

    if (response.data.status === 'OK') {
      const result = response.data.result;
      console.log('✅ Success! Restaurant details:');
      console.log('📞 Phone:', result.formatted_phone_number || 'Not available');
      console.log('🌐 Website:', result.website || 'Not available');
      console.log('🕒 Hours:', result.opening_hours ? 'Available' : 'Not available');
      console.log('📸 Photos:', result.photos ? `${result.photos.length} photos` : 'Not available');
      console.log('⭐ Rating:', result.rating || 'Not available');
      console.log('📍 Address:', result.formatted_address || 'Not available');
      
      if (result.opening_hours && result.opening_hours.weekday_text) {
        console.log('\n🕒 Opening Hours:');
        result.opening_hours.weekday_text.forEach((day: string) => {
          console.log(`  ${day}`);
        });
      }
    } else {
      console.error('❌ API Error:', response.data.status, response.data.error_message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testGooglePlacesDetails();
