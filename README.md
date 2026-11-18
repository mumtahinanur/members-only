# Members Only

An exclusive clubhouse where members write anonymous posts. Anyone can read the
messages, but only club members can see who wrote each one and when. Admins can
also delete messages.

Built as practice for creating and authenticating users and giving them different
permissions.

## Who can do what

|                                | Read messages | See author & date | Post messages | Delete messages |
| ------------------------------ | :-----------: | :---------------: | :-----------: | :-------------: |
| Visitor (logged out)           |       ✓       |                   |               |                 |
| User (signed up)               |       ✓       |                   |       ✓       |                 |
| Member (entered club passcode) |       ✓       |         ✓         |       ✓       |                 |
| Admin (entered admin passcode) |       ✓       |         ✓         |       ✓       |        ✓        |

Every permission is checked on the server, not just hidden in the page.

## Tech stack

- Node.js + Express 5, EJS views, plain CSS
- PostgreSQL with raw parameterized SQL (`pg`), no ORM
- Authentication: Passport (`passport-local`), `express-session` with sessions stored in Postgres (`connect-pg-simple`)
- `bcryptjs` for password hashing, `express-validator` for validation

## Setup

Requires Node.js 20.6+ (for `--env-file`) and a PostgreSQL database.

1. Install dependencies:
   ```sh
   npm install
   ```
2. Create a `.env` file in the project root:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/members_only
   SESSION_SECRET=a-long-random-string
   CLUB_PASSCODE=secret-to-become-a-member
   ADMIN_PASSCODE=a-different-secret-to-become-admin
   # optional
   PORT=8000
   NODE_ENV=production   # only when deployed over HTTPS (secure cookies)
   ```
   Generate a session secret with:
   `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
3. Create the tables and seed test data (safe to re-run):
   ```sh
   node --env-file=.env db/populatedb.js
   ```
4. Start the dev server (restarts on code changes):
   ```sh
   npm run dev
   ```
   Then open http://localhost:8000.

### Linting & formatting

```sh
npm run lint          # ESLint: bug checks + always-use-braces rule
npm run lint:fix      # auto-fix what ESLint can
npm run format        # Prettier: reformat all files
npm run format:check  # check formatting without changing files
```

### Test accounts

The seed script creates these accounts, all with the password `password123`.
They're for local testing only.

| Username   | Role           |
| ---------- | -------------- |
| `admin`    | admin + member |
| `member`   | member         |
| `outsider` | regular user   |

## Project structure

```
app.js                 Express setup, middleware, routers, 404/error handlers
config/                session (Postgres store) and passport setup
middleware/auth.js     isAuthenticated / isAdmin route guards
routes/                auth, club (passcodes) and message routers
controllers/           request handlers
validators/            express-validator rules + shared error handler
db/                    pool, SQL queries, populatedb script
views/                 EJS pages + partials (shared header/nav)
public/                CSS and the delete-confirmation script
```
