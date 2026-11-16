import { Router } from "express";
import {
  signUpGet,
  signUpPost,
  logInGet,
  logInPost,
  logOutPost,
} from "../controllers/authController.js";
import { validateSignUp, validateLogin } from "../validators/authValidators.js";

const authRouter = Router();

// Middleware runs left to right: validation chains first, then the handler.
authRouter.get("/sign-up", signUpGet);
authRouter.post("/sign-up", validateSignUp, signUpPost);

authRouter.get("/log-in", logInGet);
authRouter.post("/log-in", validateLogin, logInPost);

// POST (not GET) so a link or browser prefetch can't log someone out.
authRouter.post("/log-out", logOutPost);

export default authRouter;
