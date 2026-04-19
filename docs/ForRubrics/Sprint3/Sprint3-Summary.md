# Sprint 3 Submission Summary — Group 3 (SWE 6813, Spring 2026)

**GitHub Repository:** https://github.com/Shen-Yukang/MatchingSystem
**Live prototype URL**: https://matching-system-frontend.onrender.com/

---

## 1. Story Points Forecast (10 pts)

**Forecast: 21 SP** — based on Yesterday's Weather. Sprint 2 velocity was 23 SP, and the Sprint 3 forecast was adjusted slightly to account for end-of-project integration and submission overhead.

**Rationale document:**
→ [`docs/ForRubrics/Sprint3/StoryPointsRational.md`](../Sprint3/StoryPointsRational.md)

---

## 2. Stories Decomposed into Tasks (5 pts)

All Sprint 3 stories were decomposed into concrete tasks with status tracking.

**Task breakdown document:**
→ [`docs/ForRubrics/Sprint3/DetailSubTask.md`](../Sprint3/DetailSubTask.md)

---

## 3. Kanban Board (10 pts)

**Screenshot:**
→ `docs/ForRubrics/Sprint3/KanbanBoard.png`

---

## 4. Sprint Burndown Chart (10 pts)

The burndown chart tracks sprint progress across the full sprint window, from 21 remaining story points down to 0.

**Burndown chart screenshot:**
→ `docs/ForRubrics/Sprint3/BurndownChart.png`

---

## 5. Meeting Records (10 pts)

Two Sprint 3 meeting records are included to document progress review, remaining work, and final delivery preparation.

**Meeting records:**
→ [`docs/ForRubrics/Sprint3/MeetingSummary.md`](../Sprint3/MeetingSummary.md)

---

## 6. Pair / Mob Programming Evidence (10 pts)

**Evidence screenshot:**
→ `docs/ForRubrics/Sprint3/Pair_Programming_Evidence.png`

---

## 7. Test-First Development — BDD + Unit Tests (10 pts)

Sprint 3 includes behavior-focused scenarios together with supporting controller, integration, and service-level tests.

**BDD / A-TDD scenarios:**

| Scenario | Feature File | Status |
|---|---|---|
| Player gets ranked recommendations using skill and behavior | `service/tests/bdd/matchmaking.feature` | Pass |
| Player gets filtered recommendations by region and game mode | `service/tests/bdd/matchmaking.feature` | Pass |
| **[NEW]** Player searches by username and region filter | `service/tests/bdd/discovery.feature` | Pass |

**Automated test summary:**

| Suite | Tests | New This Sprint |
|---|---|---|
| `matchScoring.test.js` | Included | Existing coverage retained |
| `matchmakingController.test.js` | Included | Existing coverage retained |
| **[NEW]** `discoveryController.test.js` | 6 | **6** |
| integration + BDD suites | Included | Expanded in Sprint 3 |
| **Total** | **53** | Expanded in Sprint 3 |

**Test results log:**
→ [`docs/ForRubrics/Sprint3/TestResult.log`](../Sprint3/TestResult.log)

**Run command:**
```
cd service && npm run test:all
```

---

## 8. Continuous Integration (5 pts)

GitHub Actions CI runs on every push and pull request targeting `main`:
- Runs backend unit tests (`npm test`)
- Runs frontend build (`npm run build`)
- Triggers CD deploy on success

**CI workflow file:** [`/.github/workflows/ci.yml`](../../../.github/workflows/ci.yml)

**GitHub Actions runs:** https://github.com/Shen-Yukang/MatchingSystem/actions

---

## 9. Continuous Deployment (10 pts)

The CD system (Render) automatically deploys both backend and frontend after successful merges to `main`:
- Backend deployed to Render (Node.js service)
- Frontend deployed to Render (static site)
- Deploy is triggered via Render webhook called from GitHub Actions

**Live production URL:** https://matching-system-frontend.onrender.com/

**Sample test accounts:**

| Username | Password |
|---|---|
| p1 | 123 |
| p2 | 123 |
| p3 | 123 |

**CD evidence screenshot:**
→ `docs/ForRubrics/Sprint3/CICD.png`

---

## 10. Sprint Review (5 pts)

Sprint Review was conducted on April 18, 2026. The product increment was demonstrated end-to-end in the production environment, and the Sprint 3 deliverables were reviewed against the planned goals.

**Sprint Review notes:**
→ [`docs/ForRubrics/Sprint3/SprintReview.md`](../Sprint3/SprintReview.md)

---

## 11. Complete Software Solution (10 pts)

The complete software solution includes working functionality delivered across Sprint 1, Sprint 2, and Sprint 3:

| Sprint | Feature | Status |
|---|---|---|
| Sprint 1 | User Registration & Auth | ✅ Live |
| Sprint 1 | Player Profile (skill, behavior, preferences) | ✅ Live |
| Sprint 1 | Basic Matchmaking | ✅ Live |
| Sprint 2 | Improved Matchmaking (configurable weights + filters) | ✅ Live |
| Sprint 2 | Friend System (add / list friends) | ✅ Live |
| Sprint 2 | Player Discovery (search by name, filters) | ✅ Live |
| Sprint 2 | Visualization support for matchmaking results | ✅ Live |
| Sprint 3 | Refine — Matchmaking Logic & API (edge cases, scoring fairness) | ✅ Live |
| Sprint 3 | Refine — Friend System (add/remove/list friends) | ✅ Live |
| Sprint 3 | Refine — Cross-game Player Discovery (filters, lookup) | ✅ Live |
| Sprint 3 | Refine — Visualization and final presentation support | ✅ Live |
| Sprint 3 | Testing Increment Final (53 tests) | ✅ Done |

**Live prototype URL:** https://matching-system-frontend.onrender.com/

**Test accounts:** see the sample accounts listed in Section 9 above.

---

## 12. APIs / Web Services Used (Teacher Requirement)

| Service | Purpose | URL |
|---|---|---|
| **Render (Backend)** | Node.js/Express API hosting | https://matching-system-api.onrender.com/api |
| **Render (Frontend)** | React static site hosting | https://matching-system-frontend.onrender.com/ |
| **GitHub Actions** | CI/CD pipeline | https://github.com/Shen-Yukang/MatchingSystem/actions |
| **MongoDB Atlas** | Production database | https://www.mongodb.com/atlas |
| **In-memory MongoDB** | Test database (jest) | N/A — local only |

**Internal REST API base URL:** `https://matching-system-api.onrender.com/api`

Key endpoints:
- `POST /api/auth/register` — user registration
- `POST /api/auth/login` — login
- `PUT /api/profile/:userId` — upsert player profile
- `GET /api/matchmaking/:userId` — get ranked match recommendations
- `GET /api/discovery` — search players
- `POST /api/friends` / `GET /api/friends/:userId` — friend management
- `POST /api/groups` / `GET /api/groups` — group management

Full API reference: [`docs/api.md`](../../api.md)

---

## 13. Team Video Presentation (5 pts)

**Video file:** `docs/Group3-SWE6813-Spring2026.mp4` (also uploaded directly to course submission)

Duration: approximately 15–20 minutes. Content includes sprint goals, rubric walkthrough, team roles, Scrum practices, and the working product demonstration.

---

## Submission Checklist

- [x] GitHub repository URL
- [x] Story points forecast (Yesterday's Weather)
- [x] Stories decomposed into tasks
- [x] Kanban board screenshot (`KanbanBoard.png`)
- [x] Burndown chart (`BurndownChart.png`)
- [x] Sprint 3 meeting records
- [x] Pairing/mobbing evidence (`Pair_Programming_Evidence.png`)
- [x] 53 tests passing, with Sprint 3 test expansion included
- [x] 3 BDD scenarios passing, 1 new this sprint
- [x] CI evidence (GitHub Actions link)
- [x] CD evidence (`CICD.png`)
- [x] Sprint Review notes
- [x] Complete product demo (all sprints)
- [x] Live prototype URL + test accounts
- [x] Video uploaded directly to course submission
