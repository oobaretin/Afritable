'use client';

import { useQuery } from 'react-query';
import { api } from '@/lib/api';
import { Restaurant } from '@/types/restaurant';
import { RestaurantCard } from '@/components/restaurant/RestaurantCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export function FeaturedRestaurants() {
  const router = useRouter();

  const { data, isLoading, error } = useQuery(
    'featured-restaurants',
    async () => {
      const response = await api.get('/restaurants', {
        params: {
          limit: 6,
          rating: 4.0,
          sortBy: 'rating',
          sortOrder: 'desc',
        },
      });
      return response.data.data as Restaurant[];
    }
  );

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center">
            <p className="text-gray-500">Unable to load featured restaurants</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured African Restaurants
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the most highly-rated African restaurants in your area, 
            featuring authentic flavors and exceptional dining experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {data?.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            onClick={() => router.push('/restaurants')}
            className="bg-primary-600 hover:bg-primary-700"
          >
            View All Restaurants
          </Button>
        </div>
      </div>
    </section>
  );
}
