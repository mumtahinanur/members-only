import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import pool from "../db/pool.js";

// Sessions: the browser keeps only a session-id cookie; the session data
// lives in the Postgres "session" table.
const PgStore = connectPgSimple(session);

export default session({
  // createTableIfMissing: also creates the table if populatedb was never run
  store: new PgStore({ pool, createTableIfMissing: true }),
  secret: process.env.SESSION_SECRET, // signs the cookie so it can't be forged
  resave: false, // don't re-save sessions that didn't change
  saveUninitialized: false, // don't store empty sessions for logged-out visitors
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true, // page JavaScript can't read the cookie
    secure: process.env.NODE_ENV === "production", // HTTPS-only in production
  },
});
