import bcrypt from "bcryptjs";
import { body, validationResult, matchedData } from "express-validator";
import * as db from "../db/queries.js";

// Validation + sanitization rules for the sign-up form.
// Each body("field") chain runs top to bottom: sanitizers (trim, toLowerCase)
// change the value, validators (notEmpty, isLength...) check it.
const validateSignUp = [
  body("firstName")
    .trim()
    .notEmpty().withMessage("First name is required.")
    .isLength({ max: 100 }).withMessage("First name must be at most 100 characters."),

  body("lastName")
    .trim()
    .notEmpty().withMessage("Last name is required.")
    .isLength({ max: 100 }).withMessage("Last name must be at most 100 characters."),

  body("username")
    .trim()
    .toLowerCase()
    .isLength({ min: 3, max: 50 }).withMessage("Username must be 3 to 50 characters.")
    .matches(/^[a-z0-9_]+$/).withMessage("Username may only contain letters, numbers and underscores.")
    // Custom async validator: throw (or reject) to fail.
    .custom(async (username) => {
      const existing = await db.getUserByUsername(username);
      if (existing) throw new Error("That username is already taken.");
    }),

  // Passwords are not trimmed: spaces can be part of a password.
  body("password")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters."),

  // Custom validator: compare against the other field via req.body.
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match."),
];

export function signUpGet(req, res) {
  res.render("sign-up", { title: "Sign up", errors: [], values: {} });
}

export const signUpPost = [
  ...validateSignUp,
  async (req, res) => {
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
  },
];
