# Afritable - African Restaurant Reservation Platform

Afritable is a comprehensive restaurant reservation platform specifically designed for African restaurants, competing with OpenTable. The platform helps users discover, explore, and book reservations at authentic African restaurants across major US metropolitan areas.

## 🌟 Features

### For Customers
- **Restaurant Discovery**: Search and filter African restaurants by cuisine, location, price, and rating
- **Real-time Reservations**: Book tables with real-time availability checking
- **Comprehensive Reviews**: Read and write reviews for restaurants
- **User Dashboard**: Manage reservations, view history, and track favorites
- **Mobile Responsive**: Optimized for all devices

### For Restaurants
- **Profile Management**: Complete restaurant profiles with photos, menus, and hours
- **Reservation Management**: Handle bookings and availability
- **Analytics Dashboard**: Track reservations and customer feedback
- **Multi-location Support**: Manage multiple restaurant locations

### For Administrators
- **Data Collection**: Automated restaurant data collection from multiple APIs
- **Content Management**: Manage restaurants, users, and reviews
- **Analytics**: Comprehensive dashboard with usage statistics
- **API Monitoring**: Track API usage and performance

## 🏗️ Architecture

### Backend (Node.js/Express)
- **RESTful API**: Comprehensive API with authentication and authorization
- **Database**: PostgreSQL with Prisma ORM
- **API Integrations**: Google Places, Yelp Fusion, and Foursquare APIs
- **Automated Data Collection**: Scheduled restaurant data collection
- **Rate Limiting**: Smart API usage management
- **Security**: JWT authentication, input validation, and error handling

### Frontend (Next.js/React)
- **Modern UI**: Built with Tailwind CSS and Headless UI
- **Type Safety**: Full TypeScript implementation
- **State Management**: React Query for server state
- **Responsive Design**: Mobile-first approach
- **Performance**: Optimized images and lazy loading

### Database Schema
- **Restaurants**: Complete restaurant information with geographic data
- **Users**: Customer and restaurant owner accounts
- **Reservations**: Booking management with availability tracking
- **Reviews**: Customer feedback and ratings
- **API Usage**: Tracking for external API consumption

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 15+
- Docker and Docker Compose (optional)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Afritable1
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   # Backend
   cp backend/env.example backend/.env
   # Edit backend/.env with your configuration
   
   # Frontend
   cp frontend/env.local.example frontend/.env.local
   # Edit frontend/.env.local with your configuration
   ```

4. **Set up the database**
   ```bash
   # Start PostgreSQL (if not using Docker)
   # Create database: afritable
   
   # Run migrations
   npm run db:push
   
   # Seed the database
   npm run db:seed
   ```

5. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend API: http://localhost:3001
   - Frontend: http://localhost:3000

### Docker Setup

1. **Start all services**
   ```bash
   docker-compose up -d
   ```

2. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Database: localhost:5432

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/afritable"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# API Keys
GOOGLE_PLACES_API_KEY="your-google-places-api-key"
YELP_API_KEY="your-yelp-fusion-api-key"
FOURSQUARE_API_KEY="your-foursquare-api-key"

# Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# App Configuration
NODE_ENV="development"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=Afritable
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### API Keys Setup

1. **Google Places API**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Places API
   - Create credentials and get API key

2. **Yelp Fusion API**
   - Visit [Yelp Developers](https://www.yelp.com/developers)
   - Create an app and get API key

3. **Foursquare Places API**
   - Go to [Foursquare Developers](https://developer.foursquare.com/)
   - Create a project and get API key

## 📊 Data Collection

The platform automatically collects restaurant data from multiple sources:

### Target Metropolitan Areas
- **Houston**: 35-mile radius including Fulshear, Katy, The Woodlands
- **NYC**: 5 boroughs + Nassau, Westchester, North NJ
- **DC**: DMV region including Northern VA, Maryland suburbs
- **Atlanta**: 28-county metro area
- **LA**: LA/Orange/Ventura/Riverside/San Bernardino counties

### African Cuisine Focus
- Ethiopian, Nigerian, Moroccan, West African, East African
- Somali, Sudanese, Ghanaian, Senegalese, Kenyan
- And many more African cuisines

### Data Collection Process
1. **API Integration**: Collects data from Google Places, Yelp, and Foursquare
2. **Smart Rate Limiting**: Distributes requests across APIs to maximize daily limits
3. **Deduplication**: Removes duplicate restaurants based on location and name
4. **Data Cleaning**: Standardizes and validates restaurant information
5. **Automated Scheduling**: Runs daily data collection via cron jobs

## 🔌 API Documentation

### Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Key Endpoints

#### Restaurants
- `GET /api/restaurants` - List restaurants with filters
- `GET /api/restaurants/:id` - Get restaurant details
- `GET /api/restaurants/:id/availability` - Check availability
- `POST /api/restaurants/:id/reviews` - Create review

#### Reservations
- `GET /api/reservations` - List user reservations
- `POST /api/reservations` - Create reservation
- `PUT /api/reservations/:id` - Update reservation
- `PUT /api/reservations/:id/cancel` - Cancel reservation

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Response Format
```json
{
  "success": true,
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

## 🚀 Deployment

### Railway Deployment

1. **Connect your repository to Railway**
2. **Set environment variables in Railway dashboard**
3. **Deploy automatically on push to main branch**

### Vercel Deployment (Frontend)

1. **Connect your repository to Vercel**
2. **Set environment variables**
3. **Deploy automatically**

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production servers**
   ```bash
   npm start
   ```

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 📈 Monitoring

### Health Checks
- Backend: `GET /health`
- Frontend: `GET /api/health`

### Logging
- Application logs: `backend/logs/`
- Error tracking with Winston
- API usage monitoring

### Analytics
- Restaurant discovery metrics
- Reservation conversion rates
- User engagement tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ Core reservation system
- ✅ Restaurant discovery
- ✅ User authentication
- ✅ API integrations

### Phase 2 (Next)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Payment integration
- [ ] Restaurant owner dashboard

### Phase 3 (Future)
- [ ] Multi-language support
- [ ] International expansion
- [ ] AI-powered recommendations
- [ ] Social features

---

Built with ❤️ for the African restaurant community
