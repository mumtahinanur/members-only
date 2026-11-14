import { Client } from "pg";
import bcrypt from "bcryptjs";

// Schema. IF NOT EXISTS makes it safe to re-run. This is the only place the
// schema is defined.
const SQL = `
  CREATE TABLE IF NOT EXISTS users (
    id            INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    first_name    VARCHAR(100) NOT NULL,
    last_name     VARCHAR(100) NOT NULL,
    username      VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_member     BOOLEAN NOT NULL DEFAULT FALSE,
    is_admin      BOOLEAN NOT NULL DEFAULT FALSE
  );

  CREATE TABLE IF NOT EXISTS messages (
    id         INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title      VARCHAR(255) NOT NULL,
    text       TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE
  );

  -- Table layout required by connect-pg-simple
  CREATE TABLE IF NOT EXISTS session (
    sid    VARCHAR NOT NULL COLLATE "default" PRIMARY KEY,
    sess   JSON NOT NULL,
    expire TIMESTAMP(6) NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_session_expire ON session (expire);
`;

// Dummy data, inserted only when users is empty (see main). Split in two
// because the users need the password hash as $1, and a query with parameters
// can only hold one statement.
const SEED_USERS_SQL = `
  INSERT INTO users (first_name, last_name, username, password_hash, is_member, is_admin) VALUES
    ('Ada', 'Admin', 'admin', $1, TRUE, TRUE),
    ('Mia', 'Member', 'member', $1, TRUE, FALSE),
    ('Otto', 'Outsider', 'outsider', $1, FALSE, FALSE);
`;

// Each message finds its author's id with a small lookup by username.
const SEED_MESSAGES_SQL = `
  INSERT INTO messages (title, text, user_id) VALUES
    ('Welcome to the club', 'First post! Members can see who wrote this.',
      (SELECT id FROM users WHERE username = 'admin')),
    ('Secret handshake', 'It involves three taps and a wink.',
      (SELECT id FROM users WHERE username = 'member'));
`;

async function main() {
  // Usage: node db/populatedb.js [connection-string]
  // Falls back to DATABASE_URL (loaded by --env-file in `npm run populatedb`).
  const connectionString = process.argv[2] ?? process.env.DATABASE_URL;
  const client = new Client({ connectionString });
  await client.connect();
  await client.query(SQL);

  const { rows } = await client.query("SELECT COUNT(*) FROM users");
  if (Number(rows[0].count) === 0) {
    // All seed accounts use the password "password123" (test data only).
    const hash = await bcrypt.hash("password123", 10);
    await client.query(SEED_USERS_SQL, [hash]);
    await client.query(SEED_MESSAGES_SQL);
    console.log("Seeded dummy data");
  } else {
    console.log("Users table not empty, skipping seed data");
  }

  await client.end();
  console.log("Database populated");
}

main();
