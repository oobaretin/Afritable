import express from 'express';
import Joi from 'joi';
import { prisma } from '../index';
import { protect, authorize } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { restaurantDataCollection } from '../services/restaurantDataCollection';
import { logger } from '../utils/logger';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('ADMIN'));

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
router.get('/dashboard', async (req, res, next) => {
  try {
    const [
      totalRestaurants,
      totalUsers,
      totalReservations,
      totalReviews,
      recentRestaurants,
      recentUsers,
      apiUsage,
    ] = await Promise.all([
      prisma.restaurant.count({ where: { isActive: true } }),
      prisma.user.count({ where: { isActive: true } }),
      prisma.reservation.count(),
      prisma.review.count(),
      prisma.restaurant.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          city: true,
          state: true,
          createdAt: true,
        },
      }),
      prisma.user.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
        },
      }),
      prisma.apiUsage.findMany({
        where: {
          date: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
        orderBy: { date: 'desc' },
      }),
    ]);

    // Calculate API usage by day
    const apiUsageByDay = apiUsage.reduce((acc, usage) => {
      const date = usage.date.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = {};
      }
      if (!acc[date][usage.apiName]) {
        acc[date][usage.apiName] = 0;
      }
      acc[date][usage.apiName] += usage.requests;
      return acc;
    }, {} as Record<string, Record<string, number>>);

    res.json({
      success: true,
      data: {
        stats: {
          totalRestaurants,
          totalUsers,
          totalReservations,
          totalReviews,
        },
        recentRestaurants,
        recentUsers,
        apiUsage: apiUsageByDay,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get all restaurants with admin details
// @route   GET /api/admin/restaurants
// @access  Private/Admin
router.get('/restaurants', async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      city,
      state,
      isActive,
      isVerified,
      dataSource,
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { address: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    if (city) {
      where.city = { contains: city as string, mode: 'insensitive' };
    }

    if (state) {
      where.state = { contains: state as string, mode: 'insensitive' };
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    if (isVerified !== undefined) {
      where.isVerified = isVerified === 'true';
    }

    if (dataSource) {
      where.dataSource = dataSource as string;
    }

    const [restaurants, total] = await Promise.all([
      prisma.restaurant.findMany({
        where,
        include: {
          _count: {
            select: {
              reservations: true,
              reviews: true,
              photos: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.restaurant.count({ where }),
    ]);

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

// @desc    Update restaurant status
// @route   PUT /api/admin/restaurants/:id/status
// @access  Private/Admin
router.put('/restaurants/:id/status', async (req, res, next) => {
  try {
    const statusSchema = Joi.object({
      isActive: Joi.boolean().optional(),
      isVerified: Joi.boolean().optional(),
    });

    const { error, value } = statusSchema.validate(req.body);
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: req.params.id },
    });

    if (!restaurant) {
      return next(new AppError('Restaurant not found', 404));
    }

    const updatedRestaurant = await prisma.restaurant.update({
      where: { id: req.params.id },
      data: value,
    });

    res.json({
      success: true,
      data: updatedRestaurant,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      role,
      isActive,
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (search) {
      where.OR = [
        { email: { contains: search as string, mode: 'insensitive' } },
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role as string;
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true,
          _count: {
            select: {
              reservations: true,
              reviews: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      success: true,
      data: users,
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

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
router.put('/users/:id/status', async (req, res, next) => {
  try {
    const statusSchema = Joi.object({
      isActive: Joi.boolean().required(),
    });

    const { error, value } = statusSchema.validate(req.body);
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }

    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
    });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: value,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });

    res.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Trigger restaurant data collection
// @route   POST /api/admin/collect-data
// @access  Private/Admin
router.post('/collect-data', async (req, res, next) => {
  try {
    // Run data collection in background
    restaurantDataCollection.collectRestaurantData()
      .then(() => {
        logger.info('Restaurant data collection completed successfully');
      })
      .catch((error) => {
        logger.error('Restaurant data collection failed:', error);
      });

    res.json({
      success: true,
      message: 'Restaurant data collection started',
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get API usage statistics
// @route   GET /api/admin/api-usage
// @access  Private/Admin
router.get('/api-usage', async (req, res, next) => {
  try {
    const { days = 7 } = req.query;
    const daysNum = parseInt(days as string);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysNum);

    const apiUsage = await prisma.apiUsage.findMany({
      where: {
        date: { gte: startDate },
      },
      orderBy: { date: 'desc' },
    });

    // Group by API and date
    const usageByApi = apiUsage.reduce((acc, usage) => {
      if (!acc[usage.apiName]) {
        acc[usage.apiName] = {};
      }
      const date = usage.date.toISOString().split('T')[0];
      acc[usage.apiName][date] = (acc[usage.apiName][date] || 0) + usage.requests;
      return acc;
    }, {} as Record<string, Record<string, number>>);

    res.json({
      success: true,
      data: usageByApi,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get system health
// @route   GET /api/admin/health
// @access  Private/Admin
router.get('/health', async (req, res, next) => {
  try {
    const [
      dbConnection,
      totalRestaurants,
      totalUsers,
      recentErrors,
    ] = await Promise.all([
      prisma.$queryRaw`SELECT 1 as test`,
      prisma.restaurant.count(),
      prisma.user.count(),
      // In a real implementation, you'd query error logs
      Promise.resolve([]),
    ]);

    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: dbConnection ? 'connected' : 'disconnected',
      stats: {
        restaurants: totalRestaurants,
        users: totalUsers,
      },
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };

    res.json({
      success: true,
      data: health,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });
  }
});

export default router;
