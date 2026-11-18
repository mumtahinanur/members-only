import { Router } from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { validateJoinClub, validateBecomeAdmin } from "../validators/clubValidators.js";
import {
  joinClubGet,
  joinClubPost,
  becomeAdminGet,
  becomeAdminPost,
} from "../controllers/clubController.js";

const clubRouter = Router();

// Left to right: must be logged in → passcode must be correct → update status.
clubRouter.get("/join-club", isAuthenticated, joinClubGet);
clubRouter.post("/join-club", isAuthenticated, validateJoinClub, joinClubPost);

clubRouter.get("/become-admin", isAuthenticated, becomeAdminGet);
clubRouter.post("/become-admin", isAuthenticated, validateBecomeAdmin, becomeAdminPost);

export default clubRouter;
