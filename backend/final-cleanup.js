const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function finalCleanup() {
  console.log('🧹 Final cleanup - removing remaining non-African restaurants...');
  
  // Remove remaining non-African cuisines
  const nonAfricanCuisines = [
    'Lebanese', 'Afghan', 'Spanish', 'German', 'Argentine', 'Peruvian',
    'Turkish', 'Greek', 'Syrian', 'Iraqi', 'Pakistani', 'Indian', 'Nepalese',
    'Chinese', 'Japanese', 'Korean', 'Thai', 'Vietnamese', 'Filipino',
    'Italian', 'French', 'Russian', 'Polish', 'Mexican', 'Brazilian',
    'Colombian', 'American', 'Fast Food', 'Pizza', 'Burger', 'Sandwich',
    'Cafe', 'Coffee', 'Bakery', 'Deli', 'Diner'
  ];
  
  let totalRemoved = 0;
  
  for (const cuisine of nonAfricanCuisines) {
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
  
  // Remove any restaurants with suspicious names
  const suspiciousNames = [
    'Nandos', 'Hunan', 'Mediterranean', 'Persian', 'Middle Eastern',
    'Turkish', 'Greek', 'Lebanese', 'Chinese', 'Japanese', 'Thai',
    'Italian', 'French', 'Mexican', 'Brazilian', 'Pizza', 'Burger',
    'Cafe', 'Coffee', 'Bakery', 'Deli', 'Diner'
  ];
  
  for (const name of suspiciousNames) {
    const result = await prisma.restaurant.deleteMany({
      where: { name: { contains: name } }
    });
    totalRemoved += result.count;
    if (result.count > 0) {
      console.log(`❌ Removed ${result.count} restaurants with name: ${name}`);
    }
  }
  
  const remaining = await prisma.restaurant.count();
  console.log(`\n✅ Final cleanup complete!`);
  console.log(`📊 Removed: ${totalRemoved} non-African restaurants`);
  console.log(`📊 Remaining: ${remaining} authentic African & Caribbean restaurants`);
  
  // Show what's left
  console.log(`\n🔍 Remaining cuisines:`);
  const cuisines = await prisma.restaurant.groupBy({
    by: ['cuisine'],
    _count: { cuisine: true },
    orderBy: { _count: { cuisine: 'desc' } }
  });
  
  cuisines.forEach(c => {
    console.log(`- ${c.cuisine}: ${c._count.cuisine} restaurants`);
  });
  
  await prisma.$disconnect();
}

finalCleanup().catch(console.error);

