# Afritable API Documentation

This document provides comprehensive documentation for the Afritable REST API.

## Base URL

- **Development**: `http://localhost:3001/api`
- **Production**: `https://your-domain.com/api`

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message",
  "stack": "..." // Only in development
}
```

## Authentication Endpoints

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "role": "CUSTOMER",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CUSTOMER",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "role": "CUSTOMER",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update Profile
```http
PUT /auth/profile
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

### Change Password
```http
PUT /auth/change-password
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

## Restaurant Endpoints

### List Restaurants
```http
GET /restaurants
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `search` (string): Search term
- `cuisine` (string): Cuisine type filter
- `city` (string): City filter
- `state` (string): State filter
- `priceRange` (string): Price range filter (BUDGET, MODERATE, EXPENSIVE, VERY_EXPENSIVE)
- `rating` (number): Minimum rating filter
- `sortBy` (string): Sort field (rating, name, reviewCount, distance)
- `sortOrder` (string): Sort order (asc, desc)
- `latitude` (number): User latitude for distance calculation
- `longitude` (number): User longitude for distance calculation
- `radius` (number): Search radius in miles (default: 25)

**Example:**
```http
GET /restaurants?search=ethiopian&city=houston&rating=4&sortBy=rating&sortOrder=desc
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "restaurant-id",
      "name": "Addis Ababa Restaurant",
      "description": "Authentic Ethiopian cuisine",
      "cuisine": ["Ethiopian", "African"],
      "address": "123 Main St",
      "city": "Houston",
      "state": "TX",
      "zipCode": "77001",
      "latitude": 29.7604,
      "longitude": -95.3698,
      "phone": "(713) 555-0123",
      "website": "https://example.com",
      "priceRange": "MODERATE",
      "rating": 4.5,
      "reviewCount": 127,
      "acceptsReservations": true,
      "hasDelivery": true,
      "hasTakeout": true,
      "hasOutdoorSeating": false,
      "hasWifi": true,
      "hasParking": true,
      "isWheelchairAccessible": true,
      "isActive": true,
      "isVerified": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "photos": [
        {
          "id": "photo-id",
          "url": "https://example.com/photo.jpg",
          "isPrimary": true
        }
      ],
      "_count": {
        "reviews": 127,
        "reservations": 45,
        "photos": 8
      },
      "distance": 2.3
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

### Get Restaurant Details
```http
GET /restaurants/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "restaurant-id",
    "name": "Addis Ababa Restaurant",
    "description": "Authentic Ethiopian cuisine with traditional injera and flavorful stews.",
    "cuisine": ["Ethiopian", "African"],
    "address": "123 Main St",
    "city": "Houston",
    "state": "TX",
    "zipCode": "77001",
    "latitude": 29.7604,
    "longitude": -95.3698,
    "phone": "(713) 555-0123",
    "website": "https://example.com",
    "email": "info@example.com",
    "priceRange": "MODERATE",
    "rating": 4.5,
    "reviewCount": 127,
    "acceptsReservations": true,
    "hasDelivery": true,
    "hasTakeout": true,
    "hasOutdoorSeating": false,
    "hasWifi": true,
    "hasParking": true,
    "isWheelchairAccessible": true,
    "isActive": true,
    "isVerified": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "photos": [
      {
        "id": "photo-id",
        "url": "https://example.com/photo.jpg",
        "caption": "Restaurant exterior",
        "isPrimary": true,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "menus": [
      {
        "id": "menu-id",
        "name": "Signature Dish",
        "description": "Our most popular traditional dish",
        "price": 18.99,
        "category": "Main Course",
        "isAvailable": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "reviews": [
      {
        "id": "review-id",
        "rating": 5,
        "title": "Amazing food!",
        "comment": "The injera was perfect and the stews were flavorful.",
        "isVerified": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "user": {
          "firstName": "John",
          "lastName": "Doe"
        }
      }
    ],
    "_count": {
      "reviews": 127
    }
  }
}
```

### Get Restaurant Availability
```http
GET /restaurants/:id/availability
```

**Query Parameters:**
- `date` (string): Date in YYYY-MM-DD format (required)
- `partySize` (number): Number of people (default: 2)

**Example:**
```http
GET /restaurants/restaurant-id/availability?date=2024-01-15&partySize=4
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "availability-id",
      "restaurantId": "restaurant-id",
      "date": "2024-01-15T00:00:00.000Z",
      "timeSlot": "18:00",
      "maxPartySize": 8,
      "availableSlots": 3,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "availability-id-2",
      "restaurantId": "restaurant-id",
      "date": "2024-01-15T00:00:00.000Z",
      "timeSlot": "18:30",
      "maxPartySize": 8,
      "availableSlots": 2,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Restaurant Reviews
```http
GET /restaurants/:id/reviews
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "review-id",
      "userId": "user-id",
      "restaurantId": "restaurant-id",
      "rating": 5,
      "title": "Amazing food!",
      "comment": "The injera was perfect and the stews were flavorful.",
      "isVerified": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "user": {
        "firstName": "John",
        "lastName": "Doe"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 127,
    "pages": 13
  }
}
```

### Create Restaurant Review
```http
POST /restaurants/:id/reviews
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "rating": 5,
  "title": "Amazing food!",
  "comment": "The injera was perfect and the stews were flavorful."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "review-id",
    "userId": "user-id",
    "restaurantId": "restaurant-id",
    "rating": 5,
    "title": "Amazing food!",
    "comment": "The injera was perfect and the stews were flavorful.",
    "isVerified": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "user": {
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

### Get Cuisine Types
```http
GET /restaurants/cuisines/list
```

**Response:**
```json
{
  "success": true,
  "data": [
    "Ethiopian",
    "Nigerian",
    "Moroccan",
    "West African",
    "East African",
    "Somali",
    "Sudanese"
  ]
}
```

## Reservation Endpoints

### List User Reservations
```http
GET /reservations
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `status` (string): Filter by status (PENDING, CONFIRMED, CANCELLED, COMPLETED, NO_SHOW)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "reservation-id",
      "userId": "user-id",
      "restaurantId": "restaurant-id",
      "date": "2024-01-15T00:00:00.000Z",
      "timeSlot": "19:00",
      "partySize": 4,
      "status": "CONFIRMED",
      "specialRequests": "Table by the window",
      "notes": "Anniversary dinner",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "restaurant": {
        "id": "restaurant-id",
        "name": "Addis Ababa Restaurant",
        "address": "123 Main St",
        "city": "Houston",
        "state": "TX",
        "phone": "(713) 555-0123",
        "photos": [
          {
            "id": "photo-id",
            "url": "https://example.com/photo.jpg",
            "isPrimary": true
          }
        ]
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### Get Reservation Details
```http
GET /reservations/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "reservation-id",
    "userId": "user-id",
    "restaurantId": "restaurant-id",
    "date": "2024-01-15T00:00:00.000Z",
    "timeSlot": "19:00",
    "partySize": 4,
    "status": "CONFIRMED",
    "specialRequests": "Table by the window",
    "notes": "Anniversary dinner",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "restaurant": {
      "id": "restaurant-id",
      "name": "Addis Ababa Restaurant",
      "address": "123 Main St",
      "city": "Houston",
      "state": "TX",
      "phone": "(713) 555-0123",
      "photos": [
        {
          "id": "photo-id",
          "url": "https://example.com/photo.jpg",
          "isPrimary": true
        }
      ]
    }
  }
}
```

### Create Reservation
```http
POST /reservations
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "restaurantId": "restaurant-id",
  "date": "2024-01-15",
  "timeSlot": "19:00",
  "partySize": 4,
  "specialRequests": "Table by the window",
  "notes": "Anniversary dinner"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "reservation-id",
    "userId": "user-id",
    "restaurantId": "restaurant-id",
    "date": "2024-01-15T00:00:00.000Z",
    "timeSlot": "19:00",
    "partySize": 4,
    "status": "PENDING",
    "specialRequests": "Table by the window",
    "notes": "Anniversary dinner",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "restaurant": {
      "id": "restaurant-id",
      "name": "Addis Ababa Restaurant",
      "address": "123 Main St",
      "city": "Houston",
      "state": "TX",
      "phone": "(713) 555-0123"
    }
  }
}
```

### Update Reservation
```http
PUT /reservations/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "date": "2024-01-16",
  "timeSlot": "20:00",
  "partySize": 6,
  "specialRequests": "Updated request"
}
```

### Cancel Reservation
```http
PUT /reservations/:id/cancel
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "reservation-id",
    "userId": "user-id",
    "restaurantId": "restaurant-id",
    "date": "2024-01-15T00:00:00.000Z",
    "timeSlot": "19:00",
    "partySize": 4,
    "status": "CANCELLED",
    "specialRequests": "Table by the window",
    "notes": "Anniversary dinner",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "restaurant": {
      "id": "restaurant-id",
      "name": "Addis Ababa Restaurant",
      "address": "123 Main St",
      "city": "Houston",
      "state": "TX",
      "phone": "(713) 555-0123"
    }
  }
}
```

### Get Reservation Statistics
```http
GET /reservations/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 25,
    "upcoming": 3,
    "byStatus": {
      "PENDING": 1,
      "CONFIRMED": 2,
      "CANCELLED": 5,
      "COMPLETED": 15,
      "NO_SHOW": 2
    }
  }
}
```

## User Endpoints

### Get User Profile
```http
GET /users/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "role": "CUSTOMER",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "_count": {
      "reservations": 25,
      "reviews": 8
    }
  }
}
```

### Get User Favorites
```http
GET /users/favorites
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)

### Get User Reviews
```http
GET /users/reviews
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)

## Admin Endpoints

All admin endpoints require admin role authentication.

### Get Dashboard Statistics
```http
GET /admin/dashboard
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalRestaurants": 500,
      "totalUsers": 1250,
      "totalReservations": 5000,
      "totalReviews": 2500
    },
    "recentRestaurants": [
      {
        "id": "restaurant-id",
        "name": "New Restaurant",
        "city": "Houston",
        "state": "TX",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "recentUsers": [
      {
        "id": "user-id",
        "email": "newuser@example.com",
        "firstName": "New",
        "lastName": "User",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "apiUsage": {
      "2024-01-01": {
        "google": 150,
        "yelp": 300,
        "foursquare": 100
      }
    }
  }
}
```

### List All Restaurants (Admin)
```http
GET /admin/restaurants
Authorization: Bearer <admin-token>
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `search` (string): Search term
- `city` (string): City filter
- `state` (string): State filter
- `isActive` (boolean): Active status filter
- `isVerified` (boolean): Verified status filter
- `dataSource` (string): Data source filter

### Update Restaurant Status
```http
PUT /admin/restaurants/:id/status
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "isActive": true,
  "isVerified": true
}
```

### List All Users (Admin)
```http
GET /admin/users
Authorization: Bearer <admin-token>
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `search` (string): Search term
- `role` (string): User role filter
- `isActive` (boolean): Active status filter

### Update User Status
```http
PUT /admin/users/:id/status
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "isActive": true
}
```

### Trigger Data Collection
```http
POST /admin/collect-data
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Restaurant data collection started"
}
```

### Get API Usage Statistics
```http
GET /admin/api-usage
Authorization: Bearer <admin-token>
```

**Query Parameters:**
- `days` (number): Number of days to retrieve (default: 7)

**Response:**
```json
{
  "success": true,
  "data": {
    "google": {
      "2024-01-01": 150,
      "2024-01-02": 200
    },
    "yelp": {
      "2024-01-01": 300,
      "2024-01-02": 250
    },
    "foursquare": {
      "2024-01-01": 100,
      "2024-01-02": 120
    }
  }
}
```

### Get System Health
```http
GET /admin/health
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "database": "connected",
    "stats": {
      "restaurants": 500,
      "users": 1250
    },
    "uptime": 86400,
    "memory": {
      "rss": 123456789,
      "heapTotal": 98765432,
      "heapUsed": 87654321,
      "external": 1234567
    }
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation error |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

## Rate Limiting

- **API Endpoints**: 100 requests per 15 minutes per IP
- **Authentication**: 10 requests per 15 minutes per IP
- **Data Collection**: Respects individual API limits

## Webhooks

Webhooks are not currently implemented but planned for future releases.

## SDKs

Official SDKs are not currently available but planned for future releases.

## Support

For API support:
- Check the error messages in responses
- Verify authentication tokens
- Ensure proper request formatting
- Contact support for additional help
