import { Router } from "express";
import { signUpGet, signUpPost } from "../controllers/authController.js";

const authRouter = Router();

authRouter.get("/sign-up", signUpGet);
authRouter.post("/sign-up", signUpPost);

export default authRouter;
