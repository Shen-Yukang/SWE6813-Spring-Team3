# Change Log

## 2026-03-03
- Initialized modular monolith service skeleton.
- Added Sprint1 prototype endpoints: auth, profile, matchmaking.
- Added pure matchmaking scoring utility with skill + behavior similarity.
- Added structured request logging middleware.
- Added baseline automated tests (unit + BDD).

## 2026-03-04
- Migrated backend persistence from in-memory to MongoDB via Mongoose.
- Converted service layer and controllers to async database workflow.
- Added Docker Compose for MongoDB local environment.
- Upgraded frontend to React + Material UI (Vite).
- Updated tests to run against `mongodb-memory-server`.
