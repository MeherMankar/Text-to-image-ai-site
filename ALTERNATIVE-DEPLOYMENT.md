# Alternative Deployment Options

This guide provides detailed instructions for deploying your Text-to-Image Generator backend to alternative platforms:

- Render
- Vercel
- Heroku

## Table of Contents

1. [Deploying to Render](#deploying-to-render)
2. [Deploying to Vercel](#deploying-to-vercel)
3. [Deploying to Heroku](#deploying-to-heroku)
4. [Environment Variables](#environment-variables)
5. [Updating the Frontend](#updating-the-frontend)

---

## Deploying to Render

[Render](https://render.com/) offers a generous free tier and is easy to set up.

### Option 1: Deploy from GitHub

1. **Create a Render account** at [render.com](https://render.com/)

2. **Create a new Web Service**:
   - Click on "New" > "Web Service"
   - Connect your GitHub account
   - Select your repository

3. **Configure the service**:
   - Name: `text-to-image-backend` (or your preferred name)
   - Environment: `Node`
   - Region: Choose the closest to your users
   - Branch: `main` (or your default branch)
   - Root Directory: `backend` (if your repo has both frontend and backend)
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Free

4. **Set up environment variables**:
   - Click on "Environment" in your service dashboard
   - Add the following key-value pairs:
     - `STABILITY_API_KEY`: Your Stability AI API key
     - `OPENAI_API_KEY`: Your OpenAI API key
     - `NODE_ENV`: `production`

5. **Deploy the service**:
   - Click "Create Web Service"
   - Wait for the deployment to complete

### Option 2: Deploy with Blueprint

Render supports Blueprint deployments that define your infrastructure as code.

1. **Push the `render.yaml` file** to your repository

2. **Create a new Blueprint instance**:
   - Go to the Render dashboard
   - Click "New" > "Blueprint"
   - Select your repository
   - Follow the prompts to deploy

3. **Set up environment variables**:
   - After deployment, go to your service settings
   - Add the secret environment variables that couldn't be included in the YAML file

## Deploying to Vercel

[Vercel](https://vercel.com/) is primarily known for frontend hosting but also supports Node.js APIs.

1. **Create a Vercel account** at [vercel.com](https://vercel.com/)

2. **Install the Vercel CLI** (optional):
   ```bash
   npm install -g vercel
   ```

3. **Deploy using the CLI**:
   ```bash
   # Navigate to your backend directory
   cd backend
   
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel
   ```

4. **Or deploy from the Vercel dashboard**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Configure the project:
     - Root directory: `backend` (if your repo has both frontend and backend)
     - Build command: Leave empty or `npm run vercel-build`
     - Output directory: Leave empty
     - Development command: `npm run dev`

5. **Set up environment variables**:
   - Go to your project settings > Environment Variables
   - Add:
     - `STABILITY_API_KEY`: Your Stability AI API key
     - `OPENAI_API_KEY`: Your OpenAI API key

6. **Redeploy if needed**:
   ```bash
   vercel --prod
   ```

## Deploying to Heroku

[Heroku](https://heroku.com/) is a well-established platform for hosting Node.js applications.

1. **Create a Heroku account** at [heroku.com](https://heroku.com/)

2. **Install the Heroku CLI**:
   ```bash
   npm install -g heroku
   ```

3. **Login to Heroku**:
   ```bash
   heroku login
   ```

4. **Create a new Heroku app**:
   ```bash
   cd backend
   heroku create your-app-name
   ```

5. **Set environment variables**:
   ```bash
   heroku config:set STABILITY_API_KEY=your_stability_key
   heroku config:set OPENAI_API_KEY=your_openai_key
   heroku config:set NODE_ENV=production
   ```

6. **Deploy to Heroku**:
   ```bash
   git subtree push --prefix backend heroku main
   ```
   
   Or if your backend is in a separate repository:
   ```bash
   git push heroku main
   ```

7. **Open your deployed app**:
   ```bash
   heroku open
   ```

## Environment Variables

All platforms require these environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `STABILITY_API_KEY` | Your Stability AI API key | Yes |
| `OPENAI_API_KEY` | Your OpenAI API key | Yes |
| `NODE_ENV` | Environment (set to "production") | Yes |
| `PORT` | Port for the server (set automatically by most platforms) | No |

## Updating the Frontend

After deploying your backend to a new platform, update your frontend settings:

1. **Update the .env file**:
   ```
   REACT_APP_API_URL=https://your-new-backend-url.example.com
   ```

2. **Update Netlify environment variables**:
   - Go to your Netlify site dashboard
   - Site settings > Build & deploy > Environment
   - Update `REACT_APP_API_URL` with your new backend URL
   - Trigger a new deployment

## Troubleshooting

### CORS Issues

If you encounter CORS issues after deployment, verify that your backend allows requests from your frontend domain:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-netlify-site.netlify.app'  // Add your Netlify domain
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Connection Timeouts

If requests time out:
- Check if your backend service is running
- Verify that rate limits haven't been exceeded
- Ensure your API keys are still valid

### Platform-Specific Issues

- **Render**: May sleep after 15 minutes of inactivity on free tier
- **Vercel**: Has limitations on serverless function execution time
- **Heroku**: Free tier dynos sleep after 30 minutes of inactivity 