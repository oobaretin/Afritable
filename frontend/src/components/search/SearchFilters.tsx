'use client';

import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';

interface SearchFiltersProps {
  onFiltersChange?: (filters: any) => void;
}

export function SearchFilters({ onFiltersChange }: SearchFiltersProps) {
  const [filters, setFilters] = useState({
    cuisine: '',
    priceRange: '',
    rating: '',
    features: [] as string[],
  });

  const cuisines = [
    'Ethiopian', 'Nigerian', 'Moroccan', 'West African', 'East African',
    'Somali', 'Sudanese', 'Ghanaian', 'Senegalese', 'Kenyan'
  ];

  const priceRanges = [
    { value: 'BUDGET', label: '$ (Budget)' },
    { value: 'MODERATE', label: '$$ (Moderate)' },
    { value: 'EXPENSIVE', label: '$$$ (Expensive)' },
    { value: 'VERY_EXPENSIVE', label: '$$$$ (Very Expensive)' },
  ];

  const ratings = [
    { value: '4.5', label: '4.5+ Stars' },
    { value: '4.0', label: '4.0+ Stars' },
    { value: '3.5', label: '3.5+ Stars' },
    { value: '3.0', label: '3.0+ Stars' },
  ];

  const features = [
    { value: 'hasDelivery', label: 'Delivery' },
    { value: 'hasTakeout', label: 'Takeout' },
    { value: 'hasOutdoorSeating', label: 'Outdoor Seating' },
    { value: 'hasWifi', label: 'WiFi' },
    { value: 'hasParking', label: 'Parking' },
    { value: 'isWheelchairAccessible', label: 'Wheelchair Accessible' },
  ];

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleFeatureToggle = (feature: string) => {
    const newFeatures = filters.features.includes(feature)
      ? filters.features.filter(f => f !== feature)
      : [...filters.features, feature];
    
    handleFilterChange('features', newFeatures);
  };

  const clearFilters = () => {
    const clearedFilters = {
      cuisine: '',
      priceRange: '',
      rating: '',
      features: [],
    };
    setFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Filter Results</h3>
        <Button
          type="button"
          variant="ghost"
          onClick={clearFilters}
          className="text-white hover:bg-white/10"
        >
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Cuisine Filter */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Cuisine Type
          </label>
          <select
            value={filters.cuisine}
            onChange={(e) => handleFilterChange('cuisine', e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <option value="">All Cuisines</option>
            {cuisines.map((cuisine) => (
              <option key={cuisine} value={cuisine} className="text-gray-900">
                {cuisine}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range Filter */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Price Range
          </label>
          <select
            value={filters.priceRange}
            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <option value="">Any Price</option>
            {priceRanges.map((range) => (
              <option key={range.value} value={range.value} className="text-gray-900">
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Minimum Rating
          </label>
          <select
            value={filters.rating}
            onChange={(e) => handleFilterChange('rating', e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <option value="">Any Rating</option>
            {ratings.map((rating) => (
              <option key={rating.value} value={rating.value} className="text-gray-900">
                {rating.label}
              </option>
            ))}
          </select>
        </div>

        {/* Features Filter */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Features
          </label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {features.map((feature) => (
              <label key={feature.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.features.includes(feature.value)}
                  onChange={() => handleFeatureToggle(feature.value)}
                  className="rounded border-white/20 bg-white/10 text-primary-600 focus:ring-primary-500 focus:ring-offset-0"
                />
                <span className="ml-2 text-sm text-white">{feature.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
