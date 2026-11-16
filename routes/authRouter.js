import { Router } from "express";
import { signUpGet, signUpPost } from "../controllers/authController.js";
import { validateSignUp } from "../validators/authValidators.js";

const authRouter = Router();

authRouter.get("/sign-up", signUpGet);
// Middleware runs left to right: validation chains first, then the handler.
authRouter.post("/sign-up", validateSignUp, signUpPost);

export default authRouter;
