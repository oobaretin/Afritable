'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon, MapPinIcon, CalendarDaysIcon, UsersIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SearchFilters } from '@/components/search/SearchFilters';

export function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() || location.trim()) {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      if (location.trim()) params.set('city', location.trim());
      router.push(`/restaurants?${params.toString()}`);
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/20">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
      </div>
      
      <div className="relative container-custom py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Discover Amazing
            <span className="block text-yellow-300">African Cuisine</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 text-primary-100 max-w-3xl mx-auto leading-relaxed">
            From Ethiopian injera to Nigerian jollof rice, find and book reservations 
            at the best African restaurants in your city.
          </p>

          {/* Search Form */}
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search restaurants, cuisines, or dishes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 text-gray-900 bg-white border-0 shadow-lg"
                  />
                </div>

                {/* Location Input */}
                <div className="flex-1 relative">
                  <MapPinIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="City, State, or ZIP"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-12 h-14 text-gray-900 bg-white border-0 shadow-lg"
                  />
                </div>

                {/* Search Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="h-14 px-8 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold shadow-lg"
                >
                  Search
                </Button>
              </div>

              {/* Advanced Filters Toggle */}
              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowFilters(!showFilters)}
                  className="text-white hover:bg-white/10"
                >
                  {showFilters ? 'Hide' : 'Show'} Advanced Filters
                </Button>
              </div>
            </form>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-lg">
                <SearchFilters />
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">500+</div>
              <div className="text-primary-100">Restaurants</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">15+</div>
              <div className="text-primary-100">Cuisines</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">5</div>
              <div className="text-primary-100">Major Cities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">10K+</div>
              <div className="text-primary-100">Happy Customers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
