import bcrypt from "bcryptjs";
import passport from "../config/passport.js";
import { createUser } from "../db/queries.js";

export function signUpGet(req, res) {
  res.render("sign-up", { title: "Sign up", errors: [], values: {} });
}

// Only reached when validateSignUp passed; req.body is already sanitized.
export async function signUpPost(req, res) {
  const { firstName, lastName, username, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    await createUser({ firstName, lastName, username, passwordHash });
  } catch (err) {
    if (err.code !== "23505") throw err; // 23505 = username taken in a race
    return res.status(400).render("sign-up", {
      title: "Sign up",
      errors: [{ msg: "That username is already taken." }],
      values: req.body,
    });
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
    if (err) return next(err);
    res.redirect("/");
  });
}
