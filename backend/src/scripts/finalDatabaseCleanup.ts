import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Keywords that indicate non-African restaurants
const nonAfricanKeywords = [
  // European cuisines
  'italian', 'french', 'spanish', 'german', 'british', 'irish', 'greek', 'portuguese', 'dutch', 'swiss', 'austrian',
  'pizza', 'pasta', 'risotto', 'paella', 'tapas', 'bratwurst', 'schnitzel', 'fish and chips', 'bangers and mash',
  
  // Asian cuisines
  'chinese', 'japanese', 'korean', 'thai', 'vietnamese', 'indian', 'pakistani', 'bangladeshi', 'sri lankan',
  'sushi', 'ramen', 'pho', 'pad thai', 'curry', 'biryani', 'tikka', 'naan', 'samosa',
  
  // American cuisines
  'american', 'mexican', 'tex-mex', 'southern', 'bbq', 'barbecue', 'burger', 'hot dog', 'sandwich', 'deli',
  'steakhouse', 'seafood', 'cajun', 'creole', 'soul food',
  
  // Latin American
  'brazilian', 'argentinian', 'peruvian', 'colombian', 'venezuelan', 'ecuadorian', 'bolivian',
  'empanada', 'arepa', 'ceviche', 'pisco', 'caipirinha',
  
  // Middle Eastern (non-African)
  'lebanese', 'syrian', 'jordanian', 'israeli', 'palestinian', 'turkish', 'persian', 'iranian',
  'hummus', 'falafel', 'shawarma', 'kebab', 'baklava', 'turkish delight',
  
  // Other cuisines
  'russian', 'ukrainian', 'polish', 'czech', 'hungarian', 'romanian', 'bulgarian',
  'caribbean', 'jamaican', 'trinidadian', 'barbadian',
  'australian', 'new zealand', 'canadian',
  
  // Food trucks and mobile
  'food truck', 'mobile', 'cart', 'stand', 'trailer', 'van', 'truck'
];

// African countries (to remove restaurants located in Africa)
const africanCountries = [
  'nigeria', 'ghana', 'kenya', 'ethiopia', 'morocco', 'egypt', 'south africa', 'tanzania', 'uganda',
  'algeria', 'sudan', 'libya', 'tunisia', 'somalia', 'senegal', 'mali', 'burkina faso', 'niger',
  'chad', 'cameroon', 'central african republic', 'democratic republic of congo', 'congo', 'gabon',
  'equatorial guinea', 'sao tome', 'angola', 'zambia', 'zimbabwe', 'botswana', 'namibia', 'lesotho',
  'swaziland', 'malawi', 'mozambique', 'madagascar', 'mauritius', 'seychelles', 'comoros', 'djibouti',
  'eritrea', 'burundi', 'rwanda', 'liberia', 'sierra leone', 'guinea', 'gambia', 'guinea-bissau',
  'cape verde', 'ivory coast', 'togo', 'benin', 'mauritania', 'western sahara'
];

// US states and territories (to keep only these)
const usStates = [
  'alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado', 'connecticut', 'delaware',
  'florida', 'georgia', 'hawaii', 'idaho', 'illinois', 'indiana', 'iowa', 'kansas', 'kentucky',
  'louisiana', 'maine', 'maryland', 'massachusetts', 'michigan', 'minnesota', 'mississippi', 'missouri',
  'montana', 'nebraska', 'nevada', 'new hampshire', 'new jersey', 'new mexico', 'new york', 'north carolina',
  'north dakota', 'ohio', 'oklahoma', 'oregon', 'pennsylvania', 'rhode island', 'south carolina', 'south dakota',
  'tennessee', 'texas', 'utah', 'vermont', 'virginia', 'washington', 'west virginia', 'wisconsin', 'wyoming',
  'washington dc', 'district of columbia', 'puerto rico', 'us virgin islands', 'guam', 'american samoa',
  'northern mariana islands', 'al', 'ak', 'az', 'ar', 'ca', 'co', 'ct', 'de', 'fl', 'ga', 'hi', 'id',
  'il', 'in', 'ia', 'ks', 'ky', 'la', 'me', 'md', 'ma', 'mi', 'mn', 'ms', 'mo', 'mt', 'ne', 'nv',
  'nh', 'nj', 'nm', 'ny', 'nc', 'nd', 'oh', 'ok', 'or', 'pa', 'ri', 'sc', 'sd', 'tn', 'tx', 'ut',
  'vt', 'va', 'wa', 'wv', 'wi', 'wy', 'dc'
];

function isNonAfricanRestaurant(name: string, description: string | null, cuisine: string): boolean {
  const text = `${name} ${description || ''} ${cuisine}`.toLowerCase();
  
  // Check for food truck indicators
  if (text.includes('food truck') || text.includes('mobile') || text.includes('cart') || 
      text.includes('stand') || text.includes('trailer') || text.includes('van') || text.includes('truck')) {
    return true;
  }
  
  // Check for non-African keywords
  for (const keyword of nonAfricanKeywords) {
    if (text.includes(keyword)) {
      return true;
    }
  }
  
  return false;
}

function isLocatedInAfrica(city: string, state: string, country: string | null): boolean {
  const location = `${city} ${state} ${country || ''}`.toLowerCase();
  
  // Check for African countries
  for (const country of africanCountries) {
    if (location.includes(country)) {
      return true;
    }
  }
  
  return false;
}

function isLocatedInUS(city: string, state: string, country: string | null): boolean {
  const location = `${city} ${state} ${country || ''}`.toLowerCase();
  
  // Check for US states
  for (const usState of usStates) {
    if (location.includes(usState)) {
      return true;
    }
  }
  
  return false;
}

async function finalDatabaseCleanup() {
  try {
    console.log('🧹 Starting final database cleanup...');
    console.log('Removing: Non-African restaurants, Food trucks, African restaurants in Africa');
    console.log('Keeping: Only African restaurants in the US\n');
    
    // Get all restaurants
    const allRestaurants = await prisma.restaurant.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        cuisine: true,
        city: true,
        state: true,
        country: true
      }
    });
    
    console.log(`📊 Total restaurants in database: ${allRestaurants.length}`);
    
    const restaurantsToDelete = [];
    const restaurantsToKeep = [];
    
    // Categorize restaurants
    for (const restaurant of allRestaurants) {
      const isNonAfrican = isNonAfricanRestaurant(restaurant.name, restaurant.description, restaurant.cuisine);
      const isInAfrica = isLocatedInAfrica(restaurant.city, restaurant.state, restaurant.country);
      const isInUS = isLocatedInUS(restaurant.city, restaurant.state, restaurant.country);
      
      if (isNonAfrican || isInAfrica || !isInUS) {
        restaurantsToDelete.push(restaurant);
      } else {
        restaurantsToKeep.push(restaurant);
      }
    }
    
    console.log(`✅ Restaurants to keep (US African): ${restaurantsToKeep.length}`);
    console.log(`❌ Restaurants to delete: ${restaurantsToDelete.length}`);
    
    if (restaurantsToDelete.length === 0) {
      console.log('\n🎉 Database is already clean! No cleanup needed.');
      return;
    }
    
    console.log('\n📋 Sample restaurants to be deleted:');
    restaurantsToDelete.slice(0, 10).forEach((restaurant, index) => {
      console.log(`${index + 1}. ${restaurant.name} (${restaurant.cuisine}) - ${restaurant.city}, ${restaurant.state}, ${restaurant.country || 'N/A'}`);
    });
    
    if (restaurantsToDelete.length > 10) {
      console.log(`... and ${restaurantsToDelete.length - 10} more`);
    }
    
    console.log(`\n⚠️  This will delete ${restaurantsToDelete.length} restaurants.`);
    console.log('🔄 Proceeding with cleanup...\n');
    
    // Delete restaurants
    let deletedCount = 0;
    for (const restaurant of restaurantsToDelete) {
      try {
        // Delete photos first (due to foreign key constraint)
        await prisma.photo.deleteMany({
          where: { restaurantId: restaurant.id }
        });
        
        // Delete the restaurant
        await prisma.restaurant.delete({
          where: { id: restaurant.id }
        });
        
        deletedCount++;
        if (deletedCount % 100 === 0) {
          console.log(`✅ Deleted ${deletedCount} restaurants...`);
        }
        
      } catch (error) {
        console.error(`❌ Error deleting ${restaurant.name}:`, error);
      }
    }
    
    console.log(`\n📈 Final Cleanup Summary:`);
    console.log(`✅ Successfully deleted: ${deletedCount} restaurants`);
    console.log(`📊 Remaining US African restaurants: ${restaurantsToKeep.length}`);
    
    // Check final status
    const finalCount = await prisma.restaurant.count();
    console.log(`📊 Final restaurant count: ${finalCount}`);
    
    // Show sample of remaining restaurants
    const sampleRestaurants = await prisma.restaurant.findMany({
      take: 5,
      select: {
        name: true,
        cuisine: true,
        city: true,
        state: true
      }
    });
    
    console.log('\n📋 Sample remaining restaurants:');
    sampleRestaurants.forEach((restaurant, index) => {
      console.log(`${index + 1}. ${restaurant.name} (${restaurant.cuisine}) - ${restaurant.city}, ${restaurant.state}`);
    });
    
    console.log('\n🎉 Database cleanup completed! Only US African restaurants remain.');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the cleanup
finalDatabaseCleanup();
