# Afritable Deployment Guide

This guide covers deploying Afritable to production environments.

## Quick Deploy Options

### Option 1: Railway (Recommended)

Railway provides easy deployment for both backend and frontend with automatic database provisioning.

#### Backend Deployment
1. **Connect Repository**
   - Go to [Railway](https://railway.app/)
   - Connect your GitHub repository
   - Select the `backend` folder

2. **Configure Environment Variables**
   ```env
   NODE_ENV=production
   DATABASE_URL=postgresql://user:pass@host:port/db
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   GOOGLE_PLACES_API_KEY=your-key
   YELP_API_KEY=your-key
   FOURSQUARE_API_KEY=your-key
   FRONTEND_URL=https://your-frontend-domain.com
   ```

3. **Deploy**
   - Railway will automatically build and deploy
   - Database migrations run automatically
   - Get your backend URL

#### Frontend Deployment
1. **Connect Repository**
   - Create new project in Railway
   - Select the `frontend` folder

2. **Configure Environment Variables**
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
   NEXT_PUBLIC_APP_NAME=Afritable
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key
   ```

3. **Deploy**
   - Railway builds and deploys automatically
   - Get your frontend URL

### Option 2: Vercel + Railway

Deploy frontend to Vercel and backend to Railway.

#### Frontend on Vercel
1. **Connect to Vercel**
   - Go to [Vercel](https://vercel.com/)
   - Import your repository
   - Set root directory to `frontend`

2. **Environment Variables**
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
   NEXT_PUBLIC_APP_NAME=Afritable
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key
   ```

3. **Deploy**
   - Vercel automatically deploys on push to main

#### Backend on Railway
Follow the Railway backend deployment steps above.

### Option 3: Docker Deployment

Deploy using Docker containers on any cloud provider.

#### Using Docker Compose
```bash
# Clone repository
git clone <your-repo>
cd Afritable1

# Configure environment
cp backend/env.example backend/.env
cp frontend/env.local.example frontend/.env.local

# Edit environment files with production values

# Deploy
docker-compose up -d
```

#### Using Individual Containers
```bash
# Build images
docker build -t afritable-backend ./backend
docker build -t afritable-frontend ./frontend

# Run with external database
docker run -d --name afritable-backend \
  -e DATABASE_URL=postgresql://user:pass@host:port/db \
  -e JWT_SECRET=your-secret \
  -p 3001:3001 \
  afritable-backend

docker run -d --name afritable-frontend \
  -e NEXT_PUBLIC_API_URL=https://your-backend-url/api \
  -p 3000:3000 \
  afritable-frontend
```

## Production Configuration

### Environment Variables

#### Backend Production Variables
```env
# Database
DATABASE_URL=postgresql://user:pass@host:port/db

# Security
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_EXPIRES_IN=7d

# API Keys
GOOGLE_PLACES_API_KEY=your-production-key
YELP_API_KEY=your-production-key
FOURSQUARE_API_KEY=your-production-key

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# App
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-frontend-domain.com

# Rate Limiting
GOOGLE_PLACES_DAILY_LIMIT=1000
YELP_DAILY_LIMIT=5000
FOURSQUARE_DAILY_LIMIT=1000

# Data Collection
COLLECTION_ENABLED=true
COLLECTION_INTERVAL_HOURS=24
```

#### Frontend Production Variables
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
NEXT_PUBLIC_APP_NAME=Afritable
NEXT_PUBLIC_APP_DESCRIPTION=Restaurant reservation platform for African restaurants
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-production-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-key
```

### Database Setup

#### PostgreSQL Configuration
```sql
-- Create production database
CREATE DATABASE afritable_prod;

-- Create user
CREATE USER afritable_user WITH PASSWORD 'secure_password';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE afritable_prod TO afritable_user;

-- Enable extensions
\c afritable_prod;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
```

#### Database Migrations
```bash
# Run migrations
npx prisma db push

# Seed initial data
npm run db:seed
```

### SSL/HTTPS Setup

#### Using Let's Encrypt with Nginx
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    # Your application configuration
    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/ {
        proxy_pass http://backend:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Domain Configuration

#### DNS Setup
```
# A records
your-domain.com -> your-server-ip
api.your-domain.com -> your-server-ip

# CNAME records
www.your-domain.com -> your-domain.com
```

#### CDN Configuration (Optional)
- Use Cloudflare or AWS CloudFront
- Configure caching rules
- Enable SSL/TLS
- Set up custom domains

## Monitoring and Logging

### Application Monitoring

#### Health Checks
```bash
# Backend health
curl https://your-backend-domain.com/health

# Frontend health
curl https://your-frontend-domain.com/api/health
```

#### Log Monitoring
```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Or with Railway
railway logs
```

### Database Monitoring

#### Connection Monitoring
```sql
-- Check active connections
SELECT count(*) FROM pg_stat_activity WHERE datname = 'afritable_prod';

-- Check database size
SELECT pg_size_pretty(pg_database_size('afritable_prod'));
```

### Performance Monitoring

#### API Response Times
- Monitor endpoint response times
- Set up alerts for slow queries
- Track error rates

#### Database Performance
```sql
-- Check slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
```

## Security Checklist

### Application Security
- [ ] Use strong JWT secrets
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Validate all inputs
- [ ] Use environment variables for secrets
- [ ] Regular security updates

### Database Security
- [ ] Use strong passwords
- [ ] Enable SSL connections
- [ ] Restrict database access
- [ ] Regular backups
- [ ] Monitor access logs

### API Security
- [ ] Restrict API keys to production domains
- [ ] Monitor API usage
- [ ] Set up alerts for unusual activity
- [ ] Regular key rotation

## Backup Strategy

### Database Backups
```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump afritable_prod > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://your-backup-bucket/
```

### Application Backups
- Code repository (Git)
- Environment configurations
- SSL certificates
- Database dumps

## Scaling Considerations

### Horizontal Scaling
- Use load balancers
- Multiple backend instances
- Database read replicas
- CDN for static assets

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Use caching (Redis)
- Optimize images and assets

### Database Scaling
```sql
-- Add indexes for better performance
CREATE INDEX idx_restaurants_location ON restaurants USING GIST (ST_Point(longitude, latitude));
CREATE INDEX idx_restaurants_cuisine ON restaurants USING GIN (cuisine);
CREATE INDEX idx_reservations_date ON reservations (date);
```

## Maintenance

### Regular Tasks
- [ ] Monitor disk space
- [ ] Check error logs
- [ ] Update dependencies
- [ ] Review security patches
- [ ] Backup verification
- [ ] Performance monitoring

### Updates
```bash
# Update dependencies
npm update

# Run tests
npm test

# Deploy updates
git push origin main
```

## Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check database status
docker-compose ps postgres

# Check logs
docker-compose logs postgres

# Test connection
psql -h localhost -U afritable_user -d afritable_prod
```

#### API Issues
```bash
# Check backend logs
docker-compose logs backend

# Test API endpoint
curl -v https://your-api-domain.com/health
```

#### Frontend Issues
```bash
# Check frontend logs
docker-compose logs frontend

# Test frontend
curl -v https://your-frontend-domain.com
```

### Performance Issues
- Check database query performance
- Monitor memory usage
- Review API response times
- Check for memory leaks

## Support

For deployment support:
- Check logs for error messages
- Verify environment variables
- Test health endpoints
- Contact support team

## Cost Optimization

### Cloud Provider Optimization
- Use appropriate instance sizes
- Enable auto-scaling
- Use reserved instances
- Monitor usage and costs

### Database Optimization
- Use connection pooling
- Optimize queries
- Regular maintenance
- Monitor performance

### CDN and Caching
- Use CDN for static assets
- Implement Redis caching
- Optimize images
- Enable compression
