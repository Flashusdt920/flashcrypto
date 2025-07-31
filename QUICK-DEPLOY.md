# Quick Deployment Guide - Bolt Crypto Flasher

## Option 1: Railway (Recommended - Easiest)

**Cost**: ~$10/month | **Time**: 10 minutes | **Difficulty**: Beginner

### Steps:
1. **Go to [Railway.app](https://railway.app)** and sign up with GitHub
2. **Create new project** → "Deploy from GitHub repo"
3. **Connect your repository** (push your code to GitHub first)
4. **Add PostgreSQL database**:
   - Click "Add Service" → "Database" → "PostgreSQL"
   - Railway automatically provides `DATABASE_URL`
5. **Set environment variables**:
   - Go to your web service → "Variables"
   - Add: `NODE_ENV = production`
6. **Deploy automatically** - Railway detects your Node.js app and deploys

Your app will be live at: `https://your-app-name.up.railway.app`

---

## Option 2: Vercel + Neon (Free Tier)

**Cost**: Free (with limits) | **Time**: 15 minutes | **Difficulty**: Intermediate

### Steps:
1. **Set up database**:
   - Go to [Neon.tech](https://neon.tech) → Create account
   - Create new project → Copy connection string
   
2. **Deploy to Vercel**:
   ```bash
   npm install -g vercel
   npm run build
   vercel --prod
   ```
   
3. **Configure environment variables** in Vercel dashboard:
   - `DATABASE_URL` = your Neon connection string
   - `NODE_ENV = production`

Your app will be live at: `https://your-app-name.vercel.app`

---

## Option 3: DigitalOcean (Production Ready)

**Cost**: ~$20/month | **Time**: 20 minutes | **Difficulty**: Advanced

### Steps:
1. **Create DigitalOcean account**
2. **Go to App Platform** → "Create App"
3. **Connect GitHub repository**
4. **Configure app**:
   - Build Command: `npm run build`
   - Run Command: `npm start`
   - Port: 5000
5. **Add managed PostgreSQL database**
6. **Set environment variables**

---

## Pre-Deployment Checklist

Before deploying, ensure:

```bash
# 1. Build works locally
npm run build

# 2. Production start works
npm start

# 3. Environment variables are ready
# DATABASE_URL=postgresql://...
# NODE_ENV=production
```

## Database Setup (Required)

You need a PostgreSQL database. Recommended options:

### Neon (Free Tier)
1. Go to [neon.tech](https://neon.tech)
2. Create project
3. Copy connection string
4. Use as `DATABASE_URL`

### Railway PostgreSQL
1. In Railway dashboard
2. Add Service → Database → PostgreSQL
3. Connection string auto-provided

## Quick Start Commands

### For Railway:
```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Deploy to Railway"
git remote add origin https://github.com/yourusername/bolt-crypto-flasher.git
git push -u origin main

# 2. Connect to Railway and deploy (via web interface)
```

### For Vercel:
```bash
# Run the deployment script
./deploy-vercel.sh
```

### For Railway (with script):
```bash
# Run the preparation script
./deploy-railway.sh
```

## Post-Deployment Testing

After deployment, test these features:
1. **Login** with admin credentials: `admin/usdt123`
2. **Admin panel** access and user management
3. **User registration** with email
4. **Transaction creation** and flash fee flow
5. **Subscription system** functionality

## Support

If you encounter issues:
1. Check deployment logs in your hosting provider's dashboard
2. Verify all environment variables are set correctly
3. Ensure database connection is working
4. Test API endpoints individually

**Recommended for beginners**: Start with Railway - it's the most straightforward option with integrated database hosting.