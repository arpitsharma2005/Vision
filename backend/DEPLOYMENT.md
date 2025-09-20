# Vision-Cast Backend Deployment on Render

## Quick Render Deployment Guide

### Prerequisites
- GitHub repository with your backend code
- MongoDB Atlas account (free tier available)
- Cloudinary account (free tier available)
- Gemini API key from Google AI Studio

### Step 1: Setup External Services

#### MongoDB Atlas
1. Create a free MongoDB Atlas account at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a new cluster (free M0 tier)
3. Create a database user and get your connection string
4. Format: `mongodb+srv://username:password@cluster.mongodb.net/vision-cast?retryWrites=true&w=majority`

#### Cloudinary (for image storage)
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get your Cloud Name, API Key, and API Secret from the dashboard

#### Google Gemini API
1. Visit [ai.google.dev](https://ai.google.dev)
2. Create a new project and get your API key

### Step 2: Deploy to Render

1. **Connect Repository**
   - Go to [render.com](https://render.com) and create an account
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   - **Build Command**: Leave empty (Docker handles this)
   - **Start Command**: Leave empty (Dockerfile CMD handles this)
   - **Environment**: Docker
   - **Dockerfile Path**: `./Dockerfile`

3. **Set Environment Variables**
   Add these in Render's Environment section:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-secure-jwt-secret
   JWT_REFRESH_SECRET=your-secure-refresh-secret
   GEMINI_API_KEY=your-gemini-api-key
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your app
   - Your app will be available at `https://your-app-name.onrender.com`

### Step 3: Test Your Deployment

```bash
# Health check
curl https://your-app-name.onrender.com/health

# API documentation (if available)
curl https://your-app-name.onrender.com/api
```

### Local Development

For local development, you can still use Docker Compose:

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your credentials
nano .env

# Start local services (MongoDB + Redis + API)
docker-compose up -d

# Or run just the API with external MongoDB
docker-compose up api
```

### Important Notes

1. **Free Tier Limitations**
   - Render free services sleep after 15 minutes of inactivity
   - First request after sleep may take 30+ seconds
   - Consider upgrading for production use

2. **Database Connection**
   - Use MongoDB Atlas (recommended) instead of local MongoDB
   - Connection string format is crucial for proper authentication

3. **Environment Variables**
   - Never commit `.env` files to git
   - Use strong, unique secrets for JWT tokens
   - Store all sensitive data in Render's environment variables

4. **Monitoring**
   - Use Render's built-in logs for debugging
   - Health check endpoint: `/health`
   - Monitor your MongoDB Atlas usage

### Troubleshooting

**Common Issues:**

1. **Build Fails**
   - Check Dockerfile syntax
   - Ensure all dependencies are in package.json
   - Review build logs in Render dashboard

2. **App Crashes on Start**
   - Verify environment variables are set correctly
   - Check database connection string
   - Review application logs

3. **Database Connection Issues**
   - Whitelist Render's IP ranges in MongoDB Atlas (usually set to 0.0.0.0/0 for Render)
   - Verify connection string format
   - Check database user permissions

4. **API Not Responding**
   - Ensure PORT environment variable is set to 5000
   - Check if health endpoint responds
   - Review error logs

### Cost Optimization

- **MongoDB Atlas**: Free M0 cluster (512MB storage)
- **Render**: Free tier includes 750 hours/month
- **Cloudinary**: Free tier includes 25GB storage + 25GB bandwidth
- **Total**: $0/month for development and testing

For production, consider upgrading to paid tiers for better performance and reliability.