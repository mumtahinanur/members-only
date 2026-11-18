import { setMember, setAdmin } from "../db/queries.js";

export function joinClubGet(req, res) {
  res.render("join-club", { title: "Join the club", errors: [] });
}

// Only reached when logged in (isAuthenticated) and the passcode was correct
// (validateJoinClub). deserializeUser reloads the user from the database on
// every request, so the new status shows up on the next page automatically.
export async function joinClubPost(req, res) {
  await setMember(req.user.id);
  res.redirect("/");
}

export function becomeAdminGet(req, res) {
  res.render("become-admin", { title: "Become admin", errors: [] });
}

// Same flow as joinClubPost, but checks ADMIN_PASSCODE (validateBecomeAdmin).
export async function becomeAdminPost(req, res) {
  await setAdmin(req.user.id);
  res.redirect("/");
}
