# API (Express + MongoDB)

Base URL: `http://localhost:3000/api`

## Health
- `GET /health`
- Response: `{ "status": "ok" }`

## Auth
- `POST /auth/register`
- Body: `{ "username": "alice", "password": "pw" }`
- Response: `{ "id", "username", "createdAt" }`

- `POST /auth/login`
- Body: `{ "username": "alice", "password": "pw" }`
- Response: `{ "token", "user": {"id", "username"} }`

## Profile
- `PUT /profile/:userId`
- Body:
  - `skillScore`: number (0-100)
  - `behaviorMetrics`: object (0-100 scale)
  - `preferences`: object
- Response: profile document

- `GET /profile/:userId`
- Response: profile document

## Matchmaking
- `GET /matchmaking/:userId`
- Query params:
  - `limit`: positive integer, default `5`
  - `wSkill`: non-negative number
  - `wBehavior`: non-negative number
  - `wPreference`: non-negative number
  - `maxSkillGap`: non-negative number
  - `region`: string
  - `gameMode`: string
  - `playStyle`: string
- Response:
  - `matches`: array of
    - `userId`
    - `totalScore`
    - `breakdown.skillSimilarity`
    - `breakdown.behaviorSimilarity`
    - `breakdown.preferenceCompatibility`

## Friends (scaffold)
- `POST /friends`
- `GET /friends/:userId`

## Groups (scaffold)
- `POST /groups`
- `GET /groups`

## Discovery (scaffold)
- `GET /discovery?q=alice`
