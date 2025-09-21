const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Simple test endpoint
app.get('/test', async (req, res) => {
  try {
    const count = await prisma.restaurant.count();
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Simple restaurants endpoint
app.get('/restaurants', async (req, res) => {
  try {
    const restaurants = await prisma.restaurant.findMany({
      where: {
        isActive: true,
        country: 'US'
      },
      select: {
        id: true,
        name: true,
        city: true,
        state: true,
        cuisine: true,
        photos: {
          select: {
            url: true
          }
        }
      },
      take: 5
    });
    
    res.json({ success: true, data: restaurants });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3004, () => {
  console.log('Test server running on port 3004');
});
