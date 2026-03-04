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
