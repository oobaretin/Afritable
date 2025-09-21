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

// Keywords that indicate African restaurants (to keep)
const africanKeywords = [
  'african', 'ethiopian', 'nigerian', 'ghanaian', 'kenyan', 'tanzanian', 'ugandan', 'rwandan', 'burundian',
  'senegalese', 'mali', 'burkina faso', 'ivory coast', 'liberian', 'sierra leone', 'guinea', 'gambia',
  'moroccan', 'tunisian', 'algerian', 'libyan', 'egyptian', 'sudanese', 'south sudan', 'chad', 'niger',
  'cameroonian', 'central african', 'gabonese', 'equatorial guinea', 'sao tome', 'congo', 'democratic republic',
  'angolan', 'zambian', 'zimbabwean', 'botswana', 'namibia', 'south african', 'lesotho', 'swaziland',
  'malawian', 'mozambican', 'madagascar', 'mauritius', 'seychelles', 'comoros', 'djibouti', 'eritrea',
  'somalia', 'ethiopia', 'kenya', 'tanzania', 'uganda', 'rwanda', 'burundi',
  
  // African dishes
  'jollof', 'fufu', 'banku', 'kenkey', 'waakye', 'red red', 'kelewele', 'suya', 'pepper soup',
  'injera', 'kitfo', 'tibs', 'doro wat', 'shiro', 'misir wat', 'gomen', 'ayib',
  'tagine', 'couscous', 'harira', 'pastilla', 'brik', 'merguez', 'kefta',
  'bobotie', 'bunny chow', 'samoosa', 'biryani', 'bunny chow', 'vetkoek', 'koeksister',
  'nyama choma', 'ugali', 'sukuma wiki', 'chapati', 'mandazi', 'pilau', 'biriani'
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
  
  // If it contains African keywords, it's likely African
  for (const keyword of africanKeywords) {
    if (text.includes(keyword)) {
      return false;
    }
  }
  
  // If no clear indicators, check cuisine field specifically
  const cuisineLower = cuisine.toLowerCase();
  if (cuisineLower.includes('african') || cuisineLower.includes('ethiopian') || 
      cuisineLower.includes('nigerian') || cuisineLower.includes('moroccan') ||
      cuisineLower.includes('egyptian') || cuisineLower.includes('kenyan') ||
      cuisineLower.includes('ghanaian') || cuisineLower.includes('senegalese')) {
    return false;
  }
  
  // Default to keeping if uncertain
  return false;
}

async function cleanNonAfricanRestaurants() {
  try {
    console.log('🔍 Scanning for non-African restaurants and food trucks...\n');
    
    // Get all restaurants
    const allRestaurants = await prisma.restaurant.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        cuisine: true,
        city: true,
        state: true
      }
    });
    
    console.log(`📊 Total restaurants in database: ${allRestaurants.length}`);
    
    const nonAfricanRestaurants = [];
    const africanRestaurants = [];
    
    // Categorize restaurants
    for (const restaurant of allRestaurants) {
      if (isNonAfricanRestaurant(restaurant.name, restaurant.description, restaurant.cuisine)) {
        nonAfricanRestaurants.push(restaurant);
      } else {
        africanRestaurants.push(restaurant);
      }
    }
    
    console.log(`✅ African restaurants: ${africanRestaurants.length}`);
    console.log(`❌ Non-African restaurants: ${nonAfricanRestaurants.length}`);
    
    if (nonAfricanRestaurants.length === 0) {
      console.log('\n🎉 All restaurants are African! No cleanup needed.');
      return;
    }
    
    console.log('\n📋 Non-African restaurants to be removed:');
    nonAfricanRestaurants.slice(0, 10).forEach((restaurant, index) => {
      console.log(`${index + 1}. ${restaurant.name} (${restaurant.cuisine}) - ${restaurant.city}, ${restaurant.state}`);
    });
    
    if (nonAfricanRestaurants.length > 10) {
      console.log(`... and ${nonAfricanRestaurants.length - 10} more`);
    }
    
    console.log(`\n⚠️  This will delete ${nonAfricanRestaurants.length} non-African restaurants.`);
    console.log('🔄 Proceeding with cleanup...\n');
    
    // Delete non-African restaurants
    let deletedCount = 0;
    for (const restaurant of nonAfricanRestaurants) {
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
        console.log(`✅ Deleted: ${restaurant.name} (${restaurant.cuisine})`);
        
      } catch (error) {
        console.error(`❌ Error deleting ${restaurant.name}:`, error);
      }
    }
    
    console.log(`\n📈 Cleanup Summary:`);
    console.log(`✅ Successfully deleted: ${deletedCount} non-African restaurants`);
    console.log(`📊 Remaining African restaurants: ${africanRestaurants.length}`);
    
    // Check final status
    const finalCount = await prisma.restaurant.count();
    console.log(`📊 Final restaurant count: ${finalCount}`);
    
    console.log('\n🎉 Database cleanup completed! Only African restaurants remain.');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the cleanup
cleanNonAfricanRestaurants();
