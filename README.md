# SWE6813-Spring-Team3

# Behavior-Aware Matchmaking Web App

Stack aligned with your requirement:
- Frontend: React + Material UI (Vite)
- Backend: Node.js + Express
- Database: MongoDB (Docker)

## Project Structure

- `frontend/`: React app (MUI)
- `service/`: REST backend (Express + Mongoose)
- `docs/`: architecture and sprint documents
- `docker-compose.yml`: MongoDB container

## 1) Start MongoDB (Docker)

```bash
docker compose up -d mongo
```

Mongo is exposed at `mongodb://127.0.0.1:27017/matching_system`.

## 2) Start Backend

```bash
cd service
cp .env.example .env
npm install
npm run dev
```

Backend API: `http://localhost:3000/api`

## 3) Start Frontend (React + MUI)

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

If backend address changes, set `VITE_API_BASE`.

## Test Backend

```bash
cd service
npm test
```

## Deploy On Render

This repository includes a root-level [render.yaml](/Users/shenyukang/StudioSpace/Course/MatchingSystem/render.yaml) for Render Blueprint deploys.

### Services

- `matching-system-api`: Render Web Service for `service/`
- `matching-system-frontend`: Render Static Site for `frontend/`

### Required Environment Variables

For `matching-system-api`:

- `MONGO_URI`: your MongoDB Atlas connection string
- `CORS_ORIGIN`: your frontend Render URL, for example `https://matching-system-frontend.onrender.com`

For `matching-system-frontend`:

- no manual value is required when using the included Blueprint
- `VITE_API_ORIGIN` is populated from the backend service's `RENDER_EXTERNAL_URL`

### Recommended Deploy Order

1. Create a MongoDB Atlas free cluster.
2. In Render, create a new Blueprint from this repository.
3. During setup, provide `MONGO_URI` for the API service.
4. Complete the initial deploy.
5. Copy the generated frontend URL and set `CORS_ORIGIN` on `matching-system-api`.
6. Redeploy the API service.

### Manual Render Setup

- Frontend
  - Root directory: `frontend`
  - Build command: `npm ci && npm run build`
  - Publish directory: `dist`
  - Environment variable: `VITE_API_BASE=https://<your-api-service>.onrender.com/api`
- Backend
  - Root directory: `service`
  - Build command: `npm ci`
  - Start command: `npm start`
  - Health check path: `/api/health`
  - Environment variables: `MONGO_URI`, `CORS_ORIGIN`
