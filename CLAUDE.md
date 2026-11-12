# Project: Members Only

## Project Overview
An exclusive clubhouse web application where authenticated users can post messages.

## Tech Stack
- **Runtime & Framework:** Node.js, Express
- **View Engine:** EJS (`ejs`) with clean semantic HTML and minimal, clean CSS
- **Database:** PostgreSQL using raw parameterized SQL via `node-postgres` (`pg`) — **do not use an ORM**
- **Authentication:** `passport`, `passport-local`, `express-session`, `connect-pg-simple`
- **Security & Validation:** `bcryptjs` for password hashing, `express-validator` for input validation/sanitization, `dotenv` for environment variables

## Architecture & Directory Structure
Follow a clean MVC-style separation:
- `app.js` — Express entry point (ESM): view engine, middleware, routes, 404/error handlers
- `views/` — EJS templates (`index.ejs`, `error.ejs`)
- `public/` — static assets (`styles.css`)
- `db/pool.js` — PostgreSQL connection pool configuration
- `db/queries.js` — All raw SQL queries abstracted into reusable async functions
- `db/populatedb.js` — Script to create tables (`users`, `messages`, `session`) and seed initial test data

## Workflow & Learning Rules
- **Step-by-Step Execution:** Build one milestone at a time. Wait for my confirmation and testing before moving to the next feature.
- **Explain Decisions:** After implementing authentication, session configuration, or middleware logic, briefly explain how the pieces connect so I can learn from the code.
- **Git Hygiene:** Suggest a concise commit message after each completed milestone.

## Self-Updating Documentation Rule
- **Keep `CLAUDE.md` Current:** Whenever you add new dependencies, create or rename files/folders, alter database schemas, add new routes, or introduce new environment variables, automatically update the relevant sections of `CLAUDE.md` before finishing the task.
- **Track Implementation Progress:** Maintain a `## Current Status` section at the bottom of `CLAUDE.md` checking off completed milestones and noting any pending work or known edge cases so every new session starts with accurate context.

## Current Status
- [x] Milestone 1: Project skeleton, Express setup (app.js, views, public; awaiting user test)

Notes: project uses ESM (`"type": "module"`); env vars load via Node's `--env-file=.env` (npm scripts `dev`/`start`), so `dotenv` isn't needed at runtime. `PORT` env var optional (default 3000).