# 🚀 Afritable Production Deployment Steps

## Current Status
- ✅ **2,889 African restaurants** in database
- ✅ **445 restaurants with photos** (15.4% coverage)
- ✅ **All core functionality working**
- ✅ **Clean, focused database** (no non-African restaurants)
- ✅ **Daily photo enhancement process** ready

## Deployment Strategy
- **Frontend**: Vercel (Next.js)
- **Backend**: Railway (Node.js/Express)
- **Database**: PostgreSQL (Railway)

---

## Step 1: Prepare for Deployment

### 1.1 Install Required Tools
```bash
# Install Railway CLI
npm install -g @railway/cli

# Install Vercel CLI
npm install -g vercel

# Login to services
railway login
vercel login
```

### 1.2 Build Application
```bash
# From project root
npm run install:all
npm run build
```

---

## Step 2: Deploy Backend to Railway

### 2.1 Create Railway Project
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Select the `backend` folder

### 2.2 Set Up PostgreSQL Database
1. In Railway dashboard, click "New" → "Database" → "PostgreSQL"
2. Copy the `DATABASE_URL` from the database service
3. Add it to your backend service variables

### 2.3 Configure Environment Variables
Add these variables in Railway dashboard:

```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# JWT
JWT_SECRET=afritable-super-secret-jwt-key-production-2024
JWT_EXPIRES_IN=7d

# API Keys
GOOGLE_MAPS_API_KEY=AIzaSyBgxe92qPzMXUl0vefNRILvbQZxOV-FgOU
GOOGLE_PLACES_API_KEY=AIzaSyBgxe92qPzMXUl0vefNRILvbQZxOV-FgOU

# App Configuration
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://afritable.vercel.app

# Rate Limiting
GOOGLE_PLACES_DAILY_LIMIT=1000

# Data Collection
COLLECTION_ENABLED=true
COLLECTION_INTERVAL_HOURS=24
```

### 2.4 Deploy Backend
```bash
cd backend
railway up
```

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Project
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select the `frontend` folder as root directory

### 3.2 Configure Build Settings
- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### 3.3 Set Environment Variables
Add these variables in Vercel dashboard:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
NEXT_PUBLIC_APP_URL=https://afritable.vercel.app
NEXT_PUBLIC_APP_NAME=Afritable
```

### 3.4 Deploy Frontend
```bash
cd frontend
vercel --prod
```

---

## Step 4: Database Setup

### 4.1 Run Migrations
```bash
# Connect to Railway service
railway connect

# Run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

### 4.2 Seed Database (Optional)
```bash
# Seed with your current data
npm run seed
```

---

## Step 5: Configure CORS

Update your backend `FRONTEND_URL` environment variable in Railway to match your Vercel deployment URL.

---

## Step 6: Test Deployment

### 6.1 Test Backend
```bash
# Test health endpoint
curl https://your-backend-url.railway.app/health

# Test API endpoints
curl https://your-backend-url.railway.app/api/restaurants?limit=5
```

### 6.2 Test Frontend
1. Visit your Vercel URL
2. Test search functionality
3. Test restaurant details
4. Verify photos are loading

---

## Step 7: Set Up Daily Photo Enhancement

### 7.1 Create Railway Cron Job (Optional)
You can set up a daily cron job in Railway to run the photo enhancement script:

```bash
# Add to Railway environment variables
CRON_SCHEDULE=0 2 * * *  # Run daily at 2 AM
```

### 7.2 Manual Daily Process
```bash
# Run daily photo enhancement
cd backend
./run-daily-photos.sh
```

---

## Step 8: Monitor and Maintain

### 8.1 Set Up Monitoring
- Railway: Monitor logs and resource usage
- Vercel: Enable analytics and monitoring
- Google Analytics: Track user behavior

### 8.2 Daily Tasks
- Run photo enhancement script
- Monitor error logs
- Check API usage limits

---

## Environment Variables Summary

### Backend (Railway)
```bash
DATABASE_URL=postgresql://...
JWT_SECRET=afritable-super-secret-jwt-key-production-2024
JWT_EXPIRES_IN=7d
GOOGLE_MAPS_API_KEY=AIzaSyBgxe92qPzMXUl0vefNRILvbQZxOV-FgOU
GOOGLE_PLACES_API_KEY=AIzaSyBgxe92qPzMXUl0vefNRILvbQZxOV-FgOU
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://afritable.vercel.app
GOOGLE_PLACES_DAILY_LIMIT=1000
COLLECTION_ENABLED=true
COLLECTION_INTERVAL_HOURS=24
```

### Frontend (Vercel)
```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
NEXT_PUBLIC_APP_URL=https://afritable.vercel.app
NEXT_PUBLIC_APP_NAME=Afritable
```

---

## Post-Deployment Checklist

- [ ] Backend health checks pass
- [ ] Frontend loads correctly
- [ ] Database connection works
- [ ] API endpoints respond correctly
- [ ] Search functionality works
- [ ] Restaurant data displays properly
- [ ] Photos are loading
- [ ] CORS is configured correctly
- [ ] Environment variables are set
- [ ] SSL certificates are valid
- [ ] Performance is acceptable

---

## Troubleshooting

### Common Issues
1. **CORS Errors**: Check `FRONTEND_URL` in backend
2. **Database Connection**: Verify `DATABASE_URL`
3. **Build Failures**: Check Node.js version compatibility
4. **API Errors**: Verify API keys are set correctly

### Getting Help
- Railway logs: `railway logs`
- Vercel build logs: Check dashboard
- Application logs: Check Railway/Vercel dashboards

---

## Success Metrics

- **Current State**: 445 restaurants with photos (15.4%)
- **Daily Enhancement**: 100 restaurants per day
- **Completion Time**: 25 days
- **Target**: All 2,889 restaurants with photos

---

## Next Steps After Deployment

1. **Monitor Performance**: Track response times and error rates
2. **User Feedback**: Collect feedback from early users
3. **Daily Enhancement**: Run photo enhancement script daily
4. **Feature Updates**: Add new features based on user feedback
5. **Marketing**: Start promoting your app to users

---

## 🎉 Ready to Deploy!

Your Afritable app is ready for production deployment with:
- ✅ Clean African-only restaurant database
- ✅ Working photo enhancement system
- ✅ All core functionality operational
- ✅ Free tier optimized daily process

**Let's get your app live!** 🚀