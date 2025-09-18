# Afritable Data Enhancement System

## Overview

The Afritable Data Enhancement System is a comprehensive solution designed to improve the quality, accuracy, and completeness of restaurant data. It provides automated data collection, validation, and enhancement capabilities to ensure your restaurant database maintains high standards.

## 🎯 Key Features

### 1. Multi-Source Verification
- **Cross-reference data** across Google Places, Yelp, and Foursquare APIs
- **Majority voting** for conflicting information
- **Discrepancy detection** and resolution
- **Business status verification** (open/closed/temporarily closed)

### 2. Enhanced Data Collection
- **Web scraping** of restaurant websites for official information
- **Social media integration** for authentic photos and updates
- **Menu extraction** with detailed item information
- **Business hours validation** and standardization

### 3. Photo Enhancement
- **Multi-source photo collection** from all available APIs
- **Quality assessment** and filtering
- **Cultural context tagging** for African cuisine
- **Duplicate removal** and prioritization

### 4. Business Information Validation
- **Phone number verification** with automated validation
- **Address geocoding** for precise location accuracy
- **Website validation** and social media link verification
- **Business license checking** (where available)

### 5. Real-Time Data Monitoring
- **Automated quality scoring** for each restaurant
- **Issue detection** and flagging
- **Data freshness monitoring** with automated refresh
- **Performance metrics** and reporting

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Set Up Environment Variables
```bash
# Copy the example environment file
cp env.example .env

# Add your API keys
GOOGLE_PLACES_API_KEY="your-google-places-api-key"
YELP_API_KEY="your-yelp-api-key"
FOURSQUARE_API_KEY="your-foursquare-api-key"
```

### 3. Run Data Enhancement
```bash
# Enhance all restaurants
npm run enhance-data

# Enhance specific restaurant
npm run enhance-data -- --restaurant-id cmfotdsf5002f8x2w2x3vk1b6

# Enhance with custom options
npm run enhance-data -- --batch-size 5 --skip-existing
```

## 📊 Data Quality Metrics

### Quality Scoring System
Each restaurant receives a quality score (0-1) based on:

- **Completeness (25%)**: Required fields filled
- **Accuracy (25%)**: Validated contact information
- **Photo Quality (25%)**: High-quality, relevant photos
- **Verification (25%)**: Multi-source verification status

### Quality Thresholds
- **HIGH**: Score ≥ 0.8 (Verified)
- **MEDIUM**: Score 0.6-0.8 (Pending)
- **LOW**: Score < 0.6 (Flagged)

## 🔧 API Endpoints

### Data Quality Dashboard
```bash
# Get overview
GET /api/data-quality/overview

# Get restaurant-specific metrics
GET /api/data-quality/restaurant/:id

# Get restaurants needing attention
GET /api/data-quality/restaurants/needing-attention

# Get statistics
GET /api/data-quality/statistics

# Get trends
GET /api/data-quality/trends
```

### Enhancement Triggers
```bash
# Enhance specific restaurant
POST /api/data-quality/enhance/:id

# Bulk enhancement
POST /api/data-quality/enhance/bulk
```

## 🛠️ Configuration Options

### Enhancement Script Options
```bash
--restaurant-id <id>     # Enhance specific restaurant
--batch-size <number>    # Parallel processing limit (default: 10)
--skip-existing          # Skip recently updated restaurants
--force-update           # Force update all restaurants
--no-photos              # Skip photo enhancement
--no-scraping            # Skip web scraping
--no-validation          # Skip data validation
```

### Environment Variables
```bash
# API Configuration
GOOGLE_PLACES_API_KEY="your-key"
YELP_API_KEY="your-key"
FOURSQUARE_API_KEY="your-key"

# Rate Limiting
GOOGLE_PLACES_DAILY_LIMIT=1000
YELP_DAILY_LIMIT=5000
FOURSQUARE_DAILY_LIMIT=1000

# Enhancement Settings
COLLECTION_ENABLED=true
COLLECTION_INTERVAL_HOURS=24
```

## 📈 Monitoring and Reporting

### Automated Monitoring
- **Daily quality assessments** at 2 AM
- **Weekly outdated restaurant checks**
- **Real-time issue flagging**
- **Performance metrics tracking**

### Data Quality Dashboard
Access the admin dashboard at `/admin/data-quality` to view:
- Overall data quality metrics
- Restaurants needing attention
- Enhancement progress
- Issue summaries and trends

### Reports Generated
- **Daily quality reports** with metrics and recommendations
- **Weekly enhancement summaries** with success rates
- **Monthly trend analysis** with improvement suggestions

## 🔍 Data Sources Integration

### Google Places API
- **Restaurant details** and photos
- **Business hours** and contact information
- **Reviews and ratings**
- **Location accuracy** verification

### Yelp Fusion API
- **Business information** and photos
- **Menu data** and specialties
- **Customer reviews**
- **Price range** information

### Foursquare Places API
- **Venue details** and photos
- **Check-in data** and popularity
- **Category information**
- **Social media links**

### Web Scraping
- **Restaurant websites** for official information
- **Menu extraction** with detailed items
- **Social media links** and profiles
- **Business hours** and contact details

## 🎨 Photo Enhancement Features

### Multi-Source Collection
- **Google Places photos** (high quality, verified)
- **Yelp photos** (customer and business photos)
- **Foursquare photos** (venue and event photos)
- **Website photos** (official restaurant images)
- **Social media photos** (Instagram, Facebook)

### Quality Assessment
- **Resolution analysis** (minimum 800px width)
- **Clarity scoring** based on source reliability
- **Relevance filtering** for African cuisine context
- **Cultural significance** tagging

### Photo Classification
- **FOOD**: Dishes, meals, cuisine
- **INTERIOR**: Dining room, ambiance
- **EXTERIOR**: Building, storefront
- **MENU**: Menu boards, items
- **CHEF**: Kitchen, cooking
- **STAFF**: Service, team

## 🔄 Data Processing Pipeline

### 1. Data Collection
```
Restaurant → Multi-Source APIs → Raw Data
```

### 2. Validation & Verification
```
Raw Data → Cross-Reference → Discrepancy Detection → Resolution
```

### 3. Enhancement
```
Validated Data → Web Scraping → Photo Collection → Cultural Context
```

### 4. Quality Assessment
```
Enhanced Data → Quality Scoring → Issue Detection → Recommendations
```

### 5. Storage & Monitoring
```
Final Data → Database Update → Quality Metrics → Monitoring Dashboard
```

## 📋 Data Quality Issues

### Common Issues Detected
- **Missing Data**: Phone, website, description
- **Inaccurate Data**: Wrong phone numbers, addresses
- **Low Quality Photos**: Blurry, irrelevant images
- **Outdated Information**: Old hours, closed businesses
- **Duplicate Entries**: Same restaurant listed multiple times

### Automated Resolution
- **Phone validation** with format checking
- **Address geocoding** for accuracy
- **Website verification** with accessibility checks
- **Photo filtering** by quality and relevance
- **Duplicate detection** with fuzzy matching

## 🚨 Troubleshooting

### Common Issues

#### API Rate Limits
```bash
# Check API usage
GET /api/data-quality/statistics

# Adjust batch size
npm run enhance-data -- --batch-size 5
```

#### Low Quality Scores
```bash
# Check specific restaurant issues
GET /api/data-quality/restaurant/:id

# Force re-enhancement
npm run enhance-data -- --restaurant-id :id --force-update
```

#### Missing Photos
```bash
# Enable photo collection only
npm run enhance-data -- --no-scraping --no-validation
```

### Performance Optimization
- **Batch processing** to respect API limits
- **Caching** for repeated requests
- **Parallel processing** for multiple restaurants
- **Error handling** with retry logic

## 📚 Advanced Usage

### Custom Enhancement Scripts
```typescript
import { RestaurantDataEnhancementScript } from './src/scripts/enhanceRestaurantData';

const script = new RestaurantDataEnhancementScript({
  batchSize: 5,
  includePhotos: true,
  includeWebScraping: true,
  includeValidation: true
});

await script.run();
```

### Quality Metrics Integration
```typescript
import { dataMonitoringService } from './src/services/dataMonitoringService';

const metrics = await dataMonitoringService.assessRestaurantDataQuality(restaurantId);
console.log(`Quality Score: ${metrics.overallScore}`);
```

### Photo Enhancement
```typescript
import { photoEnhancementService } from './src/services/photoEnhancementService';

const photos = await photoEnhancementService.collectAllPhotos(restaurant);
console.log(`Collected ${photos.photos.length} photos`);
```

## 🎯 Best Practices

### 1. Regular Maintenance
- Run enhancement weekly for active restaurants
- Monitor quality scores daily
- Address flagged issues promptly

### 2. API Management
- Monitor API usage and limits
- Implement proper rate limiting
- Use caching for repeated requests

### 3. Data Validation
- Verify critical information manually
- Cross-check with multiple sources
- Maintain data quality standards

### 4. Performance Monitoring
- Track enhancement success rates
- Monitor processing times
- Optimize batch sizes for your API limits

## 📞 Support

For issues or questions about the data enhancement system:

1. Check the troubleshooting section above
2. Review the API logs for error details
3. Monitor the data quality dashboard
4. Contact the development team

## 🔮 Future Enhancements

### Planned Features
- **Machine learning** for cuisine classification
- **Image recognition** for automatic photo tagging
- **Sentiment analysis** for review processing
- **Real-time notifications** for data quality issues
- **Advanced analytics** for business insights

### Integration Opportunities
- **Instagram API** for authentic food photos
- **Facebook Graph API** for business information
- **TripAdvisor API** for additional reviews
- **Health department APIs** for compliance data

---

**Last Updated**: September 2024  
**Version**: 1.0.0  
**Maintainer**: Afritable Development Team
