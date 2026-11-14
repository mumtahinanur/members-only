import pg from "pg";

// One shared pool for the whole app. pg reads nothing automatically here,
// so we pass the connection string from the environment explicitly.
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
