#!/bin/bash

echo "🍽️  Afritable Real Data Setup"
echo "=============================="

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating .env file from template..."
    cp backend/env.example backend/.env
    echo "✅ Created backend/.env file"
    echo ""
    echo "⚠️  IMPORTANT: You need to edit backend/.env and add your API keys:"
    echo "   - GOOGLE_PLACES_API_KEY"
    echo "   - YELP_API_KEY" 
    echo "   - FOURSQUARE_API_KEY"
    echo ""
    echo "📖 See API_SETUP_GUIDE.md for detailed instructions"
    echo ""
else
    echo "✅ .env file already exists"
fi

# Check if API keys are set
echo "🔍 Checking API key configuration..."

if grep -q "your-google-places-api-key" backend/.env; then
    echo "❌ Google Places API key not configured"
    GOOGLE_MISSING=true
else
    echo "✅ Google Places API key configured"
fi

if grep -q "your-yelp-fusion-api-key" backend/.env; then
    echo "❌ Yelp API key not configured"
    YELP_MISSING=true
else
    echo "✅ Yelp API key configured"
fi

if grep -q "your-foursquare-api-key" backend/.env; then
    echo "❌ Foursquare API key not configured"
    FOURSQUARE_MISSING=true
else
    echo "✅ Foursquare API key configured"
fi

echo ""

if [ "$GOOGLE_MISSING" = true ] || [ "$YELP_MISSING" = true ] || [ "$FOURSQUARE_MISSING" = true ]; then
    echo "⚠️  Some API keys are missing. Please:"
    echo "   1. Get API keys from the services (see API_SETUP_GUIDE.md)"
    echo "   2. Edit backend/.env and add your keys"
    echo "   3. Run this script again"
    echo ""
    echo "🚀 Once configured, you can:"
    echo "   - Test APIs: cd backend && npm run test-apis"
    echo "   - Collect data: cd backend && npm run collect-data"
    exit 1
fi

echo "🎉 All API keys configured!"
echo ""
echo "🚀 Next steps:"
echo "   1. Test your API keys:"
echo "      cd backend && npm run test-apis"
echo ""
echo "   2. Collect real restaurant data:"
echo "      cd backend && npm run collect-data"
echo ""
echo "   3. Start the application:"
echo "      npm run dev"
echo ""
echo "📊 Expected results:"
echo "   - 100-500+ restaurants per metro area"
echo "   - Real photos, ratings, and contact info"
echo "   - African cuisine from 5 major US cities"
