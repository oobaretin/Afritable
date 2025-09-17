import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      Cookies.remove('token');
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    } else if (error.response?.status >= 500) {
      // Server error
      toast.error('Something went wrong. Please try again later.');
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  // Auth
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    me: '/auth/me',
    profile: '/auth/profile',
    changePassword: '/auth/change-password',
  },
  
  // Restaurants
  restaurants: {
    list: '/restaurants',
    detail: (id: string) => `/restaurants/${id}`,
    availability: (id: string) => `/restaurants/${id}/availability`,
    reviews: (id: string) => `/restaurants/${id}/reviews`,
    cuisines: '/restaurants/cuisines/list',
  },
  
  // Reservations
  reservations: {
    list: '/reservations',
    detail: (id: string) => `/reservations/${id}`,
    create: '/reservations',
    update: (id: string) => `/reservations/${id}`,
    cancel: (id: string) => `/reservations/${id}/cancel`,
    stats: '/reservations/stats',
  },
  
  // Users
  users: {
    profile: '/users/profile',
    favorites: '/users/favorites',
    reviews: '/users/reviews',
  },
  
  // Admin
  admin: {
    dashboard: '/admin/dashboard',
    restaurants: '/admin/restaurants',
    users: '/admin/users',
    collectData: '/admin/collect-data',
    apiUsage: '/admin/api-usage',
    health: '/admin/health',
  },
};

export default api;
