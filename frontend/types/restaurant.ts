export interface Photo {
  id: string;
  url: string;
  caption?: string;
  isPrimary: boolean;
}

export interface Restaurant {
  id: string;
  name: string; 
  description: string;
  cuisine: string;
  city: string;
  state: string;
  rating: number;
  reviewCount: number;
  photos?: Photo[];
  priceRange: string;
  address: string;
  phone?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  acceptsReservations?: boolean;
  hasDelivery?: boolean;
  hasTakeout?: boolean;
  hasOutdoorSeating?: boolean;
  hasWifi?: boolean;
  hasParking?: boolean;
  isWheelchairAccessible?: boolean;
}
