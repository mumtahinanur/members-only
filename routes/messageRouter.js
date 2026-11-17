import { Router } from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { validateMessage } from "../validators/messageValidators.js";
import {
  index,
  newMessageGet,
  newMessagePost,
} from "../controllers/messageController.js";

const messageRouter = Router();

// Home page: message list, open to everyone (author/date for members only)
messageRouter.get("/", index);

// isAuthenticated on both: hiding the link isn't enough, since anyone
// could type the URL directly.
messageRouter.get("/messages/new", isAuthenticated, newMessageGet);
messageRouter.post("/messages/new", isAuthenticated, validateMessage, newMessagePost);

export default messageRouter;
