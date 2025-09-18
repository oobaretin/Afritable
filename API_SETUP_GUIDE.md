# API Setup Guide for Real Restaurant Data

## Overview
To collect real African restaurant data, you need API keys from three services:
1. **Google Places API** - For restaurant details and photos
2. **Yelp Fusion API** - For business information and reviews
3. **Foursquare Places API** - For additional venue data

## Step 1: Get API Keys

### Google Places API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the "Places API" and "Places API (New)"
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy your API key

### Yelp Fusion API
1. Go to [Yelp for Developers](https://www.yelp.com/developers)
2. Sign up for a developer account
3. Create a new app
4. Copy your API key from the app dashboard

### Foursquare Places API
1. Go to [Foursquare Developer](https://developer.foursquare.com/)
2. Sign up for a developer account
3. Create a new project
4. Get your API key from the project settings

## Step 2: Configure Environment Variables

1. Copy the example environment file:
```bash
cd backend
cp env.example .env
```

2. Edit the `.env` file and add your API keys:
```env
# API Keys
GOOGLE_PLACES_API_KEY="your-actual-google-places-api-key"
YELP_API_KEY="your-actual-yelp-fusion-api-key"
FOURSQUARE_API_KEY="your-actual-foursquare-api-key"

# Database (update for your setup)
DATABASE_URL="file:./dev.db"

# JWT Secret (generate a secure random string)
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# App Configuration
NODE_ENV="development"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

## Step 3: Run Data Collection

1. Make sure your backend is running:
```bash
cd backend
npm run dev
```

2. In a new terminal, run the data collection script:
```bash
cd backend
npm run collect-data
```

This will:
- Search for African restaurants in 5 major metro areas (Houston, NYC, DC, Atlanta, LA)
- Collect data from all three APIs
- Deduplicate restaurants
- Save to your SQLite database
- Add restaurant photos

## Step 4: Verify Data Collection

Check that restaurants were added:
```bash
# Check total restaurant count
curl http://localhost:3001/api/restaurants

# Check specific cuisine
curl "http://localhost:3001/api/restaurants?cuisine=Ethiopian"
```

## Expected Results

The script should collect:
- **100-500+ restaurants** per metro area
- **Restaurant details**: name, address, phone, website, rating
- **Photos**: from Google Places and other sources
- **Cuisine types**: Ethiopian, Nigerian, Moroccan, West African, etc.

## Troubleshooting

### API Rate Limits
- Google Places: 1000 requests/day (free tier)
- Yelp: 500 requests/day (free tier)
- Foursquare: 1000 requests/day (free tier)

The script includes delays to respect rate limits.

### Common Issues
1. **Invalid API Key**: Check that your keys are correct in `.env`
2. **Rate Limit Exceeded**: Wait 24 hours or upgrade your API plan
3. **Database Errors**: Make sure SQLite database is accessible

### Manual Data Collection
If you want to collect data for specific cities or cuisines, you can modify the `metroAreas` and `africanCuisineTerms` arrays in `src/services/restaurantDataCollection.ts`.

## Cost Considerations

### Free Tiers
- **Google Places**: $200 free credit (≈ 40,000 requests)
- **Yelp**: 500 requests/day free
- **Foursquare**: 1000 requests/day free

### Estimated Costs for Full Collection
- **Google Places**: $5-10 for complete data collection
- **Yelp**: Free (within daily limits)
- **Foursquare**: Free (within daily limits)

## Next Steps

After collecting data:
1. Run the seeding script to add sample photos and reviews
2. Test the frontend to see real restaurant data
3. Set up automated data collection with cron jobs
4. Consider upgrading API plans for production use
