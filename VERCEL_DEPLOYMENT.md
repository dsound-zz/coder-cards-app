# Vercel Deployment Guide

This guide will help you deploy the Coder Cards React app to Vercel.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. Your Rails API backend deployed somewhere (Railway, Render, Heroku, etc.)
3. Git repository with your code

## Step 1: Deploy Your Rails API Backend

Before deploying the frontend, make sure your Rails API is deployed and accessible. You'll need the API URL for the next step.

**Recommended hosting options:**
- Railway (https://railway.app)
- Render (https://render.com)
- Heroku (https://heroku.com)

## Step 2: Configure Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following environment variable:

   ```
   REACT_APP_API_URI=https://your-api-domain.com/api/v1
   ```

   Replace `https://your-api-domain.com/api/v1` with your actual Rails API URL.

4. Make sure to add this variable for **Production**, **Preview**, and **Development** environments

## Step 3: Update CORS Configuration

Update the CORS configuration in your Rails API (`coder-cards-api/config/initializers/cors.rb`) to include your Vercel domain:

```ruby
origins(
  /https:\/\/.*\.vercel\.app/,
  /https:\/\/.*\.vercel\.app\/.*/,
  'https://your-custom-domain.com',  # Add your custom domain if you have one
  'http://localhost:3000',
  'http://localhost:3001'
)
```

## Step 4: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your Git repository
3. Set the **Root Directory** to `coder-cards-app`
4. Vercel will automatically detect it's a React app
5. Click **Deploy**

### Option B: Deploy via Vercel CLI

```bash
cd coder-cards-app
npm install -g vercel
vercel
```

Follow the prompts to deploy.

## Step 5: Verify Deployment

After deployment:

1. Check that your app loads correctly
2. Test login/signup functionality
3. Verify API calls are working (check browser console for errors)
4. If you see CORS errors, make sure your Rails API CORS configuration includes your Vercel domain

## Troubleshooting

### Environment Variables Not Working

- Make sure the variable name starts with `REACT_APP_`
- Redeploy after adding/changing environment variables
- Check Vercel logs for any build errors

### CORS Errors

- Verify your Rails API CORS configuration includes your Vercel domain
- Check that your API is accessible from the browser
- Ensure credentials are being sent correctly

### Build Failures

- Check that all dependencies are in `package.json`
- Verify Node.js version compatibility
- Check Vercel build logs for specific errors

## Additional Notes

- The `vercel.json` file is already configured for React apps
- The build output directory is set to `build` (standard for Create React App)
- All routes will be handled by `index.html` for client-side routing

