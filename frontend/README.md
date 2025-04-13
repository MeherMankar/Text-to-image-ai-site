# Text-to-Image Generator Frontend

This is the frontend application for the Text-to-Image Generator. It provides a user interface for generating images from text prompts using various AI models.

## Technologies Used

- React.js
- Tailwind CSS for styling
- Axios for API requests
- React Toastify for notifications

## Detailed Setup Guide

### Prerequisites

Before starting, ensure you have:
- Node.js version 18 or higher installed
- npm version 8 or higher installed
- The backend server set up and running

### 1. Installation

First, install all the required dependencies:

```bash
npm install
```

This will install React, Tailwind CSS, and all other packages listed in `package.json`.

### 2. Environment Configuration

Create a `.env` file by copying the example:

```bash
cp .env.example .env
```

Then, edit the `.env` file:

```
REACT_APP_API_URL=http://localhost:5000
```

- For local development, set this to your local backend URL (typically http://localhost:5000)
- For production, set this to your deployed backend URL (e.g., https://your-api.railway.app)

### 3. Running the Application

#### Development Mode

Start the development server:

```bash
npm start
```

This will run the app in development mode at [http://localhost:3000](http://localhost:3000).

The page will reload automatically when you make changes to the code. You will also see any lint errors in the console.

#### Production Build

To create an optimized production build:

```bash
npm run build
```

This builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

To test the production build locally, you can use a static server:

```bash
npm install -g serve
serve -s build
```

### 4. Project Structure

```
frontend/
├── public/                 # Static files
│   ├── index.html          # HTML template
│   ├── manifest.json       # Web app manifest
│   └── favicon.ico         # Favicon
├── src/                    # Source code
│   ├── components/         # React components
│   │   ├── Header.js       # Header component
│   │   ├── Footer.js       # Footer component
│   │   ├── ImageGenerator.js # Image generation form
│   │   └── ImageGallery.js # Gallery to display images
│   ├── App.js              # Main App component
│   ├── index.js            # JavaScript entry point
│   └── index.css           # Global CSS (includes Tailwind)
├── .env.example            # Example environment variables
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
└── netlify.toml            # Netlify deployment config
```

### 5. Customizing the Application

#### Modifying the UI

The application uses Tailwind CSS for styling. You can customize the appearance by:

1. Editing the Tailwind configuration in `tailwind.config.js`
2. Modifying component JSX and CSS classes
3. Adding custom CSS in `index.css`

#### Adding New Features

To add new features:

1. Create new components in the `src/components/` directory
2. Import and use them in `App.js` or other components
3. Add state management as needed using React hooks

### 6. Deployment to Netlify

#### Using the Netlify CLI

1. Create a Netlify account if you don't have one
2. Install the Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

3. Login to Netlify:
   ```bash
   netlify login
   ```

4. Build your application:
   ```bash
   npm run build
   ```

5. Initialize a new Netlify site:
   ```bash
   netlify init
   ```

6. Follow the prompts to set up your site:
   - Select "Create & configure a new site"
   - Choose your team
   - Provide a site name (or accept the generated one)
   - Set the deploy path to "build"

7. Deploy to Netlify:
   ```bash
   netlify deploy
   ```

8. For production deployment:
   ```bash
   netlify deploy --prod
   ```

#### Using the Netlify Web Interface

1. Build your application:
   ```bash
   npm run build
   ```

2. Go to [https://app.netlify.com/](https://app.netlify.com/)
3. Drag and drop your `build` folder to the Netlify interface
4. Configure your site settings

#### Setting Environment Variables on Netlify

It's crucial to set the correct API URL in your Netlify deployment:

1. Go to your site dashboard on Netlify
2. Navigate to Site settings > Build & deploy > Environment
3. Add a new variable:
   - Key: `REACT_APP_API_URL`
   - Value: Your deployed backend URL (e.g., https://your-api.railway.app)
4. Click "Save"
5. Trigger a new deploy for the changes to take effect

### 7. Using the Application

#### Generating Images

1. Enter a descriptive prompt in the text area
   - Be specific and detailed for better results
   - Examples:
     - "A photorealistic mountain landscape at sunset with purple and orange sky"
     - "A digital illustration of a futuristic city with flying cars and neon lights"

2. Select an AI model:
   - **Stable Diffusion**: Good for artistic and creative images
   - **DALL-E**: Good for photorealistic and precise concept images

3. Click "Generate Image" and wait for the result
   - Generation typically takes 5-15 seconds depending on the complexity
   - The image will appear in the gallery when complete

#### Managing Generated Images

1. **View Images**: All generated images appear in the gallery section
2. **Download Images**: Click "Download" to save an image to your device
3. **Delete Images**: Click "Delete" to remove an image from the gallery
   - Note: This only removes it from your local history, not from the AI provider

#### Images are Saved Locally

The application stores your generated images in your browser's local storage, which means:
- Images persist between sessions on the same device
- Images are not shared between devices
- Clearing browser data will remove your image history

## Troubleshooting

### Common Issues

1. **"Failed to connect to the server" error**:
   - Ensure your backend server is running
   - Check that REACT_APP_API_URL is set correctly in .env
   - Verify network connectivity between frontend and backend

2. **Images not generating**:
   - Check the browser console for errors
   - Verify API keys are working on the backend
   - Try a different prompt or model

3. **Slow image generation**:
   - Image generation can take time depending on server load
   - The first request might be slower due to cold starts
   - Complex prompts may take longer to process

### Development Tips

1. **React Developer Tools**: Install the React Developer Tools browser extension for easier debugging
2. **Network Tab**: Use your browser's network tab to inspect API requests and responses
3. **Local Storage**: You can view stored images in your browser's devtools under Application > Local Storage 