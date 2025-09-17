import { Suspense } from 'react';
import { Hero } from '@/components/home/Hero';
import { FeaturedRestaurants } from '@/components/home/FeaturedRestaurants';
import { CuisineCategories } from '@/components/home/CuisineCategories';
import { HowItWorks } from '@/components/home/HowItWorks';
import { Testimonials } from '@/components/home/Testimonials';
import { Newsletter } from '@/components/home/Newsletter';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      
      <Suspense fallback={<LoadingSpinner />}>
        <FeaturedRestaurants />
      </Suspense>
      
      <CuisineCategories />
      <HowItWorks />
      <Testimonials />
      <Newsletter />
    </main>
  );
}
