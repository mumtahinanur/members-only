import { createMessage, getAllMessages, deleteMessage } from "../db/queries.js";

// e.g. "17 Nov 2026 · 8:27 PM"
const formatDate = (date) =>
  `${date.toLocaleDateString("en-GB", { dateStyle: "medium" })} · ` +
  `${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;

// Shape one database row for the home page. Non-members only get the
// title and text, so the author and date never reach their browser.
function toViewMessage(row, isMember) {
  const message = { id: row.id, title: row.title, text: row.text };
  if (!isMember) {
    return message;
  }
  return {
    ...message,
    author: `${row.first_name} ${row.last_name}`,
    date: formatDate(row.created_at),
    isoDate: row.created_at.toISOString(),
  };
}

// Home page: everyone sees every message; members also see author and date.
export async function index(req, res) {
  const isMember = Boolean(req.user?.is_member);
  const isAdmin = Boolean(req.user?.is_admin);

  const rows = await getAllMessages();
  const messages = rows.map((row) => toViewMessage(row, isMember));

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
