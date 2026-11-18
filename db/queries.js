import pool from "./pool.js";

// ---------- Users ----------

export async function createUser({ firstName, lastName, username, passwordHash }) {
  const { rows } = await pool.query(
    `INSERT INTO users (first_name, last_name, username, password_hash)
     VALUES ($1, $2, LOWER($3), $4)
     RETURNING id, first_name, last_name, username, is_member, is_admin`,
    [firstName, lastName, username, passwordHash],
  );
  return rows[0];
}

export async function getUserByUsername(username) {
  const { rows } = await pool.query("SELECT * FROM users WHERE username = LOWER($1)", [username]);
  return rows[0];
}

export async function getUserById(id) {
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return rows[0];
}

export async function setMember(userId) {
  await pool.query("UPDATE users SET is_member = TRUE WHERE id = $1", [userId]);
}

// Admins are always members too, so they can see message authors.
export async function setAdmin(userId) {
  await pool.query("UPDATE users SET is_admin = TRUE, is_member = TRUE WHERE id = $1", [userId]);
}

// ---------- Messages ----------

export async function createMessage({ title, text, userId }) {
  const { rows } = await pool.query(
    `INSERT INTO messages (title, text, user_id)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [title, text, userId],
  );
  return rows[0];
}

// Returns every message joined with its author, newest first.
// Hiding the author from non-members is the controller's job (messageController.js).
export async function getAllMessages() {
  const { rows } = await pool.query(
    `SELECT m.id, m.title, m.text, m.created_at,
            u.first_name, u.last_name, u.username
     FROM messages m
     JOIN users u ON u.id = m.user_id
     ORDER BY m.created_at DESC`,
  );
  return rows;
}

export async function deleteMessage(id) {
  await pool.query("DELETE FROM messages WHERE id = $1", [id]);
}
