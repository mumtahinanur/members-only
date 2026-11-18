import bcrypt from "bcryptjs";
import passport from "../config/passport.js";
import { createUser } from "../db/queries.js";

// bcrypt cost factor: higher = slower to hash = slower to brute-force.
const BCRYPT_ROUNDS = 10;
// Postgres error code for breaking a UNIQUE constraint.
const UNIQUE_VIOLATION = "23505";

export function signUpGet(req, res) {
  res.render("sign-up", { title: "Sign up", errors: [], values: {} });
}

// Only reached when validateSignUp passed; req.body is already sanitized.
export async function signUpPost(req, res) {
  const { firstName, lastName, username, password } = req.body;
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  try {
    await createUser({ firstName, lastName, username, passwordHash });
  } catch (err) {
    // Someone took the username between the validator's check and this insert.
    if (err.code === UNIQUE_VIOLATION) {
      return res.status(400).render("sign-up", {
        title: "Sign up",
        errors: [{ msg: "That username is already taken." }],
        values: req.body,
      });
    }
    throw err; // anything else → Express 5 → error handler
  }

  res.redirect("/log-in");
}

export function logInGet(req, res) {
  // failureMessage: true stores passport's message here; show it once, then clear.
  const messages = req.session.messages || [];
  req.session.messages = [];
  res.render("log-in", {
    title: "Log in",
    errors: messages.map((msg) => ({ msg })),
    values: {},
  });
}

// Only reached when validateLogin passed. Passport checks the password and,
// on success, calls req.logIn (→ serializeUser) for us.
export const logInPost = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/log-in",
  failureMessage: true,
});

export function logOutPost(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}
