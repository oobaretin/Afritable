export interface Reservation {
  id: string;
  userId: string;
  restaurantId: string;
  date: string;
  timeSlot: string;
  partySize: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
  specialRequests?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  restaurant?: {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    phone?: string;
    photos?: Array<{
      id: string;
      url: string;
      isPrimary: boolean;
    }>;
  };
}

export interface CreateReservationData {
  restaurantId: string;
  date: string;
  timeSlot: string;
  partySize: number;
  specialRequests?: string;
  notes?: string;
}

export interface ReservationFilters {
  status?: string;
  page?: number;
  limit?: number;
}

export interface ReservationStats {
  total: number;
  upcoming: number;
  byStatus: Record<string, number>;
}
