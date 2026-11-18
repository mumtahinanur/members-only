// Checks environment variables once, at startup. Imported first in app.js,
// so the app exits with a clear message instead of failing on the first request.

const REQUIRED = ["DATABASE_URL", "SESSION_SECRET"];

const missing = REQUIRED.filter((name) => !process.env[name]);
if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(", ")}`);
  console.error("Copy .env.example to .env and fill them in.");
  process.exit(1);
}

// Optional: those features stay disabled without them, so warn instead of exiting.
for (const name of ["CLUB_PASSCODE", "ADMIN_PASSCODE"]) {
  if (!process.env[name]) {
    console.warn(`${name} is not set: nobody can use that passcode page.`);
  }
}
