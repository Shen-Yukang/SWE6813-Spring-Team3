# Architecture.md
Traditional online matchmaking systems focus primarily on skill metrics (e.g., rank or win rate). However, players with similar skill levels may still experience poor team compatibility due to differences in play style, communication preference, or competitive attitude.

This project addresses this issue by introducing behavior-aware matchmaking that considers both skill and player preferences, and we will focus on designing and implementing a minimal RESTful web service to support BehaviorAware Player Matching.

The system will expose structured API endpoints for managing player resources and retrieving compatible matches. The emphasis is on REST architecture, service modularity, stateless communication, and client server interaction rather than aim at complex UI or advanced algorithms (such AI recommendation sys).

## System Overview

The Behavior‑Aware Matchmaking Web App improves online gaming matchmaking by incorporating:

- skill level
- player behavior
- preferences

The system provides:
- player discovery
- matchmaking recommendations
- friend management
- group formation
- simple data visualization

## Architectural Style

Modular Monolithic Architecture

This keeps deployment simple while maintaining internal separation.

## Repository Structure

repo/

service/
  src/
    app.js
    server.js
    config/
    routes/
    controllers/
    services/
    repositories/
    models/
    middlewares/
    utils/
    logging/

frontend/
  src/
    pages/
    components/
    api/
    charts/

docs/
  architecture.md
  api.md
  change-log.md
  sprints/

.github/workflows/

## Layer Responsibilities

Routes
- define API endpoints

Controllers
- request validation
- response formatting

Services
- business logic
- matchmaking logic

Repositories
- database queries

Models
- schema definitions

Utils
- pure reusable functions

Logging
- centralized structured logging

## Domain Modules

Auth
Profile
Matchmaking
Friends
Groups
Discovery

Each module should have:

routes
controller
service
repository
model

## Data Models

User
- id
- username
- passwordHash
- createdAt

Profile
- userId
- skillScore
- behaviorMetrics
- preferences

FriendEdge
- userId
- friendUserId

Group
- id
- ownerId
- memberIds

## Matchmaking Algorithm

score = w_skill * skillSimilarity + w_behavior * behaviorSimilarity

Where

skillSimilarity =
1 - normalized difference between skill scores

behaviorSimilarity =
average similarity across behavior metrics

Return a ranked list of players.