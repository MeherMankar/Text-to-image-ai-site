# Deployment Guide

This guide provides detailed instructions for deploying the Text-to-Image Generator application to the recommended platforms:

- Backend: Railway or Koyeb
- Frontend: Netlify

## Table of Contents

1. [Preparing for Deployment](#preparing-for-deployment)
2. [Backend Deployment](#backend-deployment)
   - [Railway Deployment](#railway-deployment)
   - [Koyeb Deployment](#koyeb-deployment)
3. [Frontend Deployment](#frontend-deployment)
   - [Netlify Deployment](#netlify-deployment)
4. [Connecting Frontend and Backend](#connecting-frontend-and-backend)
5. [Post-Deployment Verification](#post-deployment-verification)
6. [Custom Domains](#custom-domains)

---

## Preparing for Deployment

Before deploying, make sure your application is ready:

1. **Test locally**: Ensure everything works on your local machine
2. **API keys**: Have your Stability AI and OpenAI API keys ready
3. **Git repository**: Ideally, have your code in a Git repository (GitHub, GitLab, etc.)
4. **Environment files**: Ensure `.env.example` files are up to date in both frontend and backend

---

## Backend Deployment

### Railway Deployment

[Railway](https://railway.app/) is a platform that makes it easy to deploy and manage applications.

#### Prerequisites:

- A Railway account
- Railway CLI installed (optional but recommended)

#### Step 1: Install the Railway CLI (optional)

```bash
npm install -g @railway/cli
```

#### Step 2: Login to Railway

```bash
railway login
```

#### Step 3: Deploy your Backend

**Option A: Using the CLI:**

1. Navigate to your backend directory:
   ```bash
   cd backend
   ```

2. Initialize a new Railway project:
   ```bash
   railway init
   ```
   - Choose to create a new project when prompted

3. Set up your environment variables:
   ```bash
   railway variables set STABILITY_API_KEY=your_stability_key
   railway variables set OPENAI_API_KEY=your_openai_key
   railway variables set NODE_ENV=production
   ```

4. Deploy your application:
   ```bash
   railway up
   ```

5. Create a domain for your API:
   ```bash
   railway domain
   ```
   - This creates a public URL for your backend
   - Save this URL for connecting to your frontend

**Option B: Using the Railway Dashboard:**

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository and the backend directory
4. Configure your project:
   - Set the start command to `npm start`
   - Add environment variables (STABILITY_API_KEY, OPENAI_API_KEY, NODE_ENV)
5. Deploy the application
6. Go to "Settings" → "Domains" to create a public URL for your API

### Koyeb Deployment

[Koyeb](https://www.koyeb.com/) is a developer-friendly serverless platform.

#### Prerequisites:

- A Koyeb account
- Git repository with your code (recommended)

#### Step 1: Create a New Application on Koyeb

1. Log in to your [Koyeb Console](https://app.koyeb.com/)
2. Click "Create App"

#### Step 2: Configure Your App

**Option A: Deploy from Git:**

1. Select "GitHub" as the deployment method
2. Choose your repository and branch
3. Configure the build:
   - Name: "text-to-image-backend"
   - Region: Choose the closest to your users
   - Instance type: "Nano" is sufficient for starting
   - Build command: `npm install`
   - Start command: `npm start`
   - Environment variables:
     - STABILITY_API_KEY: your_stability_key
     - OPENAI_API_KEY: your_openai_key
     - NODE_ENV: production
     - PORT: 8080 (Koyeb defaults to port 8080)

**Option B: Deploy a Docker image:**

1. Create a `Dockerfile` in your backend directory:
   ```dockerfile
   FROM node:18
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   EXPOSE 8080
   CMD ["npm", "start"]
   ```

2. Build and push your Docker image to a registry

3. On Koyeb, select "Docker" as the deployment method
4. Enter your Docker image details
5. Add the environment variables as listed above

#### Step 3: Deploy and Get Your API URL

1. Click "Deploy"
2. Wait for the deployment to complete
3. Go to the "App" section to find your public URL
4. Save this URL for connecting to your frontend

---

## Frontend Deployment

### Netlify Deployment

[Netlify](https://www.netlify.com/) is a platform specialized in frontend deployments with continuous deployment features.

#### Prerequisites:

- A Netlify account
- Git repository with your code (recommended)
- Netlify CLI installed (optional)

#### Step 1: Prepare Your Frontend for Production

1. Update your `.env` file to point to your deployed backend:
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app
   ```
   Note: This is just for local testing. In production, you'll set this in Netlify.

2. Ensure you have a `netlify.toml` file in your frontend directory:
   ```toml
   [build]
     command = "npm run build"
     publish = "build"
   
   [build.environment]
     NODE_VERSION = "18"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

#### Step 2: Deploy to Netlify

**Option A: Using the Netlify CLI:**

1. Install the Netlify CLI if you haven't already:
   ```bash
   npm install -g netlify-cli
   ```

2. Navigate to your frontend directory:
   ```bash
   cd frontend
   ```

3. Login to Netlify:
   ```bash
   netlify login
   ```

4. Build your application:
   ```bash
   npm run build
   ```

5. Deploy to Netlify:
   ```bash
   netlify deploy
   ```
   - Choose to create a new site
   - Specify "build" as your publish directory
   - This creates a draft URL for testing

6. When ready for production:
   ```bash
   netlify deploy --prod
   ```

**Option B: Using the Netlify Web Interface:**

1. Go to [Netlify](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect to your Git provider and select your repository
4. Configure build settings:
   - Base directory: frontend (if your repo has both frontend and backend)
   - Build command: npm run build
   - Publish directory: build
5. Click "Deploy site"

#### Step 3: Configure Environment Variables in Netlify

1. Go to your site dashboard on Netlify
2. Navigate to Site settings → Build & deploy → Environment
3. Add a new variable:
   - Key: `REACT_APP_API_URL`
   - Value: Your deployed backend URL (from Railway or Koyeb)
4. Click "Save"
5. Trigger a new deploy for the changes to take effect:
   - Go to Deploys → Trigger deploy

---

## Connecting Frontend and Backend

After deploying both parts of your application, you need to ensure they can communicate properly.

### 1. Update CORS Configuration in Backend

If your backend is already deployed, you'll need to update the CORS configuration to allow requests from your Netlify domain:

1. Update your `server.js` file:
   ```javascript
   // Update CORS configuration
   app.use(cors({
     origin: [
       'http://localhost:3000',
       'https://your-frontend-domain.netlify.app'
     ],
     methods: ['GET', 'POST'],
     credentials: true
   }));
   ```

2. Redeploy your backend

### 2. Verify Frontend Environment Variables

1. Check that your Netlify deployment has the correct `REACT_APP_API_URL` value
2. Remember that environment variables in React must be prefixed with `REACT_APP_`
3. Any changes to environment variables require a new deployment to take effect

---

## Post-Deployment Verification

After deploying both the frontend and backend, perform these checks to ensure everything is working:

### 1. Backend Verification

1. Test the backend health endpoint:
   ```
   https://your-backend-url.railway.app/
   ```
   You should see: "Text-to-Image Generator API is running"

2. Check logs for any errors:
   - Railway: `railway logs`
   - Koyeb: Check the logs in the Koyeb dashboard

### 2. Frontend Verification

1. Visit your Netlify URL
2. Open browser developer tools (F12)
3. Check the Console tab for any errors
4. Test image generation with a simple prompt
5. Verify that images are being displayed correctly

### 3. End-to-End Testing

1. Try generating images with different prompts and models
2. Verify downloaded images can be opened correctly
3. Check that the image history persists (stored in local storage)

---

## Custom Domains

### Setting Up a Custom Domain on Railway

1. Go to your Railway project
2. Navigate to the "Domains" section
3. Click "Add Domain"
4. Enter your domain name (e.g., api.yourdomain.com)
5. Follow the DNS configuration instructions
6. Wait for DNS propagation (can take up to 24 hours)

### Setting Up a Custom Domain on Koyeb

1. Go to your Koyeb application
2. Click on the "App" section
3. Go to "Domains" tab and click "Add Domain"
4. Enter your domain name
5. Follow the DNS configuration instructions
6. Wait for DNS propagation

### Setting Up a Custom Domain on Netlify

1. Go to your Netlify site dashboard
2. Click "Domain settings" → "Add custom domain"
3. Enter your domain name
4. Choose whether to use Netlify DNS or your current DNS provider
5. Follow the configuration instructions
6. Wait for DNS propagation

### Updating API URL After Custom Domain Setup

After setting up a custom domain for your backend:

1. Update the `REACT_APP_API_URL` in Netlify to use your custom domain
2. Trigger a new deployment of your frontend
3. Update CORS configuration in backend to include your custom frontend domain
4. Redeploy your backend if needed 