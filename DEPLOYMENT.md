# Afritable Deployment Guide

This guide covers deploying Afritable to production using Vercel (frontend) and Railway (backend).

## Prerequisites

- GitHub account
- Vercel account
- Railway account
- Google Analytics account (optional)

## Frontend Deployment (Vercel)

### 1. Prepare Frontend

1. Ensure all environment variables are set in `frontend/.env.local`:
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
NEXT_PUBLIC_APP_URL=https://your-frontend-url.vercel.app
NEXT_PUBLIC_APP_NAME=Afritable
```

### 2. Deploy to Vercel

1. **Connect GitHub Repository:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `frontend` folder as the root directory

2. **Configure Build Settings:**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Set Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add all variables from your `.env.local` file

4. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

## Backend Deployment (Railway)

### 1. Prepare Backend

1. Ensure your `backend/package.json` has the correct scripts:
```json
{
  "scripts": {
    "start": "node dist/index.js",
    "build": "npm run db:generate && tsc --noEmitOnError",
    "dev": "ts-node src/index.ts"
  }
}
```

### 2. Deploy to Railway

1. **Connect GitHub Repository:**
   - Go to [Railway Dashboard](https://railway.app/dashboard)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select the `backend` folder

2. **Configure Environment Variables:**
   - Go to Variables tab
   - Add the following variables:
   ```
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=postgresql://username:password@host:port/database
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

3. **Set up PostgreSQL Database:**
   - In Railway dashboard, click "New" → "Database" → "PostgreSQL"
   - Copy the `DATABASE_URL` from the database service
   - Add it to your backend service variables

4. **Deploy:**
   - Railway will automatically detect your `package.json` and deploy
   - The build process will:
     - Install dependencies
     - Generate Prisma client
     - Compile TypeScript
     - Run database migrations

## Database Setup

### 1. Run Migrations

After deployment, run database migrations:

```bash
# Connect to your Railway service
railway connect

# Run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

### 2. Seed Database (Optional)

```bash
# Seed with sample data
npm run seed
```

## Environment Variables Reference

### Frontend (Vercel)
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: Google Analytics measurement ID
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXT_PUBLIC_APP_URL`: Frontend URL
- `NEXT_PUBLIC_APP_NAME`: Application name

### Backend (Railway)
- `NODE_ENV`: Environment (production)
- `PORT`: Server port (3001)
- `DATABASE_URL`: PostgreSQL connection string
- `FRONTEND_URL`: Frontend URL for CORS
- `JWT_SECRET`: JWT signing secret
- `GOOGLE_PLACES_API_KEY`: Google Places API key (optional)

## Health Checks

The backend includes health check endpoints:

- `GET /api/health` - Full health check with database status
- `GET /api/ready` - Readiness check
- `GET /api/live` - Liveness check

## Monitoring

### Google Analytics
- Set up Google Analytics 4
- Add your measurement ID to environment variables
- Track user interactions, searches, and conversions

### Railway Monitoring
- View logs in Railway dashboard
- Monitor resource usage
- Set up alerts for errors

### Vercel Analytics
- Enable Vercel Analytics in project settings
- Monitor Core Web Vitals
- Track performance metrics

## Custom Domain Setup

### Frontend (Vercel)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Enable SSL certificate

### Backend (Railway)
1. Go to Service Settings → Domains
2. Add custom domain
3. Configure DNS records
4. SSL is automatically enabled

## Security Considerations

1. **Environment Variables:**
   - Never commit sensitive data to Git
   - Use Railway and Vercel environment variable management
   - Rotate secrets regularly

2. **CORS Configuration:**
   - Set `FRONTEND_URL` to your production domain
   - Avoid using wildcard origins in production

3. **Rate Limiting:**
   - Backend includes rate limiting middleware
   - Adjust limits based on usage patterns

4. **Database Security:**
   - Use strong passwords
   - Enable SSL connections
   - Regular backups

## Troubleshooting

### Common Issues

1. **Build Failures:**
   - Check Node.js version compatibility
   - Verify all dependencies are in `package.json`
   - Check build logs for specific errors

2. **Database Connection Issues:**
   - Verify `DATABASE_URL` is correct
   - Check if database is accessible from Railway
   - Run `npx prisma db push` to sync schema

3. **CORS Errors:**
   - Ensure `FRONTEND_URL` is set correctly
   - Check if frontend URL matches exactly

4. **Environment Variable Issues:**
   - Verify all required variables are set
   - Check variable names match exactly
   - Redeploy after changing variables

### Getting Help

- Check Railway logs: `railway logs`
- Check Vercel build logs in dashboard
- Review application logs for errors
- Test health endpoints manually

## Post-Deployment Checklist

- [ ] Frontend loads correctly
- [ ] Backend health checks pass
- [ ] Database connection works
- [ ] API endpoints respond correctly
- [ ] Search functionality works
- [ ] Restaurant data displays properly
- [ ] Analytics tracking works
- [ ] Custom domain (if applicable) works
- [ ] SSL certificates are valid
- [ ] Performance is acceptable

## Maintenance

### Regular Tasks
- Monitor application performance
- Review error logs
- Update dependencies
- Backup database
- Review analytics data

### Updates
- Test changes in staging environment first
- Use feature flags for gradual rollouts
- Monitor metrics after deployments
- Have rollback plan ready