import { Router } from "express";
import { isAuthenticated, isAdmin } from "../middleware/auth.js";
import { validateMessage } from "../validators/messageValidators.js";
import {
  index,
  newMessageGet,
  newMessagePost,
  deleteMessagePost,
} from "../controllers/messageController.js";

const messageRouter = Router();

// Home page: message list, open to everyone (author/date for members only)
messageRouter.get("/", index);

// isAuthenticated on both: hiding the link isn't enough, since anyone
// could type the URL directly.
messageRouter.get("/messages/new", isAuthenticated, newMessageGet);
messageRouter.post("/messages/new", isAuthenticated, validateMessage, newMessagePost);

// POST (not GET) so a link or browser prefetch can't delete anything.
// Logged out → /log-in; logged in but not admin → 403.
messageRouter.post("/messages/:id/delete", isAuthenticated, isAdmin, deleteMessagePost);

export default messageRouter;
