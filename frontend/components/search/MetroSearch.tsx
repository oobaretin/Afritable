import React, { useState, useEffect } from 'react';

interface MetroArea {
  id: string;
  name: string;
  state: string;
  restaurantCount: number;
}

interface GroupedMetroAreas {
  'United States': MetroArea[];
  'Canada': MetroArea[];
  'Europe': MetroArea[];
  'Africa': MetroArea[];
  'Caribbean': MetroArea[];
}

interface Region {
  id: string;
  name: string;
  restaurantsCount: number;
}

interface MetroSearchProps {
  onMetroChange: (metroAreaId: string | null) => void;
  onRegionChange: (regionId: string | null) => void;
  selectedMetro?: string;
  selectedRegion?: string;
  className?: string;
}

const MetroSearch: React.FC<MetroSearchProps> = ({
  onMetroChange,
  onRegionChange,
  selectedMetro,
  selectedRegion,
  className = ''
}) => {
  const [groupedMetroAreas, setGroupedMetroAreas] = useState<GroupedMetroAreas | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(false);
  const [regionsLoading, setRegionsLoading] = useState(false);

  // Fetch metro areas on component mount
  useEffect(() => {
    fetchMetroAreas();
  }, []);

  // Fetch regions when metro area changes
  useEffect(() => {
    if (selectedMetro) {
      fetchRegions(selectedMetro);
    } else {
      setRegions([]);
      onRegionChange(null);
    }
  }, [selectedMetro]);

  const fetchMetroAreas = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/locations/metro-areas');
      const data = await response.json();
      if (data.success) {
        setGroupedMetroAreas(data.data);
      }
    } catch (error) {
      console.error('Error fetching metro areas:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegions = async (metroAreaId: string) => {
    try {
      setRegionsLoading(true);
      const response = await fetch(`http://localhost:3001/api/locations/metro-areas/${metroAreaId}/regions`);
      const data = await response.json();
      if (data.success) {
        setRegions(data.data);
      }
    } catch (error) {
      console.error('Error fetching regions:', error);
    } finally {
      setRegionsLoading(false);
    }
  };

  const handleMetroChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onMetroChange(value || null);
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onRegionChange(value || null);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Metro Area Selection */}
      <div>
        <label htmlFor="metro-area" className="block text-sm font-medium text-gray-700 mb-2">
          Metro Area
        </label>
        <select
          id="metro-area"
          value={selectedMetro || ''}
          onChange={handleMetroChange}
          disabled={loading}
          className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">Select a metro area</option>
          {groupedMetroAreas && Object.entries(groupedMetroAreas).map(([region, metros]: [string, any[]]) => (
            metros.length > 0 && (
              <optgroup key={region} label={region}>
                {metros.map((metro: any) => (
                  <option key={metro.id} value={metro.id}>
                    {metro.name}, {metro.state} ({metro.restaurantCount} restaurants)
                  </option>
                ))}
              </optgroup>
            )
          ))}
        </select>
        {loading && (
          <p className="mt-1 text-sm text-gray-500">Loading metro areas...</p>
        )}
      </div>

      {/* Region Selection */}
      {selectedMetro && (
        <div>
          <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
            Region
          </label>
          <select
            id="region"
            value={selectedRegion || ''}
            onChange={handleRegionChange}
            disabled={regionsLoading}
            className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">All regions in this metro area</option>
            {regions.map((region: any) => (
              <option key={region.id} value={region.id}>
                {region.name} ({region.restaurantsCount} restaurants)
              </option>
            ))}
          </select>
          {regionsLoading && (
            <p className="mt-1 text-sm text-gray-500">Loading regions...</p>
          )}
        </div>
      )}

      {/* Quick Metro Area Buttons */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Quick Select:</p>
        <div className="flex flex-wrap gap-2">
          {groupedMetroAreas && Object.values(groupedMetroAreas).flat().slice(0, 6).map((metro) => (
            <button
              key={metro.id}
              onClick={() => onMetroChange(metro.id)}
              className={`px-3 py-1 text-sm rounded-full border transition-colors duration-200 ${
                selectedMetro === metro.id
                  ? 'bg-orange-600 text-white border-orange-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-orange-50 hover:border-orange-300'
              }`}
            >
              {metro.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MetroSearch;
