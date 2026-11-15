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
- `routes/` — Express routers (`authRouter.js`: `GET`/`POST /sign-up`)
- `controllers/` — Request handlers + express-validator chains (`authController.js`: sign-up)
- `views/` — EJS templates (`index.ejs`, `sign-up.ejs`, `error.ejs`)
- `public/` — static assets (`styles.css`)
- `db/pool.js` — PostgreSQL connection pool configuration
- `db/queries.js` — All raw SQL queries abstracted into reusable async functions
- `db/populatedb.js` — Script to create tables (`users`, `messages`, `session`) and seed initial test data

## Database Schema
- `users`: `id`, `first_name`, `last_name`, `username` (unique, stored lowercase), `password_hash`, `is_member` (default false), `is_admin` (default false)
- `messages`: `id`, `title`, `text`, `created_at` (TIMESTAMPTZ, default NOW()), `user_id` → `users(id)` ON DELETE CASCADE
- `session`: standard connect-pg-simple table (`sid`, `sess`, `expire`)
- Setup: `node db/populatedb.js <connection-string>`. Non-destructive: uses `CREATE TABLE IF NOT EXISTS` and seeds only when `users` is empty. To reseed, drop the tables first. Seed accounts (password `password123`): admin (member+admin), member (member), outsider (non-member).
- Env vars: `DATABASE_URL`, `PORT` (optional)

## Workflow & Learning Rules
- **Step-by-Step Execution:** Build one milestone at a time. Wait for my confirmation and testing before moving to the next feature.
- **Explain Decisions:** After implementing authentication, session configuration, or middleware logic, briefly explain how the pieces connect so I can learn from the code.
- **Git Hygiene:** Suggest a concise commit message after each completed milestone.

## Self-Updating Documentation Rule
- **Keep `CLAUDE.md` Current:** Whenever you add new dependencies, create or rename files/folders, alter database schemas, add new routes, or introduce new environment variables, automatically update the relevant sections of `CLAUDE.md` before finishing the task.

Notes: project uses ESM (`"type": "module"`); env vars load via Node's `--env-file=.env` (npm scripts `dev`/`start`), so `dotenv` isn't needed at runtime. `PORT` env var optional (default 8000).