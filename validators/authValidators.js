import { body } from "express-validator";
import { getUserByUsername } from "../db/queries.js";
import handleErrors from "./handleErrors.js";

// Validation + sanitization rules for the auth forms.
// Each body("field") chain runs top to bottom: sanitizers (trim, toLowerCase)
// change the value in req.body, validators (notEmpty, isLength...) check it.
// The chains only record errors; handleErrors (the last step) acts on them.

export const validateSignUp = [
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
      const existing = await getUserByUsername(username);
      if (existing) {
        throw new Error("That username is already taken.");
      }
    }),

  // Passwords are not trimmed: spaces can be part of a password.
  body("password")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters."),

  // Custom validator: compare against the other field via req.body.
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match."),

  handleErrors("sign-up", "Sign up"),
];

// Login only checks the fields are filled in; passport checks the credentials.
export const validateLogin = [
  body("username")
    .trim()
    .toLowerCase()
    .notEmpty().withMessage("Username is required."),

  body("password")
    .notEmpty().withMessage("Password is required."),

  handleErrors("log-in", "Log in"),
];
