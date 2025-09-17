'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

const cuisines = [
  {
    name: 'Ethiopian',
    description: 'Traditional injera, wat stews, and coffee ceremonies',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
    color: 'from-red-500 to-orange-500',
  },
  {
    name: 'Nigerian',
    description: 'Jollof rice, egusi soup, and suya skewers',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
    color: 'from-green-500 to-emerald-500',
  },
  {
    name: 'Moroccan',
    description: 'Tagine, couscous, and mint tea traditions',
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400',
    color: 'from-yellow-500 to-amber-500',
  },
  {
    name: 'West African',
    description: 'Rich stews, plantains, and aromatic spices',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'East African',
    description: 'Nyama choma, ugali, and coastal flavors',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Somali',
    description: 'Canjeero, hilib ari, and traditional spices',
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400',
    color: 'from-indigo-500 to-purple-500',
  },
];

export function CuisineCategories() {
  const router = useRouter();

  const handleCuisineClick = (cuisine: string) => {
    router.push(`/restaurants?cuisine=${encodeURIComponent(cuisine)}`);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore African Cuisines
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From the spicy flavors of West Africa to the aromatic dishes of North Africa, 
            discover the diverse culinary traditions of the continent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cuisines.map((cuisine, index) => (
            <div
              key={cuisine.name}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Background Image */}
              <div className="relative h-64">
                <div className={`absolute inset-0 bg-gradient-to-br ${cuisine.color} opacity-80`} />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                
                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{cuisine.name}</h3>
                  <p className="text-white/90 mb-4 text-sm leading-relaxed">
                    {cuisine.description}
                  </p>
                  <Button
                    onClick={() => handleCuisineClick(cuisine.name)}
                    className="w-fit bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 backdrop-blur-sm"
                  >
                    Explore {cuisine.name}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            onClick={() => router.push('/restaurants')}
            className="bg-primary-600 hover:bg-primary-700"
          >
            View All Cuisines
          </Button>
        </div>
      </div>
    </section>
  );
}
