const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanRestaurants() {
  console.log('🧹 Cleaning non-African restaurants...');
  
  // Remove clearly non-African restaurants
  const nonAfrican = [
    'Mediterranean', 'Persian', 'Iranian', 'Middle Eastern', 'Chinese', 
    'Hunan', 'Asian', 'Nandos', 'Portuguese', 'Brazilian', 'Mexican',
    'Italian', 'French', 'American', 'Fast Food', 'Pizza', 'Burger',
    'Sandwich', 'Cafe', 'Coffee', 'Bakery', 'Thai', 'Vietnamese',
    'Japanese', 'Korean', 'Indian', 'Pakistani', 'Turkish', 'Greek'
  ];
  
  let totalRemoved = 0;
  for (const cuisine of nonAfrican) {
    const result = await prisma.restaurant.deleteMany({
      where: {
        OR: [
          { cuisine: { contains: cuisine } },
          { name: { contains: cuisine } }
        ]
      }
    });
    totalRemoved += result.count;
    if (result.count > 0) {
      console.log(`❌ Removed ${result.count} ${cuisine} restaurants`);
    }
  }
  
  const remaining = await prisma.restaurant.count();
  console.log(`\n✅ Cleanup complete!`);
  console.log(`📊 Removed: ${totalRemoved} non-African restaurants`);
  console.log(`📊 Remaining: ${remaining} authentic African/Caribbean restaurants`);
  
  await prisma.$disconnect();
}

cleanRestaurants().catch(console.error);
