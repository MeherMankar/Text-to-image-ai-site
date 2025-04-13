# Docker Deployment Guide

This guide provides instructions for deploying the Text-to-Image Generator application using Docker and various cloud platforms.

## Table of Contents

1. [Docker Setup](#docker-setup)
2. [Local Development with Docker](#local-development-with-docker)
3. [Deployment Options](#deployment-options)
   - [Railway Deployment](#railway-deployment)
   - [Heroku Deployment](#heroku-deployment)
   - [Koyeb Deployment](#koyeb-deployment)
   - [DigitalOcean App Platform](#digitalocean-app-platform)
4. [CI/CD Setup](#cicd-setup)
5. [Environment Variables](#environment-variables)

---

## Docker Setup

The application includes Docker configuration for both the frontend and backend components, making it easy to containerize and deploy to various platforms.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed on your machine
- [Docker Compose](https://docs.docker.com/compose/install/) for local development

### Project Structure for Docker

```
text-to-image-generator/
├── docker-compose.yml         # Configuration for local Docker development
├── .github/workflows/         # GitHub Actions workflows for CI/CD
├── frontend/
│   ├── Dockerfile             # Frontend Docker configuration
│   ├── .dockerignore          # Files to exclude from Docker image
│   └── nginx.conf             # Nginx configuration for the React app
└── backend/
    ├── Dockerfile             # Backend Docker configuration
    ├── .dockerignore          # Files to exclude from Docker image
    ├── Procfile               # For Heroku deployment
    ├── app.json               # Heroku app configuration
    └── koyeb.yaml             # Koyeb configuration
```

## Local Development with Docker

The easiest way to run the entire application locally is using Docker Compose:

1. Make sure you have your environment variables ready:

   Create a `.env` file in the project root with:
   ```
   STABILITY_API_KEY=your_stability_api_key
   OPENAI_API_KEY=your_openai_api_key
   ```

2. Start the application:
   ```bash
   docker-compose up
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

4. For development with live reloading:
   ```bash
   docker-compose up -d
   ```
   This runs in detached mode, and changes to your code will trigger automatic rebuilds.

5. To shut down:
   ```bash
   docker-compose down
   ```

## Deployment Options

### Railway Deployment

Railway offers an easy way to deploy containerized applications.

1. Install the Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login to Railway:
   ```bash
   railway login
   ```

3. Initialize a new project:
   ```bash
   railway init
   ```

4. Add your environment variables:
   ```bash
   railway variables set STABILITY_API_KEY=your_stability_key OPENAI_API_KEY=your_openai_key
   ```

5. Deploy using the railway.json configuration:
   ```bash
   railway up
   ```

Alternatively, you can connect your GitHub repository to Railway for automatic deployments.

### Heroku Deployment

Heroku supports Docker deployments, making it easy to deploy the application.

#### Backend Deployment

1. Install the Heroku CLI:
   ```bash
   npm install -g heroku
   ```

2. Login to Heroku:
   ```bash
   heroku login
   ```

3. Create a new Heroku app:
   ```bash
   heroku create your-app-name
   ```

4. Set environment variables:
   ```bash
   heroku config:set STABILITY_API_KEY=your_stability_key OPENAI_API_KEY=your_openai_key
   ```

5. Deploy the Docker container:
   ```bash
   cd backend
   heroku container:push web
   heroku container:release web
   ```

### Koyeb Deployment

Koyeb provides a simple way to deploy Docker containers.

1. Install the Koyeb CLI:
   ```bash
   curl -fsSL https://cli.koyeb.com/install.sh | sh
   ```

2. Login to Koyeb:
   ```bash
   koyeb login
   ```

3. Create secrets for your API keys:
   ```bash
   koyeb secrets create stability-api-key --value "your_stability_key"
   koyeb secrets create openai-api-key --value "your_openai_key"
   ```

4. Deploy the backend using the koyeb.yaml file:
   ```bash
   cd backend
   koyeb app init
   ```

5. Follow the prompts to configure your deployment, referencing the settings in koyeb.yaml.

### DigitalOcean App Platform

DigitalOcean's App Platform also supports Docker deployments:

1. Create a new app on the [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)

2. Select "Deploy from Docker Hub" or "Deploy from GitHub"

3. Configure the build and run settings:
   - For the backend:
     - Dockerfile path: `backend/Dockerfile`
     - HTTP port: 5000
   - For the frontend:
     - Dockerfile path: `frontend/Dockerfile`
     - HTTP port: 80

4. Add your environment variables in the App Platform dashboard

5. Deploy the application

## CI/CD Setup

The project includes a GitHub Actions workflow for CI/CD in `.github/workflows/ci-cd.yml`. This workflow:

1. Runs tests on both frontend and backend
2. Builds the applications
3. Has commented sections for deploying to various platforms

To enable automated deployments:

1. Uncomment the relevant deployment section in the workflow file
2. Add the required secrets to your GitHub repository:
   - For Railway: `RAILWAY_TOKEN`
   - For Heroku: `HEROKU_API_KEY`, `HEROKU_EMAIL`
   - For Koyeb: `KOYEB_TOKEN`
   - For Netlify: `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`
   - General: `BACKEND_URL` (the URL of your deployed backend API)

## Environment Variables

### Backend Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Port for the backend server | No (default: 5000) |
| `NODE_ENV` | Environment (development, production) | No (default: development) |
| `STABILITY_API_KEY` | Your Stability AI API key | Yes |
| `OPENAI_API_KEY` | Your OpenAI API key | Yes |

### Frontend Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_API_URL` | URL of the backend API | Yes |

## Customizing Docker Configuration

### Backend Dockerfile Customization

You can modify `backend/Dockerfile` to customize the backend container:

- Change the base image for different Node.js versions
- Add additional dependencies
- Modify the exposed port

### Frontend Dockerfile Customization

The frontend `frontend/Dockerfile` uses a multi-stage build:

1. Build stage: Compiles the React application
2. Production stage: Serves the built files using Nginx

You can customize:
- The Nginx configuration in `frontend/nginx.conf`
- Build arguments and environment variables
- Caching and optimization settings 