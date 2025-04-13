# Text-to-Image Generator

A full-stack web application that generates images from text prompts using AI image generation APIs. The application consists of a React frontend and a Node.js/Express backend.

![Text-to-Image Generator](https://via.placeholder.com/800x400?text=Text-to-Image+Generator)

## Features

- Generate images from text descriptions using AI models
- Support for multiple AI providers (Stability AI and OpenAI DALL-E)
- Responsive design that works on all devices
- Image history and management
- Download generated images
- Secure API key storage with environment variables

## Project Structure

```
text-to-image-generator/
├── frontend/           # React frontend application
├── backend/            # Node.js/Express backend API
├── DEPLOYMENT.md       # Detailed deployment instructions
├── ALTERNATIVE-DEPLOYMENT.md  # Guide for Render, Vercel, and Heroku
└── BACKEND-CONNECTION.md      # Troubleshooting backend connection issues
```

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)
- API keys for image generation:
  - [Stability AI](https://stability.ai/)
  - [OpenAI](https://platform.openai.com/) (for DALL-E)

### Backend Setup

1. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your API keys:
   ```
   STABILITY_API_KEY=your_stability_ai_api_key
   OPENAI_API_KEY=your_openai_api_key
   ```

3. **Start the backend server**:
   ```bash
   npm run dev
   ```
   The server will run at http://localhost:5000

### Frontend Setup

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   For local development:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

3. **Start the frontend**:
   ```bash
   npm start
   ```
   The app will run at http://localhost:3000

## Detailed Setup Guides

For more detailed setup instructions, refer to these guides:

- [Backend Setup Guide](backend/README.md)
- [Frontend Setup Guide](frontend/README.md)

## Deployment Options

### Option 1: Railway & Netlify (Recommended)

We recommend deploying:
- Backend on [Railway](https://railway.app/)
- Frontend on [Netlify](https://netlify.com/)

For detailed deployment instructions, see:
- [Deployment Guide](DEPLOYMENT.md)

### Option 2: Alternative Platforms

The application can also be deployed on:
- Render
- Vercel
- Heroku

For alternative deployment instructions, see:
- [Alternative Deployment Guide](ALTERNATIVE-DEPLOYMENT.md)

## Troubleshooting

If you encounter issues:

1. **Backend Connection Problems**:
   - See [Backend Connection Troubleshooting](BACKEND-CONNECTION.md)

2. **Deployment Issues**:
   - For Railway/Netlify: See [DEPLOYMENT.md](DEPLOYMENT.md)
   - For other platforms: See [ALTERNATIVE-DEPLOYMENT.md](ALTERNATIVE-DEPLOYMENT.md)

3. **API Key Setup**:
   - Stability AI keys: https://stability.ai/
   - OpenAI keys: https://platform.openai.com/

## Environment Variables

### Backend Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Port the server runs on | No (default: 5000) |
| `STABILITY_API_KEY` | Stability AI API key | Yes |
| `OPENAI_API_KEY` | OpenAI API key | Yes |
| `NODE_ENV` | Environment (development/production) | No |

### Frontend Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_API_URL` | URL of the backend API | Yes |

## Development

### Development Mode Features

When running in development mode (`NODE_ENV=development`), the application includes:
- API Diagnostics tool for testing connections
- Enhanced logging
- Detailed error messages

These features are automatically disabled in production builds.

### Testing API Connections

In development mode, use the API Diagnostics tool to test:
- Backend connectivity
- API key validation
- Stability AI API connectivity
- OpenAI API connectivity

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 