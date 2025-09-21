import express from 'express';
import { prisma } from '../db';
import { logger } from '../utils/logger';
import { 
  metroAreas, 
  getMetroAreaById, 
  getRegionById, 
  getMetroAreaByRegionId,
  getAllRegions,
  searchMetroAreas,
  searchRegions,
  MetroArea,
  Region
} from '../data/metroAreas';

const router = express.Router();

// Get all metro areas
router.get('/metro-areas', async (req, res, next) => {
  try {
    const { search } = req.query;
    
    let results = metroAreas;
    
    if (search) {
      results = searchMetroAreas(search as string);
    }

    // Add restaurant counts for each metro area
    const metroAreasWithCounts = await Promise.all(
      results.map(async (metro) => {
        const restaurantCount = await prisma.restaurant.count({
          where: {
            isActive: true,
            OR: [
              { city: { contains: metro.name } },
              { state: metro.state }
            ]
          }
        });

        return {
          ...metro,
          restaurantCount
        };
      })
    );

    // Group metro areas by region
    const groupedMetroAreas = {
      'United States': metroAreasWithCounts.filter(metro => 
        ['GA', 'TX', 'NY', 'CA', 'FL', 'IL', 'PA', 'OH', 'NC', 'MI', 'NJ', 'VA', 'WA', 'AZ', 'MA', 'TN', 'IN', 'MO', 'MD', 'WI', 'CO', 'MN', 'SC', 'AL', 'LA', 'KY', 'OR', 'OK', 'CT', 'UT', 'IA', 'NV', 'AR', 'MS', 'KS', 'NM', 'NE', 'WV', 'ID', 'HI', 'NH', 'ME', 'RI', 'MT', 'DE', 'SD', 'ND', 'AK', 'VT', 'WY', 'DC'].includes(metro.state)
      ),
      'Canada': metroAreasWithCounts.filter(metro => 
        ['ON', 'BC', 'AB', 'QC', 'MB', 'SK', 'NS', 'NB', 'NL', 'PE', 'YT', 'NT', 'NU'].includes(metro.state)
      ),
      'Europe': metroAreasWithCounts.filter(metro => 
        metro.name.includes('London') || metro.name.includes('Paris') || metro.name.includes('Berlin') || metro.name.includes('Amsterdam')
      ),
      'Africa': metroAreasWithCounts.filter(metro => 
        metro.name.includes('Lagos') || metro.name.includes('Cairo') || metro.name.includes('Nairobi') || metro.name.includes('Accra')
      ),
      'Caribbean': metroAreasWithCounts.filter(metro => 
        metro.name.includes('Jamaica') || metro.name.includes('Barbados') || metro.name.includes('Trinidad')
      )
    };

    return res.json({
      success: true,
      data: groupedMetroAreas
    });
  } catch (error) {
    return next(error);
  }
});

// Get specific metro area
router.get('/metro-areas/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const metroArea = getMetroAreaById(id);

    if (!metroArea) {
      return res.status(404).json({
        success: false,
        message: 'Metro area not found'
      });
    }

    // Add restaurant counts for regions
    const regionsWithCounts = await Promise.all(
      metroArea.regions.map(async (region) => {
        const restaurantCount = await prisma.restaurant.count({
          where: {
            isActive: true,
            OR: [
              { city: { contains: region.name } },
              { 
                AND: [
                  { latitude: { gte: region.coordinates.latitude - 0.1 } },
                  { latitude: { lte: region.coordinates.latitude + 0.1 } },
                  { longitude: { gte: region.coordinates.longitude - 0.1 } },
                  { longitude: { lte: region.coordinates.longitude + 0.1 } }
                ]
              }
            ]
          }
        });

        return {
          ...region,
          restaurantCount
        };
      })
    );

    const metroAreaWithCounts = {
      ...metroArea,
      regions: regionsWithCounts,
      totalRestaurantCount: regionsWithCounts.reduce((sum, region) => sum + region.restaurantCount, 0)
    };

    return res.json({
      success: true,
      data: metroAreaWithCounts
    });
  } catch (error) {
    return next(error);
  }
});

// Get regions for a specific metro area
router.get('/metro-areas/:metroAreaId/regions', async (req, res, next) => {
  try {
    const { metroAreaId } = req.params;
    const metroArea = getMetroAreaById(metroAreaId);

    if (!metroArea) {
      return res.status(404).json({
        success: false,
        message: 'Metro area not found'
      });
    }

    // Add restaurant counts for regions
    const regionsWithCounts = await Promise.all(
      metroArea.regions.map(async (region) => {
        const restaurantCount = await prisma.restaurant.count({
          where: {
            isActive: true,
            AND: [
              { latitude: { gte: region.coordinates.latitude - 0.2 } },
              { latitude: { lte: region.coordinates.latitude + 0.2 } },
              { longitude: { gte: region.coordinates.longitude - 0.2 } },
              { longitude: { lte: region.coordinates.longitude + 0.2 } }
            ]
          }
        });

        return {
          ...region,
          restaurantCount
        };
      })
    );

    return res.json({
      success: true,
      data: regionsWithCounts
    });
  } catch (error) {
    return next(error);
  }
});

// Get all regions
router.get('/regions', async (req, res, next) => {
  try {
    const { metroAreaId, search } = req.query;
    
    let regions = getAllRegions();
    
    if (metroAreaId) {
      regions = regions.filter(region => region.metroAreaId === metroAreaId);
    }
    
    if (search) {
      regions = searchRegions(search as string);
    }

    // Add restaurant counts
    const regionsWithCounts = await Promise.all(
      regions.map(async (region) => {
        const restaurantCount = await prisma.restaurant.count({
          where: {
            isActive: true,
            OR: [
              { city: { contains: region.name } },
              { 
                AND: [
                  { latitude: { gte: region.coordinates.latitude - 0.1 } },
                  { latitude: { lte: region.coordinates.latitude + 0.1 } },
                  { longitude: { gte: region.coordinates.longitude - 0.1 } },
                  { longitude: { lte: region.coordinates.longitude + 0.1 } }
                ]
              }
            ]
          }
        });

        return {
          ...region,
          restaurantCount
        };
      })
    );

    return res.json({
      success: true,
      data: regionsWithCounts
    });
  } catch (error) {
    return next(error);
  }
});

// Get specific region
router.get('/regions/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const region = getRegionById(id);

    if (!region) {
      return res.status(404).json({
        success: false,
        message: 'Region not found'
      });
    }

    const metroArea = getMetroAreaByRegionId(id);
    const restaurantCount = await prisma.restaurant.count({
      where: {
        isActive: true,
        OR: [
          { city: { contains: region.name } },
          { 
            AND: [
              { latitude: { gte: region.coordinates.latitude - 0.1 } },
              { latitude: { lte: region.coordinates.latitude + 0.1 } },
              { longitude: { gte: region.coordinates.longitude - 0.1 } },
              { longitude: { lte: region.coordinates.longitude + 0.1 } }
            ]
          }
        ]
      }
    });

    const regionWithCount = {
      ...region,
      restaurantCount,
      metroArea: metroArea ? {
        id: metroArea.id,
        name: metroArea.name,
        displayName: metroArea.displayName,
        state: metroArea.state
      } : null
    };

    return res.json({
      success: true,
      data: regionWithCount
    });
  } catch (error) {
    return next(error);
  }
});

// Search locations (metro areas and regions)
router.get('/search', async (req, res, next) => {
  try {
    const { q: query } = req.query;

    if (!query || query.toString().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters'
      });
    }

    const searchTerm = query.toString().toLowerCase();
    
    // Search metro areas
    const matchingMetroAreas = metroAreas.filter(metro =>
      metro.name.toLowerCase().includes(searchTerm) ||
      metro.displayName.toLowerCase().includes(searchTerm) ||
      metro.state.toLowerCase().includes(searchTerm)
    );

    // Search regions
    const matchingRegions = getAllRegions().filter(region =>
      region.name.toLowerCase().includes(searchTerm)
    );

    // Add restaurant counts
    const metroAreasWithCounts = await Promise.all(
      matchingMetroAreas.map(async (metro) => {
        const restaurantCount = await prisma.restaurant.count({
          where: {
            isActive: true,
            OR: [
              { city: { contains: metro.name } },
              { state: metro.state }
            ]
          }
        });

        return {
          ...metro,
          restaurantCount,
          type: 'metro'
        };
      })
    );

    const regionsWithCounts = await Promise.all(
      matchingRegions.map(async (region) => {
        const restaurantCount = await prisma.restaurant.count({
          where: {
            isActive: true,
            OR: [
              { city: { contains: region.name } },
              { 
                AND: [
                  { latitude: { gte: region.coordinates.latitude - 0.1 } },
                  { latitude: { lte: region.coordinates.latitude + 0.1 } },
                  { longitude: { gte: region.coordinates.longitude - 0.1 } },
                  { longitude: { lte: region.coordinates.longitude + 0.1 } }
                ]
              }
            ]
          }
        });

        const metroArea = getMetroAreaByRegionId(region.id);

        return {
          ...region,
          restaurantCount,
          metroArea: metroArea ? {
            id: metroArea.id,
            name: metroArea.name,
            displayName: metroArea.displayName
          } : null,
          type: 'region'
        };
      })
    );

    // Combine and sort results
    const allResults = [...metroAreasWithCounts, ...regionsWithCounts]
      .sort((a, b) => b.restaurantCount - a.restaurantCount);

    return res.json({
      success: true,
      data: {
        query: searchTerm,
        results: allResults,
        total: allResults.length,
        metroAreas: metroAreasWithCounts.length,
        regions: regionsWithCounts.length
      }
    });
  } catch (error) {
    return next(error);
  }
});

// Get popular locations (metro areas with most restaurants)
router.get('/popular', async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    // Get restaurant counts for all metro areas
    const metroAreasWithCounts = await Promise.all(
      metroAreas.map(async (metro) => {
        const restaurantCount = await prisma.restaurant.count({
          where: {
            isActive: true,
            OR: [
              { city: { contains: metro.name } },
              { state: metro.state }
            ]
          }
        });

        return {
          ...metro,
          restaurantCount
        };
      })
    );

    // Sort by restaurant count and limit results
    const popularMetroAreas = metroAreasWithCounts
      .filter(metro => metro.restaurantCount > 0)
      .sort((a, b) => b.restaurantCount - a.restaurantCount)
      .slice(0, parseInt(limit as string));

    return res.json({
      success: true,
      data: popularMetroAreas
    });
  } catch (error) {
    return next(error);
  }
});

// Get location statistics
router.get('/stats', async (req, res, next) => {
  try {
    const totalRestaurants = await prisma.restaurant.count({
      where: { isActive: true }
    });

    const metroAreasWithCounts = await Promise.all(
      metroAreas.map(async (metro) => {
        const restaurantCount = await prisma.restaurant.count({
          where: {
            isActive: true,
            OR: [
              { city: { contains: metro.name } },
              { state: metro.state }
            ]
          }
        });

        return {
          id: metro.id,
          name: metro.displayName,
          restaurantCount
        };
      })
    );

    const activeMetroAreas = metroAreasWithCounts.filter(metro => metro.restaurantCount > 0);
    const totalRegions = getAllRegions().length;

    const stats = {
      totalMetroAreas: metroAreas.length,
      activeMetroAreas: activeMetroAreas.length,
      totalRegions,
      totalRestaurants,
      averageRestaurantsPerMetro: Math.round(totalRestaurants / activeMetroAreas.length),
      topMetroAreas: metroAreasWithCounts
        .sort((a, b) => b.restaurantCount - a.restaurantCount)
        .slice(0, 5)
    };

    return res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
