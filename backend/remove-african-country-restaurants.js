const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function removeAfricanCountryRestaurants() {
  console.log('🌍 Removing African restaurants located in African countries...');
  
  // List of African country codes
  const africanCountries = [
    'NG', 'KE', 'ET', 'GH', 'ZA', 'EG', 'MA', 'TN', 'DZ', 'LY', 'SD', 'SS', 
    'TD', 'NE', 'ML', 'BF', 'CI', 'GN', 'SL', 'LR', 'SN', 'GM', 'GW', 'CV', 
    'MR', 'SO', 'DJ', 'ER', 'UG', 'TZ', 'RW', 'BI', 'CD', 'CF', 'CM', 'GQ', 
    'GA', 'CG', 'AO', 'ZM', 'ZW', 'BW', 'NA', 'SZ', 'LS', 'MG', 'MU', 'SC', 
    'KM', 'YT', 'RE'
  ];
  
  let totalRemoved = 0;
  
  for (const countryCode of africanCountries) {
    const result = await prisma.restaurant.deleteMany({
      where: {
        country: countryCode
      }
    });
    totalRemoved += result.count;
    if (result.count > 0) {
      console.log(`❌ Removed ${result.count} restaurants from ${countryCode}`);
    }
  }
  
  // Also remove any restaurants with African country names in their location
  const africanCountryNames = [
    'Nigeria', 'Kenya', 'Ethiopia', 'Ghana', 'South Africa', 'Egypt', 
    'Morocco', 'Tunisia', 'Algeria', 'Libya', 'Sudan', 'South Sudan',
    'Chad', 'Niger', 'Mali', 'Burkina Faso', 'Ivory Coast', 'Guinea',
    'Sierra Leone', 'Liberia', 'Senegal', 'Gambia', 'Guinea-Bissau',
    'Cape Verde', 'Mauritania', 'Somalia', 'Djibouti', 'Eritrea',
    'Uganda', 'Tanzania', 'Rwanda', 'Burundi', 'Democratic Republic of Congo',
    'Central African Republic', 'Cameroon', 'Equatorial Guinea', 'Gabon',
    'Republic of Congo', 'Angola', 'Zambia', 'Zimbabwe', 'Botswana',
    'Namibia', 'Eswatini', 'Lesotho', 'Madagascar', 'Mauritius',
    'Seychelles', 'Comoros', 'Mayotte', 'Réunion'
  ];
  
  for (const countryName of africanCountryNames) {
    const result = await prisma.restaurant.deleteMany({
      where: {
        OR: [
          { city: { contains: countryName } },
          { state: { contains: countryName } },
          { address: { contains: countryName } }
        ]
      }
    });
    totalRemoved += result.count;
    if (result.count > 0) {
      console.log(`❌ Removed ${result.count} restaurants with ${countryName} in location`);
    }
  }
  
  const remaining = await prisma.restaurant.count();
  console.log(`\n✅ Cleanup complete!`);
  console.log(`📊 Removed: ${totalRemoved} African country restaurants`);
  console.log(`📊 Remaining: ${remaining} US-based African & Caribbean restaurants`);
  
  await prisma.$disconnect();
}

removeAfricanCountryRestaurants().catch(console.error);

