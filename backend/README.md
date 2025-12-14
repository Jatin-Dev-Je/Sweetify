# Sweetify Backend

Sweetify is the REST API behind the Sweet Shop Management System. It authenticates users, enforces role-based permissions, and exposes all sweets/inventory workflows the SPA consumes. This document explains what the service does, how to run it, and how to contribute without surprises.

---

## Table of Contents

1. [Feature Highlights](#feature-highlights)
2. [Architecture & Stack](#architecture--stack)
3. [Prerequisites](#prerequisites)
4. [Quick Start](#quick-start)
5. [Environment Variables](#environment-variables)
6. [NPM Scripts](#npm-scripts)
7. [API Surface](#api-surface)
8. [Data Model](#data-model)
9. [Project Layout](#project-layout)
10. [Testing & TDD](#testing--tdd)
11. [Development Workflow Tips](#development-workflow-tips)
12. [Troubleshooting](#troubleshooting)

---

## Feature Highlights

- **Secure Auth** - Email/password registration, bcrypt hashing, JWT issuance, and verification middleware.
- **Role Awareness** - `admin` role can restock/delete; standard users can only operate on their sweets and purchases.
- **Inventory Logic** - Every sweet stores `name`, `category`, `price`, and `quantity`. Purchase/restock endpoints accept explicit quantities with guardrails.
- **Validation Everywhere** - Joi schemas validate request bodies/queries before they touch business logic.
- **Consistent Responses** - Success/error envelopes live in `src/utils/apiResponse.js` for predictable client handling.
- **Test Coverage** - Jest + Supertest specs cover auth, CRUD, and inventory edge cases using an ephemeral Mongo server.

## Architecture & Stack

| Concern       | Choice                                   |
|---------------|------------------------------------------|
| Runtime       | Node.js 18+
| Framework     | Express 4
| Database      | MongoDB via Mongoose
| Auth          | JWT + bcrypt
| Validation    | Joi
| Testing       | Jest, Supertest, mongodb-memory-server
| DX Tooling    | Nodemon, ESLint-friendly patterns

## Prerequisites

- Node.js 18+ and npm
- MongoDB instance (local Docker, Atlas cluster, etc.)
- `.env` created from `.env.example`

## Quick Start

```bash
cd backend
npm install
cp .env.example .env   # tweak Mongo URI, JWT secret, CORS origin, etc.
npm run dev            # starts nodemon with hot reload
```

The server defaults to `http://localhost:5000`. Update `FRONTEND_ORIGIN` if your SPA runs from another host/port.

## Environment Variables

| Name                 | Description                              | Default                               |
|----------------------|------------------------------------------|---------------------------------------|
| `PORT`               | HTTP port                                | `5000`                                |
| `MONGODB_URI`        | Mongo connection string                  | `mongodb://127.0.0.1:27017/sweetify`  |
| `JWT_SECRET`         | Signing key for JWTs                     | `change-me` (override!)               |
| `JWT_EXPIRES_IN`     | Token TTL (e.g., `1d`, `12h`)            | `1d`                                  |
| `BCRYPT_SALT_ROUNDS` | Hash cost factor                         | `10`                                  |
| `FRONTEND_ORIGIN`    | Allowed CORS origin                      | `http://localhost:5173`               |

## NPM Scripts

| Script         | Does                                                  |
|----------------|-------------------------------------------------------|
| `npm run dev`  | Starts nodemon with live reload                        |
| `npm start`    | Boots production server (no nodemon)                   |
| `npm test`     | Runs Jest suite against in-memory MongoDB             |

## API Surface

All routes live under `/api` and return `{ success, data, message }`.

### Auth

| Method | Endpoint              | Description                      |
|--------|-----------------------|----------------------------------|
| POST   | `/api/auth/register`  | Sign up, returns JWT + profile   |
| POST   | `/api/auth/login`     | Sign in, returns JWT + profile   |

### Sweets (JWT required)

| Method | Endpoint                      | Description                                   | Role |
|--------|-------------------------------|-----------------------------------------------|------|
| POST   | `/api/sweets`                 | Create a sweet                                | User |
| GET    | `/api/sweets`                 | List sweets (owner scoped or all for admins)  | User |
| GET    | `/api/sweets/search`          | Filter by name/category/price                 | User |
| PUT    | `/api/sweets/:id`             | Update a sweet you own                        | User |
| DELETE | `/api/sweets/:id`             | Delete sweet                                  | Admin |
| POST   | `/api/sweets/:id/purchase`    | Purchase quantity (decrements stock)          | User |
| POST   | `/api/sweets/:id/restock`     | Restock quantity                              | Admin |

Payload validation resides in `src/validations/sweets.validation.js`, ensuring invalid data never hits the service layer.

## Data Model

`Sweet` document (`src/models/Sweet.js`):

| Field     | Type    | Notes                                |
|-----------|---------|--------------------------------------|
| `name`    | String  | Required                             |
| `category`| String  | Required                             |
| `price`   | Number  | Stored in rupees per kilogram        |
| `quantity`| Number  | Current stock count                  |
| `owner`   | String  | Email of creator (authorization aid) |

`User` documents track `name`, `email`, `passwordHash`, and `role` (user/admin).

## Project Layout

```
src/
  app.js              # Express app + middleware wiring
  server.js           # HTTP bootstrap
  config/             # env + Mongo helpers
  controllers/        # translate HTTP -> service layer
  services/           # domain/business logic
  routes/             # endpoint definitions
  middlewares/        # auth, admin, validation, error handlers
  models/             # Mongoose schemas
  utils/              # JWT, hashing, response helpers
  validations/        # Joi schemas
  tests/              # Jest specs + setup/teardown
```

## Testing & TDD

```bash
npm test
```

Behind the scenes:

1. `mongodb-memory-server` spins up a disposable Mongo instance.
2. Global Jest hooks connect/disconnect before/after the suite.
3. Supertest exercises real routes/middleware/services end-to-end.

Coverage focuses on:

- Auth happy paths + validation failures
- Sweets CRUD/search scenarios
- Purchase/restock quantity edge cases (insufficient stock, invalid payloads)

Adopt a red -> green -> refactor cadence when adding functionality.

## Development Workflow Tips

- Keep controllers thin; complex logic belongs in `services/`.
- Reuse response helpers (`src/utils/apiResponse.js`) to keep payloads consistent.
- Document every AI-assisted commit with the required `Co-authored-by` trailer and describe tooling usage in the root README's **My AI Usage** section.
- Run `npm test` before pushing to catch regressions early.

## Troubleshooting

| Symptom                                   | Fix                                                                 |
|-------------------------------------------|---------------------------------------------------------------------|
| `MongoNetworkError` on startup            | Verify `MONGODB_URI` and that Mongo is reachable                     |
| `Unauthorized` despite fresh token        | Ensure `JWT_SECRET` matches between login and protected requests     |
| CORS errors from the frontend             | Update `FRONTEND_ORIGIN` to match the SPA dev server URL             |
| Tests hang indefinitely                   | Clear `mongodb-memory-server` cache or run `npm test --runInBand`    |

---

Need sample requests or Postman collections? Open an issue or ping the team; happy to help. 
