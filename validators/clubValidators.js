import { body } from "express-validator";
import handleErrors from "./handleErrors.js";

// Shared rule for both passcode forms: the "passcode" field must equal the
// secret stored in the given environment variable.
function passcodeMatches(envVarName) {
  return (
    body("passcode")
      .trim()
      .notEmpty()
      .withMessage("Passcode is required.")
      .bail() // stop here if empty, so we don't also say "incorrect"
      // If the env var isn't set, this is never true, so nobody gets in.
      .custom((value) => value === process.env[envVarName])
      .withMessage("Incorrect passcode.")
  );
}

export const validateJoinClub = [
  passcodeMatches("CLUB_PASSCODE"),
  handleErrors("join-club", "Join the club"),
];

export const validateBecomeAdmin = [
  passcodeMatches("ADMIN_PASSCODE"),
  handleErrors("become-admin", "Become admin"),
];
