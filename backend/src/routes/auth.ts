import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import { prisma } from '../index';
import { protect } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = express.Router();

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  phone: Joi.string().optional(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Generate JWT token
const generateToken = (id: string) => {
  const secret = process.env.JWT_SECRET || 'fallback-secret-key';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ id }, secret, { expiresIn } as jwt.SignOptions);
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }

    const { email, firstName, lastName, phone, password } = value;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return next(new AppError('User already exists with this email', 400));
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        phone,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }

    const { email, password } = value;

    // Check for user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      return next(new AppError('Invalid credentials', 401));
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new AppError('Invalid credentials', 401));
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req: AuthRequest, res, next) => {
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
      },
    });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, async (req: AuthRequest, res, next) => {
  try {
    const updateSchema = Joi.object({
      firstName: Joi.string().min(2).max(50),
      lastName: Joi.string().min(2).max(50),
      phone: Joi.string(),
    });

    const { error, value } = updateSchema.validate(req.body);
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: value,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        updatedAt: true,
      },
    });

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
router.put('/change-password', protect, async (req: AuthRequest, res, next) => {
  try {
    const changePasswordSchema = Joi.object({
      currentPassword: Joi.string().required(),
      newPassword: Joi.string().min(6).required(),
    });

    const { error, value } = changePasswordSchema.validate(req.body);
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }

    const { currentPassword, newPassword } = value;

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
    });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return next(new AppError('Current password is incorrect', 400));
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { password: hashedPassword },
    });

    res.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
