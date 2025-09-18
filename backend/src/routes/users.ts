import express from 'express';
import { prisma } from '../db';
import { protect, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            reservations: true,
            reviews: true,
          },
        },
      },
    });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get user's favorite restaurants
// @route   GET /api/users/favorites
// @access  Private
router.get('/favorites', protect, async (req: AuthRequest, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // For now, we'll return restaurants the user has reviewed positively
    // In a full implementation, you'd have a separate favorites table
    const favorites = await prisma.restaurant.findMany({
      where: {
        reviews: {
          some: {
            userId: req.user!.id,
            rating: { gte: 4 },
          },
        },
        isActive: true,
      },
      include: {
        photos: {
          where: { isPrimary: true },
          take: 1,
        },
        _count: {
          select: { reviews: true },
        },
      },
      orderBy: { rating: 'desc' },
      skip,
      take: limitNum,
    });

    const total = await prisma.restaurant.count({
      where: {
        reviews: {
          some: {
            userId: req.user!.id,
            rating: { gte: 4 },
          },
        },
        isActive: true,
      },
    });

    res.json({
      success: true,
      data: favorites,
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

// @desc    Get user's review history
// @route   GET /api/users/reviews
// @access  Private
router.get('/reviews', protect, async (req: AuthRequest, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { userId: req.user!.id },
        include: {
          restaurant: {
            select: {
              id: true,
              name: true,
              address: true,
              city: true,
              state: true,
              photos: {
                where: { isPrimary: true },
                take: 1,
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.review.count({
        where: { userId: req.user!.id },
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

export default router;
