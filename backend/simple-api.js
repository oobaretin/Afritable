const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Simple restaurants endpoint that works
app.get('/api/restaurants', async (req, res) => {
  try {
    const { limit = 20, page = 1, search, cuisine, city, state, minRating } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const where = {
      isActive: true,
      country: 'US'
    };
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { cuisine: { contains: search } },
        { city: { contains: search } }
      ];
    }
    
    if (cuisine) {
      where.cuisine = { contains: cuisine };
    }
    
    if (city) {
      where.city = { contains: city };
    }
    
    if (state) {
      where.state = { contains: state };
    }
    
    if (minRating) {
      where.rating = { gte: parseFloat(minRating) };
    }
    
    const [restaurants, total] = await Promise.all([
      prisma.restaurant.findMany({
        where,
        include: {
          photos: true,
          reviews: {
            select: {
              rating: true
            }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: {
          rating: 'desc'
        }
      }),
      prisma.restaurant.count({ where })
    ]);
    
    // Calculate average rating for each restaurant
    const restaurantsWithRating = restaurants.map(restaurant => {
      const avgRating = restaurant.reviews.length > 0 
        ? restaurant.reviews.reduce((sum, review) => sum + review.rating, 0) / restaurant.reviews.length
        : restaurant.rating || 0;
      
      return {
        ...restaurant,
        rating: avgRating,
        reviews: undefined // Remove reviews from response
      };
    });
    
    res.json({
      success: true,
      data: restaurantsWithRating,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit))
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Cuisines endpoint
app.get('/api/restaurants/cuisines/list', async (req, res) => {
  try {
    const cuisines = await prisma.restaurant.findMany({
      where: {
        isActive: true,
        country: 'US'
      },
      select: {
        cuisine: true
      },
      distinct: ['cuisine']
    });
    
    const cuisineList = cuisines.map(r => r.cuisine).filter(Boolean);
    
    res.json({
      success: true,
      data: cuisineList
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Simple API is working' });
});

const PORT = 3005;
app.listen(PORT, () => {
  console.log(`🚀 Simple API running on port ${PORT}`);
});
