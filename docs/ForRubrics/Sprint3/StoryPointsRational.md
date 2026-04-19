# Sprint 3 Story Points Forecast + Rationale

## Yesterday's Weather Basis

Sprint 1 completed: **18 SP**
Sprint 2 completed: **23 SP**

Following the Yesterday's Weather forecasting pattern, we use the most recent sprint velocity as our forecast. Sprint 2 completed 23 story points. Sprint 3 scope is focused on refining existing features rather than introducing new ones, so the forecast is **21 SP**.

---

## Story Breakdown

### 1. Refine — Matchmaking Logic & API — 5 SP

Continued improvement of the core matchmaking engine. Covers edge-case handling (missing profiles, empty candidate pools), scoring fairness for partial `behaviorMetrics`, and API response consistency. Touches both backend logic and related unit tests.

### 2. Refine — Friend System (Add/Remove/List friends) — 4 SP

Polish and stabilize the friend feature introduced in Sprint 2. Includes remove-friend support, improved list ordering, and ensuring the feature is fully functional in the production environment.

### 3. Refine — Cross-game Player Discovery (Search/Lookup) — 4 SP

Extend and stabilize the player discovery feature. Covers additional filter combinations, better empty-state handling in the UI, and new unit/BDD test coverage for the discovery controller.

### 4. Refine — Visualization (final version) — 4 SP

Finalize the visualization dashboard. Adds skill score distribution chart and match score breakdown chart, connects them to live API data, and integrates into the production build.

### 5. Testing Increment Final — 4 SP

Reach final test coverage requirements: ≥30 unit tests (10 new this sprint) and ≥3 BDD scenarios (1 new this sprint). Includes writing `discoveryController` unit tests and a new player discovery BDD scenario. Verify all tests pass with `npm run test:all`.

---

## Final Forecast

| Story | SP |
|---|---|
| Refine — Matchmaking Logic & API | 5 |
| Refine — Friend System | 4 |
| Refine — Cross-game Player Discovery | 4 |
| Refine — Visualization (final version) | 4 |
| Testing Increment Final | 4 |
| **Total** | **21 SP** |
