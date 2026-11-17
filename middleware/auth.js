// Route guard: only let logged-in users through.
// passport adds req.isAuthenticated() (true when req.user is set).
export function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/log-in");
}
