// Route guard: only let logged-in users through.
// passport adds req.isAuthenticated() (true when req.user is set).
export function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/log-in");
}

// Route guard: only let admins through. Use after isAuthenticated.
// Hiding the delete button isn't enough: anyone could send the request directly.
export function isAdmin(req, res, next) {
  if (req.user?.is_admin) {
    return next();
  }
  res.status(403).render("error", {
    title: "Forbidden",
    message: "Only admins can do that.",
  });
}
