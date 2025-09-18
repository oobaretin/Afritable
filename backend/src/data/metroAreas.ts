export interface MetroArea {
  id: string;
  name: string;
  displayName: string;
  state: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  radius: number; // in miles
  regions: Region[];
  restaurantCount?: number;
}

export interface Region {
  id: string;
  name: string;
  metroAreaId: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  radius: number; // in miles
  restaurantCount?: number;
}

export const metroAreas: MetroArea[] = [
  {
    id: 'atlanta',
    name: 'Atlanta',
    displayName: 'Metro Atlanta',
    state: 'GA',
    coordinates: { latitude: 33.7490, longitude: -84.3880 },
    radius: 50,
    regions: [
      { id: 'atlanta-city', name: 'Atlanta', metroAreaId: 'atlanta', coordinates: { latitude: 33.7490, longitude: -84.3880 }, radius: 15 },
      { id: 'clayton', name: 'Clayton', metroAreaId: 'atlanta', coordinates: { latitude: 33.5415, longitude: -84.3593 }, radius: 10 },
      { id: 'coweta', name: 'Coweta', metroAreaId: 'atlanta', coordinates: { latitude: 33.3526, longitude: -84.7699 }, radius: 10 },
      { id: 'cherokee', name: 'Cherokee', metroAreaId: 'atlanta', coordinates: { latitude: 34.2439, longitude: -84.4741 }, radius: 10 },
      { id: 'douglas', name: 'Douglas', metroAreaId: 'atlanta', coordinates: { latitude: 33.7515, longitude: -84.7477 }, radius: 10 },
      { id: 'fayette', name: 'Fayette', metroAreaId: 'atlanta', coordinates: { latitude: 33.4143, longitude: -84.4900 }, radius: 10 },
      { id: 'fulton', name: 'Fulton', metroAreaId: 'atlanta', coordinates: { latitude: 33.7490, longitude: -84.3880 }, radius: 20 },
      { id: 'rockdale', name: 'Rockdale', metroAreaId: 'atlanta', coordinates: { latitude: 33.6543, longitude: -84.0266 }, radius: 10 }
    ]
  },
  {
    id: 'houston',
    name: 'Houston',
    displayName: 'Houston',
    state: 'TX',
    coordinates: { latitude: 29.7604, longitude: -95.3698 },
    radius: 50,
    regions: [
      { id: 'houston-city', name: 'Houston', metroAreaId: 'houston', coordinates: { latitude: 29.7604, longitude: -95.3698 }, radius: 20 },
      { id: 'harris', name: 'Harris County', metroAreaId: 'houston', coordinates: { latitude: 29.7604, longitude: -95.3698 }, radius: 30 },
      { id: 'fort-bend', name: 'Fort Bend County', metroAreaId: 'houston', coordinates: { latitude: 29.5694, longitude: -95.8144 }, radius: 15 },
      { id: 'montgomery', name: 'Montgomery County', metroAreaId: 'houston', coordinates: { latitude: 30.3072, longitude: -95.5031 }, radius: 15 }
    ]
  },
  {
    id: 'new-york-city',
    name: 'New York City',
    displayName: 'New York City',
    state: 'NY',
    coordinates: { latitude: 40.7128, longitude: -74.0060 },
    radius: 50,
    regions: [
      { id: 'manhattan', name: 'Manhattan', metroAreaId: 'new-york-city', coordinates: { latitude: 40.7831, longitude: -73.9712 }, radius: 10 },
      { id: 'brooklyn', name: 'Brooklyn', metroAreaId: 'new-york-city', coordinates: { latitude: 40.6782, longitude: -73.9442 }, radius: 10 },
      { id: 'queens', name: 'Queens', metroAreaId: 'new-york-city', coordinates: { latitude: 40.7282, longitude: -73.7949 }, radius: 10 },
      { id: 'bronx', name: 'Bronx', metroAreaId: 'new-york-city', coordinates: { latitude: 40.8448, longitude: -73.8648 }, radius: 10 },
      { id: 'staten-island', name: 'Staten Island', metroAreaId: 'new-york-city', coordinates: { latitude: 40.5795, longitude: -74.1502 }, radius: 10 }
    ]
  },
  {
    id: 'los-angeles',
    name: 'Los Angeles',
    displayName: 'Los Angeles',
    state: 'CA',
    coordinates: { latitude: 34.0522, longitude: -118.2437 },
    radius: 60,
    regions: [
      { id: 'los-angeles-city', name: 'Los Angeles', metroAreaId: 'los-angeles', coordinates: { latitude: 34.0522, longitude: -118.2437 }, radius: 20 },
      { id: 'beverly-hills', name: 'Beverly Hills', metroAreaId: 'los-angeles', coordinates: { latitude: 34.0736, longitude: -118.4004 }, radius: 5 },
      { id: 'santa-monica', name: 'Santa Monica', metroAreaId: 'los-angeles', coordinates: { latitude: 34.0195, longitude: -118.4912 }, radius: 5 },
      { id: 'pasadena', name: 'Pasadena', metroAreaId: 'los-angeles', coordinates: { latitude: 34.1478, longitude: -118.1445 }, radius: 5 },
      { id: 'long-beach', name: 'Long Beach', metroAreaId: 'los-angeles', coordinates: { latitude: 33.7701, longitude: -118.1937 }, radius: 10 }
    ]
  },
  {
    id: 'chicago',
    name: 'Chicago',
    displayName: 'Chicago / Illinois',
    state: 'IL',
    coordinates: { latitude: 41.8781, longitude: -87.6298 },
    radius: 50,
    regions: [
      { id: 'chicago-city', name: 'Chicago', metroAreaId: 'chicago', coordinates: { latitude: 41.8781, longitude: -87.6298 }, radius: 20 },
      { id: 'cook-county', name: 'Cook County', metroAreaId: 'chicago', coordinates: { latitude: 41.8781, longitude: -87.6298 }, radius: 30 },
      { id: 'dupage', name: 'DuPage County', metroAreaId: 'chicago', coordinates: { latitude: 41.8081, longitude: -88.0881 }, radius: 15 },
      { id: 'kane', name: 'Kane County', metroAreaId: 'chicago', coordinates: { latitude: 41.9389, longitude: -88.4286 }, radius: 15 }
    ]
  },
  {
    id: 'dallas-fort-worth',
    name: 'Dallas - Fort Worth',
    displayName: 'Dallas - Fort Worth',
    state: 'TX',
    coordinates: { latitude: 32.7767, longitude: -96.7970 },
    radius: 50,
    regions: [
      { id: 'dallas', name: 'Dallas', metroAreaId: 'dallas-fort-worth', coordinates: { latitude: 32.7767, longitude: -96.7970 }, radius: 15 },
      { id: 'fort-worth', name: 'Fort Worth', metroAreaId: 'dallas-fort-worth', coordinates: { latitude: 32.7555, longitude: -97.3308 }, radius: 15 },
      { id: 'plano', name: 'Plano', metroAreaId: 'dallas-fort-worth', coordinates: { latitude: 33.0198, longitude: -96.6989 }, radius: 10 },
      { id: 'irving', name: 'Irving', metroAreaId: 'dallas-fort-worth', coordinates: { latitude: 32.8140, longitude: -96.9489 }, radius: 10 }
    ]
  },
  {
    id: 'washington-dc',
    name: 'Washington, D.C.',
    displayName: 'Washington, D.C. Area',
    state: 'DC',
    coordinates: { latitude: 38.9072, longitude: -77.0369 },
    radius: 50,
    regions: [
      { id: 'washington-dc', name: 'Washington, D.C.', metroAreaId: 'washington-dc', coordinates: { latitude: 38.9072, longitude: -77.0369 }, radius: 15 },
      { id: 'arlington', name: 'Arlington', metroAreaId: 'washington-dc', coordinates: { latitude: 38.8816, longitude: -77.0910 }, radius: 10 },
      { id: 'alexandria', name: 'Alexandria', metroAreaId: 'washington-dc', coordinates: { latitude: 38.8048, longitude: -77.0469 }, radius: 10 },
      { id: 'bethesda', name: 'Bethesda', metroAreaId: 'washington-dc', coordinates: { latitude: 38.9847, longitude: -77.0947 }, radius: 10 }
    ]
  },
  {
    id: 'miami',
    name: 'Miami',
    displayName: 'Miami - Dade',
    state: 'FL',
    coordinates: { latitude: 25.7617, longitude: -80.1918 },
    radius: 50,
    regions: [
      { id: 'miami', name: 'Miami', metroAreaId: 'miami', coordinates: { latitude: 25.7617, longitude: -80.1918 }, radius: 15 },
      { id: 'miami-beach', name: 'Miami Beach', metroAreaId: 'miami', coordinates: { latitude: 25.7907, longitude: -80.1300 }, radius: 5 },
      { id: 'coral-gables', name: 'Coral Gables', metroAreaId: 'miami', coordinates: { latitude: 25.7214, longitude: -80.2683 }, radius: 5 },
      { id: 'aventura', name: 'Aventura', metroAreaId: 'miami', coordinates: { latitude: 25.9565, longitude: -80.1390 }, radius: 5 }
    ]
  },
  {
    id: 'philadelphia',
    name: 'Philadelphia',
    displayName: 'Philadelphia County',
    state: 'PA',
    coordinates: { latitude: 39.9526, longitude: -75.1652 },
    radius: 50,
    regions: [
      { id: 'philadelphia', name: 'Philadelphia', metroAreaId: 'philadelphia', coordinates: { latitude: 39.9526, longitude: -75.1652 }, radius: 20 },
      { id: 'montgomery-pa', name: 'Montgomery County', metroAreaId: 'philadelphia', coordinates: { latitude: 40.1379, longitude: -75.3872 }, radius: 15 },
      { id: 'bucks', name: 'Bucks County', metroAreaId: 'philadelphia', coordinates: { latitude: 40.3368, longitude: -75.1299 }, radius: 15 }
    ]
  },
  {
    id: 'boston',
    name: 'Boston',
    displayName: 'Greater Boston',
    state: 'MA',
    coordinates: { latitude: 42.3601, longitude: -71.0589 },
    radius: 50,
    regions: [
      { id: 'boston', name: 'Boston', metroAreaId: 'boston', coordinates: { latitude: 42.3601, longitude: -71.0589 }, radius: 15 },
      { id: 'cambridge', name: 'Cambridge', metroAreaId: 'boston', coordinates: { latitude: 42.3736, longitude: -71.1097 }, radius: 5 },
      { id: 'somerville', name: 'Somerville', metroAreaId: 'boston', coordinates: { latitude: 42.3876, longitude: -71.0995 }, radius: 5 },
      { id: 'brookline', name: 'Brookline', metroAreaId: 'boston', coordinates: { latitude: 42.3317, longitude: -71.1212 }, radius: 5 }
    ]
  },
  {
    id: 'seattle',
    name: 'Seattle',
    displayName: 'Seattle / Eastern Washington',
    state: 'WA',
    coordinates: { latitude: 47.6062, longitude: -122.3321 },
    radius: 50,
    regions: [
      { id: 'seattle', name: 'Seattle', metroAreaId: 'seattle', coordinates: { latitude: 47.6062, longitude: -122.3321 }, radius: 15 },
      { id: 'bellevue', name: 'Bellevue', metroAreaId: 'seattle', coordinates: { latitude: 47.6101, longitude: -122.2015 }, radius: 10 },
      { id: 'redmond', name: 'Redmond', metroAreaId: 'seattle', coordinates: { latitude: 47.6740, longitude: -122.1215 }, radius: 10 },
      { id: 'kirkland', name: 'Kirkland', metroAreaId: 'seattle', coordinates: { latitude: 47.6769, longitude: -122.2059 }, radius: 10 }
    ]
  },
  {
    id: 'denver',
    name: 'Denver',
    displayName: 'Denver / Colorado',
    state: 'CO',
    coordinates: { latitude: 39.7392, longitude: -104.9903 },
    radius: 50,
    regions: [
      { id: 'denver', name: 'Denver', metroAreaId: 'denver', coordinates: { latitude: 39.7392, longitude: -104.9903 }, radius: 15 },
      { id: 'boulder', name: 'Boulder', metroAreaId: 'denver', coordinates: { latitude: 40.0150, longitude: -105.2705 }, radius: 10 },
      { id: 'aurora', name: 'Aurora', metroAreaId: 'denver', coordinates: { latitude: 39.7294, longitude: -104.8319 }, radius: 10 },
      { id: 'lakewood', name: 'Lakewood', metroAreaId: 'denver', coordinates: { latitude: 39.7047, longitude: -105.0814 }, radius: 10 }
    ]
  },
  {
    id: 'las-vegas',
    name: 'Las Vegas',
    displayName: 'Las Vegas',
    state: 'NV',
    coordinates: { latitude: 36.1699, longitude: -115.1398 },
    radius: 50,
    regions: [
      { id: 'las-vegas', name: 'Las Vegas', metroAreaId: 'las-vegas', coordinates: { latitude: 36.1699, longitude: -115.1398 }, radius: 20 },
      { id: 'henderson', name: 'Henderson', metroAreaId: 'las-vegas', coordinates: { latitude: 36.0395, longitude: -114.9817 }, radius: 10 },
      { id: 'north-las-vegas', name: 'North Las Vegas', metroAreaId: 'las-vegas', coordinates: { latitude: 36.1989, longitude: -115.1175 }, radius: 10 }
    ]
  },
  {
    id: 'san-francisco',
    name: 'San Francisco',
    displayName: 'San Francisco Bay Area',
    state: 'CA',
    coordinates: { latitude: 37.7749, longitude: -122.4194 },
    radius: 60,
    regions: [
      { id: 'san-francisco', name: 'San Francisco', metroAreaId: 'san-francisco', coordinates: { latitude: 37.7749, longitude: -122.4194 }, radius: 15 },
      { id: 'oakland', name: 'Oakland', metroAreaId: 'san-francisco', coordinates: { latitude: 37.8044, longitude: -122.2712 }, radius: 10 },
      { id: 'san-jose', name: 'San Jose', metroAreaId: 'san-francisco', coordinates: { latitude: 37.3382, longitude: -121.8863 }, radius: 15 },
      { id: 'palo-alto', name: 'Palo Alto', metroAreaId: 'san-francisco', coordinates: { latitude: 37.4419, longitude: -122.1430 }, radius: 5 }
    ]
  },
  {
    id: 'san-diego',
    name: 'San Diego',
    displayName: 'San Diego',
    state: 'CA',
    coordinates: { latitude: 32.7157, longitude: -117.1611 },
    radius: 50,
    regions: [
      { id: 'san-diego', name: 'San Diego', metroAreaId: 'san-diego', coordinates: { latitude: 32.7157, longitude: -117.1611 }, radius: 20 },
      { id: 'la-jolla', name: 'La Jolla', metroAreaId: 'san-diego', coordinates: { latitude: 32.8328, longitude: -117.2713 }, radius: 5 },
      { id: 'del-mar', name: 'Del Mar', metroAreaId: 'san-diego', coordinates: { latitude: 32.9595, longitude: -117.2653 }, radius: 5 }
    ]
  },
  {
    id: 'portland',
    name: 'Portland',
    displayName: 'Portland / Oregon',
    state: 'OR',
    coordinates: { latitude: 45.5152, longitude: -122.6784 },
    radius: 50,
    regions: [
      { id: 'portland', name: 'Portland', metroAreaId: 'portland', coordinates: { latitude: 45.5152, longitude: -122.6784 }, radius: 15 },
      { id: 'beaverton', name: 'Beaverton', metroAreaId: 'portland', coordinates: { latitude: 45.4871, longitude: -122.8037 }, radius: 10 },
      { id: 'hillsboro', name: 'Hillsboro', metroAreaId: 'portland', coordinates: { latitude: 45.5229, longitude: -122.9898 }, radius: 10 }
    ]
  },
  {
    id: 'connecticut',
    name: 'Connecticut',
    displayName: 'Connecticut',
    state: 'CT',
    coordinates: { latitude: 41.6032, longitude: -73.0877 },
    radius: 50,
    regions: [
      { id: 'hartford', name: 'Hartford', metroAreaId: 'connecticut', coordinates: { latitude: 41.7658, longitude: -72.6734 }, radius: 15 },
      { id: 'new-haven', name: 'New Haven', metroAreaId: 'connecticut', coordinates: { latitude: 41.3083, longitude: -72.9279 }, radius: 15 },
      { id: 'stamford', name: 'Stamford', metroAreaId: 'connecticut', coordinates: { latitude: 41.0534, longitude: -73.5387 }, radius: 10 }
    ]
  },
  {
    id: 'new-jersey',
    name: 'New Jersey',
    displayName: 'New Jersey',
    state: 'NJ',
    coordinates: { latitude: 40.2989, longitude: -74.5210 },
    radius: 50,
    regions: [
      { id: 'newark', name: 'Newark', metroAreaId: 'new-jersey', coordinates: { latitude: 40.7357, longitude: -74.1724 }, radius: 15 },
      { id: 'jersey-city', name: 'Jersey City', metroAreaId: 'new-jersey', coordinates: { latitude: 40.7178, longitude: -74.0431 }, radius: 10 },
      { id: 'paterson', name: 'Paterson', metroAreaId: 'new-jersey', coordinates: { latitude: 40.9168, longitude: -74.1718 }, radius: 10 }
    ]
  },
  {
    id: 'new-york-state',
    name: 'New York State',
    displayName: 'New York State',
    state: 'NY',
    coordinates: { latitude: 42.1657, longitude: -74.9481 },
    radius: 100,
    regions: [
      { id: 'albany', name: 'Albany', metroAreaId: 'new-york-state', coordinates: { latitude: 42.6526, longitude: -73.7562 }, radius: 20 },
      { id: 'buffalo', name: 'Buffalo', metroAreaId: 'new-york-state', coordinates: { latitude: 42.8864, longitude: -78.8784 }, radius: 20 },
      { id: 'rochester', name: 'Rochester', metroAreaId: 'new-york-state', coordinates: { latitude: 43.1566, longitude: -77.6088 }, radius: 20 }
    ]
  }
];

// Helper functions
export function getMetroAreaById(id: string): MetroArea | undefined {
  return metroAreas.find(metro => metro.id === id);
}

export function getRegionById(id: string): Region | undefined {
  for (const metro of metroAreas) {
    const region = metro.regions.find(r => r.id === id);
    if (region) return region;
  }
  return undefined;
}

export function getMetroAreaByRegionId(regionId: string): MetroArea | undefined {
  for (const metro of metroAreas) {
    if (metro.regions.some(r => r.id === regionId)) {
      return metro;
    }
  }
  return undefined;
}

export function getAllRegions(): Region[] {
  return metroAreas.flatMap(metro => metro.regions);
}

export function searchMetroAreas(query: string): MetroArea[] {
  const lowerQuery = query.toLowerCase();
  return metroAreas.filter(metro => 
    metro.name.toLowerCase().includes(lowerQuery) ||
    metro.displayName.toLowerCase().includes(lowerQuery) ||
    metro.state.toLowerCase().includes(lowerQuery)
  );
}

export function searchRegions(query: string): Region[] {
  const lowerQuery = query.toLowerCase();
  return getAllRegions().filter(region =>
    region.name.toLowerCase().includes(lowerQuery)
  );
}
