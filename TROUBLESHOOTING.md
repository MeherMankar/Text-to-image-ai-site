# Troubleshooting Guide

This guide addresses common issues you might encounter while setting up, running, or deploying the Text-to-Image Generator application.

## Table of Contents

1. [Backend Issues](#backend-issues)
2. [Frontend Issues](#frontend-issues)
3. [Deployment Issues](#deployment-issues)
4. [API and Image Generation Issues](#api-and-image-generation-issues)
5. [Performance Optimization](#performance-optimization)

---

## Backend Issues

### Backend Won't Start

**Symptoms:**
- Error messages when running `npm start` or `npm run dev`
- The server crashes immediately after starting

**Solutions:**

1. **Port already in use:**
   ```
   Error: listen EADDRINUSE: address already in use :::5000
   ```
   
   Fix:
   - Change the port in your `.env` file
   - Kill the process using the port:
     ```bash
     # Find the process
     lsof -i :5000
     
     # Kill it
     kill -9 [PID]
     ```

2. **Missing dependencies:**
   ```
   Error: Cannot find module 'express'
   ```
   
   Fix:
   ```bash
   npm install
   ```

3. **Node version issue:**
   ```
   SyntaxError: Unexpected token ...
   ```
   
   Fix:
   ```bash
   # Check your Node version
   node -v
   
   # Install or upgrade to Node.js 18+
   # Using nvm (recommended):
   nvm install 18
   nvm use 18
   ```

### Environment Variables Not Loading

**Symptoms:**
- "API key not configured" errors
- Environment variables are undefined

**Solutions:**

1. **Missing .env file:**
   ```bash
   cp .env.example .env
   ```

2. **Incorrect .env format:**
   - Ensure there are no spaces around the equals sign
   - No quotes around values unless part of the actual value
   - No trailing spaces

   Correct format:
   ```
   KEY=value
   ```

3. **dotenv not loading:**
   - Make sure `require('dotenv').config()` is at the top of your server.js file
   - Try using an absolute path:
     ```javascript
     require('dotenv').config({ path: path.resolve(__dirname, '.env') })
     ```

### CORS Errors

**Symptoms:**
- Frontend cannot connect to backend
- Browser console shows CORS errors

**Solutions:**

1. **Configure CORS properly:**
   
   Replace the simple CORS configuration:
   ```javascript
   app.use(cors());
   ```
   
   With a more specific one:
   ```javascript
   app.use(cors({
     origin: process.env.NODE_ENV === 'production' 
       ? 'https://your-frontend-domain.netlify.app' 
       : 'http://localhost:3000',
     methods: ['GET', 'POST'],
     credentials: true
   }));
   ```

2. **Multiple origins:**
   ```javascript
   const allowedOrigins = [
     'http://localhost:3000',
     'https://your-frontend-domain.netlify.app'
   ];
   
   app.use(cors({
     origin: function(origin, callback) {
       if (!origin || allowedOrigins.indexOf(origin) !== -1) {
         callback(null, true);
       } else {
         callback(new Error('Not allowed by CORS'));
       }
     },
     credentials: true
   }));
   ```

---

## Frontend Issues

### Build Fails

**Symptoms:**
- Error messages when running `npm run build`
- Build process exits with non-zero code

**Solutions:**

1. **Missing dependencies:**
   ```bash
   npm install
   ```

2. **Clear cache and node_modules:**
   ```bash
   rm -rf node_modules
   rm -rf build
   npm cache clean --force
   npm install
   ```

3. **ESLint errors:**
   - Fix the reported issues in your code
   - Or temporarily disable linting for build:
     ```bash
     DISABLE_ESLINT_PLUGIN=true npm run build
     ```

### API Connection Errors

**Symptoms:**
- "Failed to connect to the server" errors
- Network errors in console

**Solutions:**

1. **Check environment variables:**
   - Verify `REACT_APP_API_URL` is set correctly in `.env`
   - For local development: `REACT_APP_API_URL=http://localhost:5000`
   - For production: `REACT_APP_API_URL=https://your-backend-url.com`

2. **Test API manually:**
   ```bash
   curl http://localhost:5000
   ```

3. **Cross-origin issues:**
   - Open browser console (F12) to check for CORS errors
   - Ensure the backend CORS configuration includes your frontend URL

4. **Request format:**
   - Check that your requests match the expected format
   - Verify all required fields are included

### Images Not Displaying

**Symptoms:**
- Blank space where image should appear
- Broken image icon

**Solutions:**

1. **Check network requests:**
   - Open browser developer tools > Network tab
   - Look for failed requests or errors

2. **Invalid image data:**
   - Check that the backend is returning valid image data
   - Verify the response format is correct (base64 or URL)

3. **Content Security Policy:**
   - If using base64 images, check for CSP blocking
   - Add appropriate headers if needed:
     ```html
     <meta http-equiv="Content-Security-Policy" content="img-src 'self' data: https:;">
     ```

4. **CORS for image URLs:**
   - If the image URL is from a third-party domain, it might be blocked
   - Consider proxying the image through your backend

---

## Deployment Issues

### Railway Deployment Issues

**Symptoms:**
- Deployment fails
- Application crashes after deployment

**Solutions:**

1. **Environment variables:**
   - Set all required environment variables in Railway dashboard
   - Don't put quotes around values

2. **Node version:**
   - Ensure package.json includes:
     ```json
     "engines": {
       "node": ">=18.0.0"
     }
     ```

3. **Deploy logs:**
   ```bash
   railway logs
   ```

4. **Restart service:**
   ```bash
   railway service restart
   ```

### Koyeb Deployment Issues

**Symptoms:**
- Deployment fails
- Application doesn't start

**Solutions:**

1. **Build configuration:**
   - Verify build command: `npm install`
   - Verify start command: `npm start`

2. **Environment variables:**
   - Set all required variables in Koyeb dashboard
   - Check for any typos or formatting issues

3. **Check logs:**
   - View logs in Koyeb dashboard
   - Look for specific error messages

### Netlify Deployment Issues

**Symptoms:**
- Build fails
- Page not found errors

**Solutions:**

1. **Build command and directory:**
   - Build command: `npm run build`
   - Publish directory: `build`

2. **Environment variables:**
   - Set `REACT_APP_API_URL` to your backend URL
   - Variables must be prefixed with `REACT_APP_`

3. **Redirects:**
   - Ensure you have a proper `netlify.toml` or `_redirects` file:
     ```
     /*    /index.html   200
     ```

4. **Deploy previews:**
   - Use `netlify deploy` for test previews
   - Use `netlify deploy --prod` for production

---

## API and Image Generation Issues

### API Key Errors

**Symptoms:**
- Authentication error messages
- "Invalid API key" errors

**Solutions:**

1. **Check your API keys:**
   - Verify keys in `.env` file are correct
   - Look for typos or extra spaces
   - Ensure keys have proper permissions

2. **Rate limiting or quotas:**
   - Check if you've hit API usage limits
   - Consider upgrading your API tier if needed

3. **Test API keys directly:**
   - For Stability AI:
     ```bash
     curl -H "Authorization: Bearer YOUR_API_KEY" \
       https://api.stability.ai/v1/engines/list
     ```
   - For OpenAI:
     ```bash
     curl -H "Authorization: Bearer YOUR_API_KEY" \
       https://api.openai.com/v1/models
     ```

### Generation Failures

**Symptoms:**
- "Failed to generate image" errors
- Timeouts during generation

**Solutions:**

1. **Check prompt content:**
   - Some content may be filtered by the AI providers
   - Try a different prompt to see if it works

2. **API response errors:**
   - Check server logs for detailed error messages
   - Add more error logging to identify issues

3. **Request parameters:**
   - Try reducing image size (512x512 instead of 1024x1024)
   - Simplify other parameters

4. **Provider status:**
   - Check status pages for API providers:
     - https://status.stability.ai/
     - https://status.openai.com/

---

## Performance Optimization

### Slow Image Generation

**Symptoms:**
- Image generation takes a long time
- Requests timeout

**Solutions:**

1. **Optimize backend:**
   - Add caching for repeated requests
   - Implement request queuing for high traffic

2. **Optimize parameters:**
   - Reduce image dimensions
   - For Stable Diffusion, reduce steps parameter

3. **Server resources:**
   - Upgrade your deployment plan for more resources
   - Consider regional deployment closer to your users

### High API Costs

**Symptoms:**
- Quickly using up API credits
- High billing

**Solutions:**

1. **Implement caching:**
   - Store generated images with their prompts
   - Return cached results for identical prompts

2. **Rate limiting:**
   - Add more restrictive rate limiting
   - Implement user quotas if applicable

3. **Optimize API usage:**
   - Use smaller image sizes when possible
   - Batch requests if the API supports it

### Frontend Performance Issues

**Symptoms:**
- Slow page loading
- High memory usage

**Solutions:**

1. **Image optimization:**
   - Implement lazy loading for gallery images:
     ```jsx
     <img loading="lazy" src={imageUrl} alt={prompt} />
     ```
   
   - Consider compressing images before storing

2. **Local storage management:**
   - Limit the number of images stored in local storage
   - Implement cleanup for old entries

3. **Code splitting:**
   - Use React's lazy loading for components:
     ```javascript
     const ImageGallery = React.lazy(() => import('./components/ImageGallery'));
     ``` 