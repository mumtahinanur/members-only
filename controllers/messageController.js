import { createMessage, getAllMessages, deleteMessage } from "../db/queries.js";

// e.g. "17 Nov 2026 · 8:27 PM"
const formatDate = (date) =>
  `${date.toLocaleDateString("en-GB", { dateStyle: "medium" })} · ` +
  `${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;

// Home page: everyone sees every message, but only members get the author
// and date. For non-members we drop those fields here, so they never reach
// the view at all (not just hidden by an if in the template).
export async function index(req, res) {
  const isMember = Boolean(req.user?.is_member);
  const rows = await getAllMessages();

  const messages = rows.map((m) =>
    isMember
      ? {
          id: m.id,
          title: m.title,
          text: m.text,
          author: `${m.first_name} ${m.last_name}`,
          date: formatDate(m.created_at),
          isoDate: m.created_at.toISOString(),
        }
      : { id: m.id, title: m.title, text: m.text },
  );

  const isAdmin = Boolean(req.user?.is_admin);
  res.render("index", { title: "Members Only", messages, isMember, isAdmin });
}

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

// Only reached by admins (isAuthenticated + isAdmin in the router).
export async function deleteMessagePost(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(404).render("error", {
      title: "Not Found",
      message: "Message not found.",
    });
  }
  await deleteMessage(id);
  res.redirect("/");
}
