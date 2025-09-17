export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  cuisine: string[];
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  email?: string;
  priceRange: 'BUDGET' | 'MODERATE' | 'EXPENSIVE' | 'VERY_EXPENSIVE';
  rating: number;
  reviewCount: number;
  acceptsReservations: boolean;
  hasDelivery: boolean;
  hasTakeout: boolean;
  hasOutdoorSeating: boolean;
  hasWifi: boolean;
  hasParking: boolean;
  isWheelchairAccessible: boolean;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  photos?: Photo[];
  menus?: Menu[];
  reviews?: Review[];
  _count?: {
    reviews: number;
    reservations: number;
    photos: number;
  };
  distance?: number;
}

export interface Photo {
  id: string;
  restaurantId: string;
  url: string;
  caption?: string;
  isPrimary: boolean;
  createdAt: string;
}

export interface Menu {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  price?: number;
  category: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  userId: string;
  restaurantId: string;
  rating: number;
  title?: string;
  comment?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    firstName: string;
    lastName: string;
  };
}

export interface Availability {
  id: string;
  restaurantId: string;
  date: string;
  timeSlot: string;
  maxPartySize: number;
  availableSlots: number;
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantFilters {
  search?: string;
  cuisine?: string;
  city?: string;
  state?: string;
  priceRange?: string;
  rating?: number;
  sortBy?: 'rating' | 'name' | 'reviewCount' | 'distance';
  sortOrder?: 'asc' | 'desc';
  latitude?: number;
  longitude?: number;
  radius?: number;
  page?: number;
  limit?: number;
}

export interface RestaurantSearchParams {
  page?: string;
  limit?: string;
  search?: string;
  cuisine?: string;
  city?: string;
  state?: string;
  priceRange?: string;
  rating?: string;
  sortBy?: string;
  sortOrder?: string;
  lat?: string;
  lng?: string;
  radius?: string;
}
