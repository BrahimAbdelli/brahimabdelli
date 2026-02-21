---
title: "Nestier – A Production-Ready NestJS Starter"
description: "Nestier is an opinionated NestJS boilerplate built for real-world projects. It ships with hexagonal architecture, generic repository pattern, JWT authentication, Docker support, and CI/CD pipelines out of the box."
pubDatetime: 2026-02-07T10:00:00+01:00
tags:
  - NestJS
  - TypeORM
  - DDD (Domain-Driven Design)
  - Generic Repository Pattern
  - TypeScript
  - Backend
  - Open-Source
  - Docker
  - MongoDB
category: "Backend"
author: "Brahim Abdelli"
featured: true
---

## Why Nestier?

Starting a new NestJS project often means copying the same boilerplate from a previous one: authentication, database config, generic layers, Docker files, CI pipelines, and so on. As the project scales toward enterprise level, shortcuts accumulate, spaghetti code spreads, and the codebase becomes increasingly difficult to maintain.

**Nestier** puts an end to that by providing a clean, production-ready foundation you can clone and start building on right away — with solid architecture and best practices baked in from day one.

## Architecture

The project follows a strict **hexagonal architecture** (ports & adapters) with four distinct layers:

| Layer | Purpose | Contents |
|-------|---------|----------|
| **Domain** | Business logic & rules | Entities, Value Objects, Repository Interfaces, Domain Errors |
| **Application** | Use cases & orchestration | Services, Use Cases, Port Interfaces |
| **Infrastructure** | External concerns | TypeORM Repositories, Entity Mappers, Adapters, Middleware |
| **Presentation** | HTTP interface | Controllers, DTOs, DTO Mappers, Validation |

### Generic Base Pattern

The heart of Nestier is a set of reusable generic components that any module can extend:

```
BaseController<T>      →  CRUD endpoints + search + pagination
BaseService<T>         →  Business logic for all CRUD operations
BaseRepository<T>      →  Abstract repository interface (port)
TypeOrmBaseRepository   →  Concrete TypeORM implementation (adapter)
BaseEntity             →  Common entity fields (id, timestamps)
```

Three example modules demonstrate different levels of customization:

| Module | Pattern | Description |
|--------|---------|-------------|
| **Category** | Base Implementation | Uses generic base components directly for simple CRUD |
| **Product** | Extended Base | Extends base with custom use cases and repository methods |
| **User** | Custom Implementation | Full custom implementation with JWT auth and email features |

## What's Inside

### Authentication & Authorization

Nestier implements JWT-based authentication with a complete password reset flow. Sign up, login, forgot-password and reset-password endpoints are ready to use. An `AuthMiddleware` protects routes that require a valid token.

### Database Layer

The project uses TypeORM with MongoDB. The generic repository pattern abstracts all database operations behind a clean interface — swap the underlying database without touching your business logic.

### Advanced Search

Every module gets powerful search capabilities out of the box:

```json
{
  "attributes": [
    { "key": "name", "value": "test", "comparator": "LIKE" },
    { "key": "price", "value": 100, "comparator": "GREATER_THAN" }
  ],
  "orders": { "name": "ASC" },
  "type": "AND",
  "take": 10,
  "isPaginable": true
}
```

Dynamic filtering supports multiple comparators (`EQUALS`, `LIKE`, `GREATER_THAN`, etc.), pagination, and sorting.

### AutoMapper Integration

Entity-to-domain and domain-to-DTO mapping is handled automatically via `@automapper/nestjs`, keeping layers decoupled and reducing boilerplate.

### Docker & DevOps

A multi-stage `Dockerfile` produces a minimal production image. `docker-compose.yml` spins up the app alongside MongoDB and SonarQube. GitHub Actions handle CI (lint, test, build) and CD.

| Service | Port | Description |
|---------|------|-------------|
| Backend | 3000 | NestJS application |
| MongoDB | 27017 | Database |
| SonarQube | 9000 | Code quality dashboard |

### Testing

Unit tests cover services and guards. Integration tests hit actual endpoints through supertest. The test setup mirrors production as closely as possible — same database driver, same environment variable structure.

### Security

- **Helmet** for security headers
- **Rate limiting** at 10,000 requests per 15 minutes
- **CORS** configured out of the box
- **Input validation** via class-validator with custom pipes

## Project Structure

```
src/
├── modules/
│   ├── base/                 # Generic base module
│   │   ├── application/      # BaseService, port interfaces
│   │   ├── domain/           # BaseEntity, BaseRepository interface
│   │   ├── infrastructure/   # TypeOrmBaseRepository adapter
│   │   └── presentation/     # BaseController factory, base DTOs
│   │
│   ├── category/             # Simple CRUD example
│   ├── product/              # Extended CRUD with custom use cases
│   └── user/                 # Custom auth implementation
│
└── shared/
    ├── common/               # Error handling, logger, validators
    └── config/               # Environment, database, auth, email
```

## Getting Started

```bash
git clone https://github.com/BrahimAbdelli/nestier.git
cd nestier
cp .env.example .env
npm install
docker-compose up -d
npm run start:dev
```

The API is live at `http://localhost:3000/api`. Swagger docs are available at `/docs`.

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | NestJS 11 |
| **Language** | TypeScript 5.9 |
| **Database** | MongoDB via TypeORM |
| **Authentication** | JWT |
| **Validation** | class-validator + class-transformer |
| **Mapping** | @automapper/nestjs |
| **Logging** | Winston |
| **Email** | Mailjet |
| **Documentation** | Swagger / OpenAPI |
| **Testing** | Jest + Supertest |
| **Code Quality** | ESLint, Prettier, SonarQube |
| **Containerization** | Docker + Docker Compose |

## What's Next

Nestier is actively maintained. Planned additions include WebSocket support, file upload with S3 pre-signed URLs, audit module, a message broker logic, Contributions are welcome — check the [repo](https://github.com/BrahimAbdelli/nestier) for open issues.
