import { createMessage } from "../db/queries.js";

export function newMessageGet(req, res) {
  res.render("new-message", { title: "New message", errors: [], values: {} });
}

// Only reached when logged in (isAuthenticated) and the form is valid
// (validateMessage). The author comes from req.user, never from the form,
// so nobody can post as someone else.
export async function newMessagePost(req, res) {
  const { title, text } = req.body;
  await createMessage({ title, text, userId: req.user.id });
  res.redirect("/");
}
