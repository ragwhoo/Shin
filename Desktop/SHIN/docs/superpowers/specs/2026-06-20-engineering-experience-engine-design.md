# Engineering Experience Engine — Corrected Design Spec (V1)

## Vision

Current AI agents have knowledge but no experience.

They repeatedly solve the same problems across projects because they do not accumulate engineering judgment.

The Engineering Experience Engine introduces a persistent judgment layer between a task and an agent's planning process.

The goal is not memory retrieval.

The goal is improving planning through accumulated engineering experience.

---

# Core Principle

The agent never plans first.

Every task must pass through the Experience Engine before planning.

```text
Task
 ↓
Concept Resolution
 ↓
Evidence Discovery
 ↓
Reflection
 ↓
Judgment Package
 ↓
Planning
 ↓
Execution
 ↓
Learning
```

---

# Repository Structure

## Repository 1: Experience Engine

```text
experience-engine/

├── backend/
│   ├── src/
│   └── pom.xml
│
├── frontend/
│   ├── app/
│   └── package.json
│
└── docker/
```

Technology Stack:

```text
Backend:
- Java 21
- Spring Boot
- Maven

Frontend:
- Next.js
- TypeScript
- TailwindCSS
- React Flow

Deployment:
- Docker Compose
```

---

## Repository 2: Engineering Brain

The brain is the source of truth.

```text
engineering-brain/

├── concepts/
├── experiences/
├── principles/
├── decisions/
├── failures/
├── architectures/
└── graph/
```

The brain is:

* Human readable
* AI readable
* Git versioned
* Portable
* Independent from the engine

---

# Knowledge Model

## Concept

Concepts are the primary entry point.

Examples:

```text
Authentication
Authorization
JWT
Payments
Deployment
Caching
Frontend Routing
```

Every other node connects to one or more concepts.

---

## Experience

Stores solved engineering situations.

```yaml
id: exp-jwt-403

title: JWT 403 Fix

problem:
  Public routes returning 403

root_cause:
  JwtFilter validating public endpoints

solution:
  Exclude public routes

outcome:
  Success

confidence: 0.95

usage_count: 7

last_verified: 2026-06-20

tags:
  - jwt
  - spring-security
```

---

## Principle

Generalized engineering lessons.

```yaml
id: principle-public-routes

title: Public Routes Bypass Authentication

lesson:
  Authentication should not intercept public routes.

confidence: 0.92
```

---

## Decision

Captures engineering trade-offs.

```yaml
id: decision-jwt

title: Use JWT Instead of Sessions

reason:
  Stateless architecture

alternatives:
  - Session Authentication

outcome:
  Successful

confidence: 0.88
```

---

## Failure

Captures mistakes worth avoiding.

```yaml
id: failure-agent-reset

title: Repository Reset Without Checkpoint

impact:
  Lost uncommitted changes

lesson:
  Create WIP commit before major agent actions

confidence: 1.0
```

---

## Architecture

Reusable system designs.

```yaml
id: arch-spring-jwt

title: Spring Boot JWT Architecture

components:
  - SecurityFilterChain
  - JwtFilter
  - RefreshTokenService

used_in:
  - Sriranga
  - CRM

confidence: 0.93
```

---

# Graph Model

The graph is concept-centric.

```text
Concept
 │
 ├── Experience
 ├── Principle
 ├── Decision
 ├── Failure
 ├── Architecture
 │
 └── Related Concepts
```

Example:

```text
Authentication
      ↓
JWT
      ↓
JWT 403 Fix
      ↓
Public Route Principle

JWT
      ↓
JWT Architecture

JWT
      ↓
JWT vs Session Decision
```

---

# Node Types

```text
Concept
Experience
Principle
Decision
Failure
Architecture
```

---

# Relationship Types

```text
RELATES_TO

DERIVED_FROM

CAUSED_BY

SOLVED_BY

INFLUENCES

CONTRADICTS

USED_IN

APPLIES_TO
```

---

# Runtime Architecture

Source of truth:

```text
YAML Files
```

Runtime:

```text
YAML Files
      ↓
Graph Loader
      ↓
InMemoryGraphStore
      ↓
Reflection Engine
```

The graph is rebuilt at startup.

---

# Reflection Engine

## Step 1 — Concept Resolution

Input:

```text
Implement JWT Authentication
```

Output:

```yaml
concepts:
  - name: Authentication
    confidence: 0.95

  - name: JWT
    confidence: 0.88
```

Concept matching uses:

* Title matching
* Description matching
* Synonym matching
* Tag matching

No embeddings in V1.

---

## Step 2 — Graph Traversal

Starting points:

```text
Authentication
JWT
```

Traversal:

```text
Concept
 ↓
Connected Experiences
 ↓
Connected Principles
 ↓
Connected Decisions
 ↓
Connected Failures
 ↓
Connected Architectures
```

Algorithm:

```text
Breadth First Search (BFS)
```

Optional expansion:

```text
Authentication
 ↓
Authorization
 ↓
OAuth
```

---

## Step 3 — Evidence Assembly

Collect:

```text
Experiences
Principles
Decisions
Failures
Architectures
```

Then:

```text
Deduplicate
 ↓
Rank
 ↓
Filter
```

Scoring factors:

```text
Concept Match Strength

Graph Distance

Confidence

Usage Count

Recency
```

---

## Step 4 — Reflection

Evidence is transformed into:

```text
Lessons

Warnings

Recommendations
```

The reflection layer produces engineering judgment.

---

# Judgment Package

Agents never see raw graph nodes.

Agents only receive:

```json
{
  "task": "Implement JWT authentication",

  "concepts": [
    "Authentication",
    "JWT"
  ],

  "lessons": [
    "Public routes should bypass authentication filters."
  ],

  "warnings": [
    "JWT systems frequently fail when validation occurs before authorization."
  ],

  "recommendations": [
    "Reuse Spring JWT Architecture.",
    "Implement refresh token rotation."
  ],

  "confidence": "high",

  "evidence": [
    "exp-jwt-403",
    "principle-public-routes",
    "arch-spring-jwt"
  ]
}
```

The evidence field exists for traceability and debugging.

---

# REST API

Base URL:

```text
/api/v1
```

---

## Concepts

```http
GET /concepts
GET /concepts/{id}
```

---

## Experiences

```http
GET /experiences
GET /experiences/{id}
POST /experiences
```

---

## Principles

```http
GET /principles
GET /principles/{id}
```

---

## Decisions

```http
GET /decisions
GET /decisions/{id}
```

---

## Failures

```http
GET /failures
GET /failures/{id}
```

---

## Architectures

```http
GET /architectures
GET /architectures/{id}
```

---

## Graph

```http
GET /graph
```

Returns:

```json
{
  "nodes": [],
  "edges": []
}
```

For React Flow visualization.

---

## Review Endpoint

```http
POST /review
```

Request:

```json
{
  "task": "Implement JWT authentication"
}
```

Response:

```json
{
  "lessons": [],
  "warnings": [],
  "recommendations": []
}
```

---

# Storage Strategy (V1)

Use:

```text
YAML + InMemoryGraphStore
```

Reason:

* Fastest development
* Git-native
* No infrastructure
* Easy to evolve

Future:

```text
GraphStore Interface
        ↓
InMemoryGraphStore (V1)

PostgresGraphStore (V2)

VectorGraphStore (V3)
```

---

# Frontend

Pages:

```text
Dashboard

Experience Explorer

Principle Explorer

Decision Explorer

Failure Explorer

Architecture Explorer

Graph View

Review Panel
```

---

# Evaluation Framework

Success metric is NOT:

```text
Memories Stored
```

Success metric IS:

```text
Planning Improvement Rate
```

For every task:

```text
Plan Without Reflection

vs

Plan With Reflection
```

Measure:

* Risks identified
* Failures avoided
* Pattern reuse
* Architectural consistency
* Planning quality

This is the primary KPI of the system.

---

# Future Versions

## V2

* PostgreSQL
* pgvector
* Better ranking
* Reflection persistence
* Multi-brain support

## V3

* Automatic Git commit extraction
* Agent SDK
* Learning feedback loops
* Embedding search
* Confidence learning
* Team brains
* Shared community brains

---

# Product Definition

The Engineering Experience Engine is not a memory database.

It is a persistent engineering judgment layer that sits between a task and an AI agent's planning process, transforming accumulated experience into actionable engineering recommendations before planning begins.
