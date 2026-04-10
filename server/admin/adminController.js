// Controller for admin-only operations.

import { pool } from "../authentication/dbConfig.js";

// GET /admin/users
// Returns all registered users.
export const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, email, is_admin, created_at FROM users ORDER BY created_at ASC"
    );
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({ error: "Failed to fetch users" });
  }
};

// DELETE /admin/users/:userId
// Deletes a user account. Cannot delete your own account.
export const deleteUser = async (req, res) => {
  const targetId = parseInt(req.params.userId);

  if (targetId === req.userId) {
    return res.status(400).json({ error: "Cannot delete your own account" });
  }

  try {
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING id, username",
      [targetId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ message: "User deleted", user: result.rows[0] });
  } catch (err) {
    console.error("Error deleting user:", err);
    return res.status(500).json({ error: "Failed to delete user" });
  }
};
