import express from 'express';
import Joi from 'joi';
import { prisma } from '../db';
import { protect, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import { getMetroAreaById, getRegionById } from '../data/metroAreas';

const router = express.Router();

// @desc    Get all restaurants with filters
// @route   GET /api/restaurants
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      cuisine,
      city,
      state,
      priceRange,
      rating,
      sortBy = 'rating',
      sortOrder = 'desc',
      latitude,
      longitude,
      radius = 25, // miles
      metroArea,
      region,
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {
      isActive: true,
    };

    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { description: { contains: search as string } },
        { cuisine: { contains: search as string } },
      ];
    }

    if (cuisine) {
      where.cuisine = { contains: cuisine as string };
    }

    if (city) {
      where.city = { contains: city as string };
    }

    if (state) {
      where.state = { contains: state as string };
    }

    if (priceRange) {
      where.priceRange = priceRange as string;
    }

    if (rating) {
      where.rating = { gte: parseFloat(rating as string) };
    }

    // Metro area filtering
    if (metroArea) {
      const metroAreaData = getMetroAreaById(metroArea as string);
      if (metroAreaData) {
        where.OR = [
          { city: { contains: metroAreaData.name } },
          { state: metroAreaData.state },
          {
            AND: [
              { latitude: { gte: metroAreaData.coordinates.latitude - 0.5 } },
              { latitude: { lte: metroAreaData.coordinates.latitude + 0.5 } },
              { longitude: { gte: metroAreaData.coordinates.longitude - 0.5 } },
              { longitude: { lte: metroAreaData.coordinates.longitude + 0.5 } }
            ]
          }
        ];
      }
    }

    // Region filtering
    if (region) {
      const regionData = getRegionById(region as string);
      if (regionData) {
        where.OR = [
          { city: { contains: regionData.name } },
          {
            AND: [
              { latitude: { gte: regionData.coordinates.latitude - 0.2 } },
              { latitude: { lte: regionData.coordinates.latitude + 0.2 } },
              { longitude: { gte: regionData.coordinates.longitude - 0.2 } },
              { longitude: { lte: regionData.coordinates.longitude + 0.2 } }
            ]
          }
        ];
      }
    }

    // Location-based filtering
    if (latitude && longitude) {
      const lat = parseFloat(latitude as string);
      const lng = parseFloat(longitude as string);
      const radiusKm = parseFloat(radius as string) * 1.60934; // Convert miles to km

      // Simple bounding box filter (for better performance)
      const latRange = radiusKm / 111; // Approximate km per degree latitude
      const lngRange = radiusKm / (111 * Math.cos(lat * Math.PI / 180));

      where.latitude = { gte: lat - latRange, lte: lat + latRange };
      where.longitude = { gte: lng - lngRange, lte: lng + lngRange };
    }

    // Build orderBy clause
    let orderBy: any = {};
    if (sortBy === 'rating') {
      orderBy.rating = sortOrder as string;
    } else if (sortBy === 'name') {
      orderBy.name = sortOrder as string;
    } else if (sortBy === 'reviewCount') {
      orderBy.reviewCount = sortOrder as string;
    } else if (sortBy === 'distance' && latitude && longitude) {
      // For distance sorting, we'll need to calculate it in the application
      orderBy.rating = 'desc'; // Fallback to rating
    } else {
      orderBy.rating = 'desc';
    }

    const [restaurants, total] = await Promise.all([
      prisma.restaurant.findMany({
        where,
        include: {
          photos: {
            where: { isPrimary: true },
            take: 1,
          },
          _count: {
            select: { reviews: true },
          },
        },
        orderBy,
        skip,
        take: limitNum,
      }),
      prisma.restaurant.count({ where }),
    ]);

    // Calculate distance if coordinates provided
    if (latitude && longitude) {
      const lat = parseFloat(latitude as string);
      const lng = parseFloat(longitude as string);

      restaurants.forEach((restaurant) => {
        const distance = calculateDistance(
          lat,
          lng,
          restaurant.latitude,
          restaurant.longitude
        );
        (restaurant as any).distance = distance;
      });

      // Sort by distance if requested
      if (sortBy === 'distance') {
        restaurants.sort((a, b) => {
          const distanceA = (a as any).distance;
          const distanceB = (b as any).distance;
          return sortOrder === 'asc' ? distanceA - distanceB : distanceB - distanceA;
        });
      }
    }

    res.json({
      success: true,
      data: restaurants,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single restaurant
// @route   GET /api/restaurants/:id
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: req.params.id },
      include: {
        photos: true,
        menus: {
          where: { isAvailable: true },
          orderBy: { category: 'asc' },
        },
        reviews: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: { reviews: true },
        },
      },
    });

    if (!restaurant || !restaurant.isActive) {
      return next(new AppError('Restaurant not found', 404));
    }

    res.json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get restaurant availability
// @route   GET /api/restaurants/:id/availability
// @access  Public
router.get('/:id/availability', async (req, res, next) => {
  try {
    const { date, partySize = 2 } = req.query;

    if (!date) {
      return next(new AppError('Date is required', 400));
    }

    const targetDate = new Date(date as string);
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const availability = await prisma.availability.findMany({
      where: {
        restaurantId: req.params.id,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        maxPartySize: {
          gte: parseInt(partySize as string),
        },
        availableSlots: {
          gt: 0,
        },
      },
      orderBy: { timeSlot: 'asc' },
    });

    res.json({
      success: true,
      data: availability,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get restaurant reviews
// @route   GET /api/restaurants/:id/reviews
// @access  Public
router.get('/:id/reviews', async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { restaurantId: req.params.id },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.review.count({
        where: { restaurantId: req.params.id },
      }),
    ]);

    res.json({
      success: true,
      data: reviews,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create restaurant review
// @route   POST /api/restaurants/:id/reviews
// @access  Private
router.post('/:id/reviews', protect, async (req: AuthRequest, res, next) => {
  try {
    const reviewSchema = Joi.object({
      rating: Joi.number().min(1).max(5).required(),
      title: Joi.string().max(100).optional(),
      comment: Joi.string().max(1000).optional(),
    });

    const { error, value } = reviewSchema.validate(req.body);
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }

    const { rating, title, comment } = value;

    // Check if restaurant exists
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: req.params.id },
    });

    if (!restaurant) {
      return next(new AppError('Restaurant not found', 404));
    }

    // Check if user already reviewed this restaurant
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_restaurantId: {
          userId: req.user!.id,
          restaurantId: req.params.id,
        },
      },
    });

    if (existingReview) {
      return next(new AppError('You have already reviewed this restaurant', 400));
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        userId: req.user!.id,
        restaurantId: req.params.id,
        rating,
        title,
        comment,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Update restaurant rating
    await updateRestaurantRating(req.params.id);

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get cuisine types
// @route   GET /api/restaurants/cuisines/list
// @access  Public
router.get('/cuisines/list', async (req, res, next) => {
  try {
    const cuisines = await prisma.restaurant.findMany({
      select: { cuisine: true },
      where: { isActive: true },
    });

    const allCuisines = cuisines.flatMap(r => r.cuisine.split(','));
    const uniqueCuisines = [...new Set(allCuisines)].sort();

    res.json({
      success: true,
      data: uniqueCuisines,
    });
  } catch (error) {
    next(error);
  }
});

// Helper function to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Helper function to update restaurant rating
async function updateRestaurantRating(restaurantId: string): Promise<void> {
  const reviews = await prisma.review.findMany({
    where: { restaurantId },
    select: { rating: true },
  });

  if (reviews.length > 0) {
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    
    await prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
        reviewCount: reviews.length,
      },
    });
  }
}

// Add new restaurant
router.post('/', async (req, res, next) => {
  try {
    const {
      name,
      description,
      cuisine,
      address,
      city,
      state,
      zipCode,
      phone,
      website,
      email,
      priceRange,
      acceptsReservations,
      hasDelivery,
      hasTakeout,
      hasOutdoorSeating,
      hasWifi,
      hasParking,
      isWheelchairAccessible,
    } = req.body;

    // Validate required fields
    if (!name || !cuisine || !address || !city || !state) {
      return res.status(400).json({
        success: false,
        message: 'Name, cuisine, address, city, and state are required'
      });
    }

    // Create restaurant
    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        description: description || null,
        cuisine,
        address,
        city,
        state,
        zipCode: zipCode || null,
        phone: phone || null,
        website: website || null,
        email: email || null,
        priceRange: priceRange || 'MODERATE',
        rating: 0,
        reviewCount: 0,
        acceptsReservations: acceptsReservations || false,
        hasDelivery: hasDelivery || false,
        hasTakeout: hasTakeout || false,
        hasOutdoorSeating: hasOutdoorSeating || false,
        hasWifi: hasWifi || false,
        hasParking: hasParking || false,
        isWheelchairAccessible: isWheelchairAccessible || false,
        dataSource: 'MANUAL',
        isActive: true,
        isVerified: false,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Restaurant added successfully',
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
});

export default router;
