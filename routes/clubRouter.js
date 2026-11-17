import { Router } from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { validateJoinClub } from "../validators/clubValidators.js";
import { joinClubGet, joinClubPost } from "../controllers/clubController.js";

const clubRouter = Router();

// Left to right: must be logged in → passcode must be correct → update status.
clubRouter.get("/join-club", isAuthenticated, joinClubGet);
clubRouter.post("/join-club", isAuthenticated, validateJoinClub, joinClubPost);

export default clubRouter;
