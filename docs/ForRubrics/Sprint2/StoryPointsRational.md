## Sprint 2 Story Points Forecast + Why

Based on `docs/Sprint2.md` and `docs/Architecture.md` and current deveoplment status. the total forecast for Sprint 2 is **23 SP**.

### 1. Improved Matchmaking — 5 SP

This story is medium size because it changes the core matchmaking feature. It includes configurable weights, filtering, score calculation updates, API changes, and related testing. It touches both backend logic and frontend usage, so 5 points is reasonable.

### 2. Friend System — 6 SP

This story is bigger because it introduces a new social feature instead of only improving an existing one. It needs friend add/remove/list logic, data storage, API endpoints, and basic flow handling. Since it is a complete new module, 6 points makes sense.

### 3. Player Discovery — 3 SP

This is a smaller feature because the main task is searching and listing players. The logic is simpler than matchmaking or friend management, so 3 points is enough.

### 4. Visualization — 6 SP

Visualization is frontend-heavy and takes more effort than it first appears. It needs displaying matchmaking results in a clear way, connecting backend data to the UI, and making the feature understandable for users. Because of both UI work and data presentation, 6 points is reasonable.

### 5. Continuous Integration — 0.5 SP

This is a small setup task. It mainly involves configuring GitHub Actions so tests can run automatically, so half a point is appropriate.

### 6. Continuous Deployment — 0.5 SP

This is also a small infrastructure task. It focuses on automatic deployment setup rather than product logic, so 0.5 point is enough.

### 7. Test Expansion — 2 SP

This story is important but still limited in scope. It includes adding more unit tests, organizing test execution, and preparing 2 BDD scenarios. Since it supports the sprint features rather than adding a large new feature, 2 points is reasonable.

## Final Forecast

- Improved Matchmaking: 5 SP
- Friend System: 6 SP
- Player Discovery: 3 SP
- Visualization: 6 SP
- Continuous Integration: 0.5 SP
- Continuous Deployment: 0.5 SP
- Test Expansion: 2 SP

**Total: 23 SP**
