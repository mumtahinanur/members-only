import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { getUserByUsername, getUserById } from "../db/queries.js";

// 1. Strategy: how to check a username + password.
// passport-local reads req.body.username and req.body.password for us.
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await getUserByUsername(username);
      const passwordMatches =
        user && (await bcrypt.compare(password, user.password_hash));

      // Same message for "no such user" and "wrong password", so the form
      // doesn't reveal which usernames exist.
      if (!passwordMatches) {
        return done(null, false, { message: "Incorrect username or password." });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

// 2. After login: decide what to store in the session (just the id).
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// 3. On every later request: turn the stored id back into a user.
// Whatever we pass to done() becomes req.user.
passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserById(id);
    done(null, user || false);
  } catch (err) {
    done(err);
  }
});

export default passport;
