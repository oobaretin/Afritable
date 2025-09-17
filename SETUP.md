# Afritable Setup Guide

This guide will walk you through setting up Afritable on your local machine for development.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** and npm
- **PostgreSQL 15+** (or use Docker)
- **Git**
- **Docker and Docker Compose** (optional, for containerized setup)

## Quick Setup (Docker - Recommended)

The easiest way to get started is using Docker:

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Afritable1
```

### 2. Start All Services
```bash
docker-compose up -d
```

This will start:
- PostgreSQL database
- Redis cache
- Backend API server
- Frontend application
- Nginx reverse proxy

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Database**: localhost:5432

The database will be automatically seeded with sample data.

## Manual Setup (Development)

If you prefer to run the services locally:

### 1. Clone and Install Dependencies
```bash
git clone <repository-url>
cd Afritable1
npm run install:all
```

### 2. Set Up PostgreSQL

#### Option A: Local PostgreSQL
```bash
# Install PostgreSQL (macOS with Homebrew)
brew install postgresql
brew services start postgresql

# Create database
createdb afritable

# Create user (optional)
psql -d afritable -c "CREATE USER afritable_user WITH PASSWORD 'afritable_password';"
psql -d afritable -c "GRANT ALL PRIVILEGES ON DATABASE afritable TO afritable_user;"
```

#### Option B: Docker PostgreSQL Only
```bash
docker run --name afritable-postgres \
  -e POSTGRES_DB=afritable \
  -e POSTGRES_USER=afritable_user \
  -e POSTGRES_PASSWORD=afritable_password \
  -p 5432:5432 \
  -d postgres:15-alpine
```

### 3. Configure Environment Variables

#### Backend Configuration
```bash
cp backend/env.example backend/.env
```

Edit `backend/.env`:
```env
# Database
DATABASE_URL="postgresql://afritable_user:afritable_password@localhost:5432/afritable"

# JWT (generate a secure secret)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# API Keys (get these from respective services)
GOOGLE_PLACES_API_KEY="your-google-places-api-key"
YELP_API_KEY="your-yelp-fusion-api-key"
FOURSQUARE_API_KEY="your-foursquare-api-key"

# Email (optional for development)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# App Configuration
NODE_ENV="development"
PORT=3001
FRONTEND_URL="http://localhost:3000"

# Rate Limiting
GOOGLE_PLACES_DAILY_LIMIT=1000
YELP_DAILY_LIMIT=5000
FOURSQUARE_DAILY_LIMIT=1000

# Data Collection
COLLECTION_ENABLED=true
COLLECTION_INTERVAL_HOURS=24
```

#### Frontend Configuration
```bash
cp frontend/env.local.example frontend/.env.local
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=Afritable
NEXT_PUBLIC_APP_DESCRIPTION=Restaurant reservation platform for African restaurants
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
```

### 4. Set Up the Database

```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Seed with sample data
npm run db:seed
```

### 5. Start Development Servers

```bash
# Start both backend and frontend
npm run dev

# Or start individually:
# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend
```

## API Keys Setup

### Google Places API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the Places API
4. Create credentials (API Key)
5. Restrict the key to your domain/IP for security

### Yelp Fusion API
1. Visit [Yelp Developers](https://www.yelp.com/developers)
2. Create a new app
3. Get your API key from the app dashboard

### Foursquare Places API
1. Go to [Foursquare Developers](https://developer.foursquare.com/)
2. Create a new project
3. Get your API key from the project settings

### Google Maps API (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps JavaScript API
3. Create credentials (API Key)
4. Add to frontend environment variables

## Verification

### 1. Check Backend Health
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

### 2. Check Frontend
Visit http://localhost:3000 - you should see the Afritable homepage.

### 3. Test API Endpoints
```bash
# Get restaurants
curl http://localhost:3001/api/restaurants

# Register a user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User",
    "password": "password123"
  }'
```

## Data Collection

To start collecting restaurant data:

```bash
# Run data collection manually
cd backend
npm run collect-data

# Or trigger via API (requires admin user)
curl -X POST http://localhost:3001/api/admin/collect-data \
  -H "Authorization: Bearer <admin-jwt-token>"
```

## Troubleshooting

### Common Issues

#### Database Connection Error
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Check connection
psql -h localhost -U afritable_user -d afritable
```

#### Port Already in Use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

#### Prisma Issues
```bash
# Reset Prisma client
cd backend
npx prisma generate
npx prisma db push
```

#### Node Modules Issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# For all packages
npm run install:all
```

### Logs

#### Backend Logs
```bash
# View logs
tail -f backend/logs/combined.log
tail -f backend/logs/error.log
```

#### Docker Logs
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

## Development Workflow

### 1. Database Changes
```bash
# After modifying schema.prisma
cd backend
npx prisma db push
npx prisma generate
```

### 2. Adding New Dependencies
```bash
# Backend
cd backend
npm install <package-name>

# Frontend
cd frontend
npm install <package-name>
```

### 3. Code Quality
```bash
# Backend linting
cd backend
npm run lint
npm run lint:fix

# Frontend linting
cd frontend
npm run lint
```

## Production Deployment

### Environment Variables
Ensure all production environment variables are set:
- Strong JWT secrets
- Production database URLs
- API keys with proper restrictions
- SMTP configuration for emails

### Security Checklist
- [ ] Change default JWT secret
- [ ] Use HTTPS in production
- [ ] Restrict API keys to production domains
- [ ] Enable database SSL
- [ ] Set up proper CORS origins
- [ ] Configure rate limiting
- [ ] Set up monitoring and logging

### Performance Optimization
- [ ] Enable database connection pooling
- [ ] Set up Redis for caching
- [ ] Configure CDN for static assets
- [ ] Enable gzip compression
- [ ] Set up database indexes

## Support

If you encounter issues:

1. Check the logs for error messages
2. Verify all environment variables are set correctly
3. Ensure all services are running
4. Check the troubleshooting section above
5. Create an issue in the repository

## Next Steps

Once you have the application running:

1. **Explore the API**: Use the API documentation to understand available endpoints
2. **Test Features**: Create accounts, search restaurants, make reservations
3. **Customize**: Modify the UI, add new features, or integrate additional APIs
4. **Deploy**: Follow the deployment guide to put your application online

Happy coding! 🚀
