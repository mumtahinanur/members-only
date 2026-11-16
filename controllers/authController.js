import bcrypt from "bcryptjs";
import { validationResult, matchedData } from "express-validator";
import * as db from "../db/queries.js";

export function signUpGet(req, res) {
  res.render("sign-up", { title: "Sign up", errors: [], values: {} });
}

// Runs after validateSignUp (see routes/authRouter.js).
export async function signUpPost(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Re-show the form with messages, keeping what the user typed
    // (except passwords, which we never send back).
    const { firstName, lastName, username } = req.body;
    return res.status(400).render("sign-up", {
      title: "Sign up",
      errors: errors.array(),
      values: { firstName, lastName, username },
    });
  }

  // matchedData gives the sanitized values (trimmed, lowercased).
  const { firstName, lastName, username, password } = matchedData(req);
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    await db.createUser({ firstName, lastName, username, passwordHash });
  } catch (err) {
    // 23505 = unique violation: someone took the username between
    // our check above and this insert.
    if (err.code === "23505") {
      return res.status(400).render("sign-up", {
        title: "Sign up",
        errors: [{ msg: "That username is already taken." }],
        values: { firstName, lastName, username },
      });
    }
    throw err; // Express 5 forwards this to the error handler
  }

  // Login arrives in the next milestone; for now go home.
  res.redirect("/");
}
