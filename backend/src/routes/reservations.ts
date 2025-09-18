import express from 'express';
import Joi from 'joi';
import { prisma } from '../db';
import { protect, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = express.Router();

// @desc    Get user's reservations
// @route   GET /api/reservations
// @access  Private
router.get('/', protect, async (req: AuthRequest, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      userId: req.user!.id,
    };

    if (status) {
      where.status = status as string;
    }

    const [reservations, total] = await Promise.all([
      prisma.reservation.findMany({
        where,
        include: {
          restaurant: {
            select: {
              id: true,
              name: true,
              address: true,
              city: true,
              state: true,
              phone: true,
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
      prisma.reservation.count({ where }),
    ]);

    res.json({
      success: true,
      data: reservations,
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

// @desc    Get single reservation
// @route   GET /api/reservations/:id
// @access  Private
router.get('/:id', protect, async (req: AuthRequest, res, next) => {
  try {
    const reservation = await prisma.reservation.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
      include: {
        restaurant: {
          include: {
            photos: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
      },
    });

    if (!reservation) {
      return next(new AppError('Reservation not found', 404));
    }

    res.json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create new reservation
// @route   POST /api/reservations
// @access  Private
router.post('/', protect, async (req: AuthRequest, res, next) => {
  try {
    const reservationSchema = Joi.object({
      restaurantId: Joi.string().required(),
      date: Joi.date().min('now').required(),
      timeSlot: Joi.string().required(),
      partySize: Joi.number().min(1).max(20).required(),
      specialRequests: Joi.string().max(500).optional(),
      notes: Joi.string().max(500).optional(),
    });

    const { error, value } = reservationSchema.validate(req.body);
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }

    const { restaurantId, date, timeSlot, partySize, specialRequests, notes } = value;

    // Check if restaurant exists and accepts reservations
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant || !restaurant.isActive) {
      return next(new AppError('Restaurant not found', 404));
    }

    if (!restaurant.acceptsReservations) {
      return next(new AppError('This restaurant does not accept reservations', 400));
    }

    // Check availability
    const targetDate = new Date(date);
    const availability = await prisma.availability.findFirst({
      where: {
        restaurantId,
        date: targetDate,
        timeSlot,
        maxPartySize: { gte: partySize },
        availableSlots: { gt: 0 },
      },
    });

    if (!availability) {
      return next(new AppError('No availability for the selected time slot', 400));
    }

    // Create reservation
    const reservation = await prisma.reservation.create({
      data: {
        userId: req.user!.id,
        restaurantId,
        date: targetDate,
        timeSlot,
        partySize,
        specialRequests,
        notes,
        status: 'PENDING',
      },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            state: true,
            phone: true,
          },
        },
      },
    });

    // Update availability
    await prisma.availability.update({
      where: { id: availability.id },
      data: {
        availableSlots: { decrement: 1 },
      },
    });

    logger.info(`New reservation created: ${reservation.id} for ${restaurant.name}`);

    res.status(201).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update reservation
// @route   PUT /api/reservations/:id
// @access  Private
router.put('/:id', protect, async (req: AuthRequest, res, next) => {
  try {
    const updateSchema = Joi.object({
      date: Joi.date().min('now').optional(),
      timeSlot: Joi.string().optional(),
      partySize: Joi.number().min(1).max(20).optional(),
      specialRequests: Joi.string().max(500).optional(),
      notes: Joi.string().max(500).optional(),
    });

    const { error, value } = updateSchema.validate(req.body);
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }

    // Check if reservation exists and belongs to user
    const existingReservation = await prisma.reservation.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
    });

    if (!existingReservation) {
      return next(new AppError('Reservation not found', 404));
    }

    if (existingReservation.status === 'CANCELLED' || existingReservation.status === 'COMPLETED') {
      return next(new AppError('Cannot update cancelled or completed reservation', 400));
    }

    // If changing date/time, check new availability
    if (value.date || value.timeSlot) {
      const newDate = value.date ? new Date(value.date) : existingReservation.date;
      const newTimeSlot = value.timeSlot || existingReservation.timeSlot;
      const newPartySize = value.partySize || existingReservation.partySize;

      const availability = await prisma.availability.findFirst({
        where: {
          restaurantId: existingReservation.restaurantId,
          date: newDate,
          timeSlot: newTimeSlot,
          maxPartySize: { gte: newPartySize },
          availableSlots: { gt: 0 },
        },
      });

      if (!availability) {
        return next(new AppError('No availability for the selected time slot', 400));
      }
    }

    // Update reservation
    const reservation = await prisma.reservation.update({
      where: { id: req.params.id },
      data: value,
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            state: true,
            phone: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Cancel reservation
// @route   PUT /api/reservations/:id/cancel
// @access  Private
router.put('/:id/cancel', protect, async (req: AuthRequest, res, next) => {
  try {
    // Check if reservation exists and belongs to user
    const reservation = await prisma.reservation.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
    });

    if (!reservation) {
      return next(new AppError('Reservation not found', 404));
    }

    if (reservation.status === 'CANCELLED') {
      return next(new AppError('Reservation is already cancelled', 400));
    }

    if (reservation.status === 'COMPLETED') {
      return next(new AppError('Cannot cancel completed reservation', 400));
    }

    // Update reservation status
    const updatedReservation = await prisma.reservation.update({
      where: { id: req.params.id },
      data: { status: 'CANCELLED' },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            state: true,
            phone: true,
          },
        },
      },
    });

    // Restore availability slot
    const availability = await prisma.availability.findFirst({
      where: {
        restaurantId: reservation.restaurantId,
        date: reservation.date,
        timeSlot: reservation.timeSlot,
      },
    });

    if (availability) {
      await prisma.availability.update({
        where: { id: availability.id },
        data: {
          availableSlots: { increment: 1 },
        },
      });
    }

    logger.info(`Reservation cancelled: ${reservation.id}`);

    res.json({
      success: true,
      data: updatedReservation,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get reservation statistics
// @route   GET /api/reservations/stats
// @access  Private
router.get('/stats', protect, async (req: AuthRequest, res, next) => {
  try {
    const stats = await prisma.reservation.groupBy({
      by: ['status'],
      where: { userId: req.user!.id },
      _count: { status: true },
    });

    const totalReservations = await prisma.reservation.count({
      where: { userId: req.user!.id },
    });

    const upcomingReservations = await prisma.reservation.count({
      where: {
        userId: req.user!.id,
        date: { gte: new Date() },
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    });

    res.json({
      success: true,
      data: {
        total: totalReservations,
        upcoming: upcomingReservations,
        byStatus: stats.reduce((acc: any, stat: any) => {
          acc[stat.status] = stat._count.status;
          return acc;
        }, {} as Record<string, number>),
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
