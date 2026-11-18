import { body } from "express-validator";
import handleErrors from "./handleErrors.js";

export const validateMessage = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required.")
    // 255 matches the VARCHAR(255) column in the messages table.
    .isLength({ max: 255 })
    .withMessage("Title must be at most 255 characters."),

  body("text")
    .trim()
    .notEmpty()
    .withMessage("Message text is required.")
    .isLength({ max: 2000 })
    .withMessage("Message must be at most 2000 characters."),

  handleErrors("new-message", "New message"),
];
