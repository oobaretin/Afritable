import express from 'express';
import { prisma } from '../db';
import { dataMonitoringService } from '../services/dataMonitoringService';
import { protect, authorize } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = express.Router();

// Get data quality overview
router.get('/overview', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const report = await dataMonitoringService.generateDataMonitoringReport();
    
    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
});

// Get data quality metrics for a specific restaurant
router.get('/restaurant/:id', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const metrics = await dataMonitoringService.assessRestaurantDataQuality(id);
    
    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    next(error);
  }
});

// Get restaurants needing attention
router.get('/restaurants/needing-attention', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    // Get restaurants with low quality scores
    const restaurants = await prisma.restaurant.findMany({
      where: {
        isActive: true,
        lastUpdated: {
          lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Updated more than 7 days ago
        }
      },
      include: {
        photos: true,
        reviews: true
      },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      orderBy: { lastUpdated: 'asc' }
    });

    // Assess quality for each restaurant
    const restaurantsWithQuality = await Promise.all(
      restaurants.map(async (restaurant) => {
        const metrics = await dataMonitoringService.assessRestaurantDataQuality(restaurant.id);
        return {
          ...restaurant,
          qualityMetrics: metrics
        };
      })
    );

    // Filter restaurants needing attention
    const needingAttention = restaurantsWithQuality.filter(
      r => r.qualityMetrics.overallScore < 0.7 || r.qualityMetrics.issues.length > 0
    );

    res.json({
      success: true,
      data: {
        restaurants: needingAttention,
        total: needingAttention.length,
        pagination: {
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
          hasMore: restaurants.length === parseInt(limit as string)
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get data quality statistics
router.get('/statistics', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const totalRestaurants = await prisma.restaurant.count({
      where: { isActive: true }
    });

    const verifiedRestaurants = await prisma.restaurant.count({
      where: { isActive: true, isVerified: true }
    });

    const restaurantsWithPhotos = await prisma.restaurant.count({
      where: {
        isActive: true,
        photos: {
          some: {}
        }
      }
    });

    const restaurantsWithCompleteInfo = await prisma.restaurant.count({
      where: {
        isActive: true,
        AND: [
          { phone: { not: null } },
          { website: { not: null } },
          { description: { not: null } },
          { cuisine: { not: '' } }
        ]
      }
    });

    const outdatedRestaurants = await prisma.restaurant.count({
      where: {
        isActive: true,
        lastUpdated: {
          lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Updated more than 30 days ago
        }
      }
    });

    const statistics = {
      totalRestaurants,
      verification: {
        verified: verifiedRestaurants,
        unverified: totalRestaurants - verifiedRestaurants,
        verificationRate: Math.round((verifiedRestaurants / totalRestaurants) * 100)
      },
      completeness: {
        withPhotos: restaurantsWithPhotos,
        withCompleteInfo: restaurantsWithCompleteInfo,
        photoRate: Math.round((restaurantsWithPhotos / totalRestaurants) * 100),
        completenessRate: Math.round((restaurantsWithCompleteInfo / totalRestaurants) * 100)
      },
      freshness: {
        outdated: outdatedRestaurants,
        fresh: totalRestaurants - outdatedRestaurants,
        freshnessRate: Math.round(((totalRestaurants - outdatedRestaurants) / totalRestaurants) * 100)
      }
    };

    res.json({
      success: true,
      data: statistics
    });
  } catch (error) {
    next(error);
  }
});

// Get data quality trends over time
router.get('/trends', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const daysAgo = new Date(Date.now() - parseInt(days as string) * 24 * 60 * 60 * 1000);

    // Get API usage data for trends
    const apiUsage = await prisma.apiUsage.findMany({
      where: {
        apiName: 'DATA_ENHANCEMENT',
        createdAt: {
          gte: daysAgo
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    // Process trends data
    const trends = {
      dataEnhancement: {
        totalRequests: apiUsage.reduce((sum, usage) => sum + usage.requests, 0),
        successfulRequests: apiUsage.reduce((sum, usage) => sum + usage.requests, 0), // Simplified for now
        failedRequests: 0, // Would need to track separately
        successRate: 0
      },
      dailyActivity: processDailyActivity(apiUsage)
    };

    if (trends.dataEnhancement.totalRequests > 0) {
      trends.dataEnhancement.successRate = Math.round(
        (trends.dataEnhancement.successfulRequests / trends.dataEnhancement.totalRequests) * 100
      );
    }

    res.json({
      success: true,
      data: trends
    });
  } catch (error) {
    next(error);
  }
});

// Trigger data enhancement for specific restaurant
router.post('/enhance/:id', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { options = {} } = req.body;

    // Import the enhancement service
    const { RestaurantDataEnhancementScript } = await import('../scripts/enhanceRestaurantData');
    
    const enhancementScript = new RestaurantDataEnhancementScript({
      restaurantId: id,
      ...options
    });

    // Run enhancement in background
    enhancementScript.run().catch(error => {
      logger.error(`Background enhancement failed for restaurant ${id}:`, error);
    });

    res.json({
      success: true,
      message: 'Data enhancement started for restaurant',
      data: { restaurantId: id }
    });
  } catch (error) {
    next(error);
  }
});

// Trigger bulk data enhancement
router.post('/enhance/bulk', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const { options = {} } = req.body;

    // Import the enhancement service
    const { RestaurantDataEnhancementScript } = await import('../scripts/enhanceRestaurantData');
    
    const enhancementScript = new RestaurantDataEnhancementScript(options);

    // Run enhancement in background
    enhancementScript.run().catch(error => {
      logger.error('Background bulk enhancement failed:', error);
    });

    res.json({
      success: true,
      message: 'Bulk data enhancement started',
      data: { options }
    });
  } catch (error) {
    next(error);
  }
});

// Get data quality issues summary
router.get('/issues', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const { severity, type } = req.query;

    // Get restaurants with quality issues
    const restaurants = await prisma.restaurant.findMany({
      where: { isActive: true },
      include: { photos: true }
    });

    const allIssues: any[] = [];
    
    for (const restaurant of restaurants) {
      const metrics = await dataMonitoringService.assessRestaurantDataQuality(restaurant.id);
      allIssues.push(...metrics.issues.map(issue => ({
        ...issue,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name
      })));
    }

    // Filter issues based on query parameters
    let filteredIssues = allIssues;
    
    if (severity) {
      filteredIssues = filteredIssues.filter(issue => issue.severity === severity);
    }
    
    if (type) {
      filteredIssues = filteredIssues.filter(issue => issue.type === type);
    }

    // Group issues by type and severity
    const issueSummary = groupIssuesByType(filteredIssues);

    res.json({
      success: true,
      data: {
        totalIssues: filteredIssues.length,
        issueSummary,
        issues: filteredIssues.slice(0, 100) // Limit to first 100 issues
      }
    });
  } catch (error) {
    next(error);
  }
});

// Helper methods
function processDailyActivity(apiUsage: any[]): any[] {
  const dailyActivity: { [key: string]: any } = {};

  apiUsage.forEach(usage => {
    const date = usage.createdAt.toISOString().split('T')[0];
    
    if (!dailyActivity[date]) {
      dailyActivity[date] = {
        date,
        requests: 0,
        successes: 0,
        failures: 0
      };
    }

    dailyActivity[date].requests += usage.requests;
    dailyActivity[date].successes += usage.requests; // Simplified for now
    dailyActivity[date].failures += 0; // Would need to track separately
  });

  return Object.values(dailyActivity).sort((a: any, b: any) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

function groupIssuesByType(issues: any[]): any {
  const grouped: { [key: string]: { [key: string]: number } } = {};

  issues.forEach(issue => {
    if (!grouped[issue.type]) {
      grouped[issue.type] = {};
    }
    
    if (!grouped[issue.type][issue.severity]) {
      grouped[issue.type][issue.severity] = 0;
    }
    
    grouped[issue.type][issue.severity]++;
  });

  return grouped;
}

export default router;
