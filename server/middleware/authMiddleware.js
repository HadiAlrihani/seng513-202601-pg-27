// Middleware to protect routes that require authentication or admin access.

import jwt from "jsonwebtoken";
import { pool } from "../authentication/dbConfig.js";

// Verifies the JWT and attaches req.userId for use in route handlers.
export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Restricts routes to admin users only. Must run after requireAuth.
export const requireAdmin = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT is_admin FROM users WHERE id = $1",
      [req.userId]
    );

    if (!result.rows[0]?.is_admin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    next();
  } catch (err) {
    return res.status(500).json({ error: "Failed to verify admin status" });
  }
};
