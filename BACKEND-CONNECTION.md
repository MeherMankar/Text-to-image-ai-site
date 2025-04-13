# Backend Connection Troubleshooting Guide

If you're experiencing "Failed to connect to server" errors in your frontend application, follow this guide to diagnose and fix the issues.

## Quick Fixes

1. **Check if your backend is running**
   - For local development: Make sure your backend server is running on http://localhost:5000
   - For deployed applications: Verify your backend service is up and running

2. **Verify your environment variables**
   - Check that `REACT_APP_API_URL` in your frontend `.env` file points to the correct backend URL
   - For local development: `REACT_APP_API_URL=http://localhost:5000`
   - For production: `REACT_APP_API_URL=https://your-backend-url.railway.app` (replace with your actual backend URL)

3. **Test your backend directly**
   - Open your backend URL in a browser or use curl/Postman to test it
   - You should see "Text-to-Image Generator API is running" message

## Common Issues and Solutions

### 1. CORS (Cross-Origin Resource Sharing) Issues

**Symptoms:**
- Frontend shows connection error
- Browser console shows CORS-related errors
- Backend is actually running and accessible directly

**Solution:**
1. Update your backend CORS configuration in `server.js`:

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

2. Make sure to include your Netlify domain in the allowed origins
3. Redeploy your backend after making these changes

### 2. Incorrect API URL

**Symptoms:**
- "Failed to connect to server" errors
- Network requests to wrong URL in browser console

**Solution:**
1. Check your `.env` file in the frontend directory
2. Ensure `REACT_APP_API_URL` is set correctly
3. Remember that environment variables in React must be prefixed with `REACT_APP_`
4. After changing environment variables, you need to restart your development server or rebuild for production

### 3. Backend Service is Down

**Symptoms:**
- Cannot access backend URL directly
- Railway/Koyeb/Heroku dashboard shows service is down

**Solution:**
1. Check your deployment platform dashboard for errors
2. View logs to identify any issues:
   - Railway: `railway logs`
   - Koyeb: Check logs in dashboard
   - Heroku: `heroku logs --tail`
3. Restart your backend service if needed
4. Ensure you haven't exceeded free tier limits

### 4. Network or Firewall Issues

**Symptoms:**
- Connection issues on specific networks
- Works locally but not on certain connections

**Solution:**
1. Check if your backend is accessible from different networks
2. Verify that your deployment platform isn't blocked by your network
3. Try using a VPN or different network to test

## Advanced Troubleshooting

### Checking Backend Health

Use this command to check if your backend is responding:

```bash
curl -v https://your-backend-url.railway.app
```

You should see a 200 OK response with "Text-to-Image Generator API is running".

### Testing API Endpoints

Test the image generation endpoint directly:

```bash
curl -X POST https://your-backend-url.railway.app/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"test image", "model":"stable-diffusion"}'
```

### Debugging CORS Issues

To test if it's a CORS issue, you can temporarily disable CORS in your backend for testing (NEVER in production):

```javascript
// TEMPORARY FOR TESTING ONLY - REMOVE AFTER TESTING
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
```

## Environment-Specific Solutions

### Local Development

If you're running both frontend and backend locally:

1. Start backend: 
   ```bash
   cd backend
   npm run dev
   ```

2. Start frontend in a separate terminal:
   ```bash
   cd frontend
   npm start
   ```

3. Make sure frontend `.env` has:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

### Production Deployment

For deployed applications:

1. Update frontend `.env` with your deployed backend URL:
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app
   ```

2. Set the same environment variable in Netlify:
   - Go to Site settings > Build & deploy > Environment
   - Add variable: `REACT_APP_API_URL` with your backend URL
   - Trigger a new deployment

3. Update backend CORS to allow your Netlify domain:
   ```javascript
   app.use(cors({
     origin: ['https://your-frontend-domain.netlify.app'],
     methods: ['GET', 'POST'],
     credentials: true
   }));
   ```

## Still Having Issues?

If you've tried all the above solutions and still have connection issues:

1. Check if your API keys for Stability AI and OpenAI are valid
2. Verify that your backend is correctly configured to use these APIs
3. Look for any rate limiting or quota issues with these external APIs
4. Check for any platform-specific issues on Railway, Koyeb, or Netlify status pages 