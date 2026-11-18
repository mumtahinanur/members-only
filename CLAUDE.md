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
- `config/session.js` — express-session middleware with connect-pg-simple store (1-day cookie, httpOnly, secure in production)
- `config/passport.js` — passport-local strategy (bcrypt compare), serialize/deserialize user by id
- `middleware/auth.js` — route guards (`isAuthenticated`: redirects to `/log-in` when logged out; `isAdmin`: 403 unless `req.user.is_admin`)
- `routes/` — Express routers (`authRouter.js`: `GET`/`POST /sign-up`, `GET`/`POST /log-in`, `POST /log-out`; `clubRouter.js`: `GET`/`POST /join-club`, `GET`/`POST /become-admin`, login required; `messageRouter.js`: `GET /` home message list (author/date only for members), `GET`/`POST /messages/new` login required, `POST /messages/:id/delete` admin only)
- `controllers/` — Request handlers (`authController.js`: sign-up, log-in, log-out; `clubController.js`: join the club via `setMember`, become admin via `setAdmin` (also makes member); `messageController.js`: `index` lists messages via `getAllMessages` and strips author/date for non-members, passes `isAdmin` for delete buttons; create message via `createMessage`, author = `req.user.id`; `deleteMessagePost` via `deleteMessage`)
- `validators/` — express-validator chains, attached in routers before the controller handler; each array ends with `handleErrors(view, title)`, which re-renders the form on failure, so controllers only handle valid input (`handleErrors.js`: shared error step; `authValidators.js`: `validateSignUp`, `validateLogin`; `clubValidators.js`: `validateJoinClub` checks passcode against `CLUB_PASSCODE`, `validateBecomeAdmin` against `ADMIN_PASSCODE`; `messageValidators.js`: `validateMessage`)
- `views/partials/` — `header.ejs` (doctype, head, site header + nav, opening `<main>`; uses `locals.currentUser`), `footer.ejs`, and `form-errors.ejs` (validation error list, reads the page's `errors`); every view starts with `<%- include("partials/header") %>` and ends with the footer include
- `views/` — EJS templates (`index.ejs`, `sign-up.ejs`, `log-in.ejs`, `join-club.ejs`, `become-admin.ejs`, `new-message.ejs`, `error.ejs`); every view gets `currentUser` via `res.locals`
- `public/` — static assets (`styles.css`; `js/confirm-delete.js`: opens the `<dialog>` delete-confirmation pop-up for admins)
- `README.md` — project overview, permission table, setup steps, test accounts
- `eslint.config.js` — ESLint flat config: recommended rules, `curly: "all"` (always braces), `eqeqeq`, unused args allowed if prefixed `_`; `eslint-config-prettier` is listed _before_ the custom rules because it disables `curly`
- `.prettierrc.json` (`printWidth: 100`) / `.prettierignore` — Prettier formatting (EJS files are not formatted)
- Dev scripts: `npm run lint`, `lint:fix`, `format`, `format:check`. Run `npm run lint` and `npm run format` before committing.
- `db/pool.js` — PostgreSQL connection pool configuration
- `db/queries.js` — All raw SQL queries abstracted into reusable async functions
- `db/populatedb.js` — Script to create tables (`users`, `messages`, `session`) and seed initial test data

## Database Schema

- `users`: `id`, `first_name`, `last_name`, `username` (unique, stored lowercase), `password_hash`, `is_member` (default false), `is_admin` (default false)
- `messages`: `id`, `title`, `text`, `created_at` (TIMESTAMPTZ, default NOW()), `user_id` → `users(id)` ON DELETE CASCADE
- `session`: standard connect-pg-simple table (`sid`, `sess`, `expire`)
- Setup: `node db/populatedb.js <connection-string>`. Non-destructive: uses `CREATE TABLE IF NOT EXISTS` and seeds only when `users` is empty. To reseed, drop the tables first. Seed accounts (password `password123`): admin (member+admin), member (member), outsider (non-member).
- Env vars: `DATABASE_URL`, `SESSION_SECRET` (signs the session cookie), `CLUB_PASSCODE` (secret to become a member; unset = nobody can join), `ADMIN_PASSCODE` (secret to become admin + member; unset = nobody can), `PORT` (optional), `NODE_ENV` (optional; `production` enables secure cookies)

## Workflow & Learning Rules

- **Step-by-Step Execution:** Build one milestone at a time. Wait for my confirmation and testing before moving to the next feature.
- **Explain Decisions:** After implementing authentication, session configuration, or middleware logic, briefly explain how the pieces connect so I can learn from the code.
- **Git Hygiene:** Suggest a concise commit message after each completed milestone.

## Self-Updating Documentation Rule

- **Keep `CLAUDE.md` Current:** Whenever you add new dependencies, create or rename files/folders, alter database schemas, add new routes, or introduce new environment variables, automatically update the relevant sections of `CLAUDE.md` before finishing the task.

Notes: project uses ESM (`"type": "module"`); env vars load via Node's `--env-file=.env` (npm scripts `dev`/`start`), so `dotenv` isn't needed at runtime. `PORT` env var optional (default 8000).
