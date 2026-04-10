// Middleware to protect routes that require authentication.
// Reads the JWT from the Authorization header, verifies it,
// and attaches the user's ID to req.userId for use in controllers.

import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Expect header in format: "Bearer <token>"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.userId = decoded.id; // Attach user ID for use in route handlers
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
