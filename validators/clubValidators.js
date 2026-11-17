import { body } from "express-validator";
import handleErrors from "./handleErrors.js";

export const validateJoinClub = [
  body("passcode")
    .trim()
    .notEmpty().withMessage("Passcode is required.")
    .bail() // stop here if empty, so we don't also say "incorrect"
    // If CLUB_PASSCODE isn't set, this is never true, so nobody can join.
    .custom((value) => value === process.env.CLUB_PASSCODE)
    .withMessage("Incorrect passcode."),

  handleErrors("join-club", "Join the club"),
];
