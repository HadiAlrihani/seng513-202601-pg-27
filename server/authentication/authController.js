// Handles logic for register and login

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "./dbConfig.js";

// Register a new user
export const registerUser = async (req, res) => {
  const { username, email, user_password } = req.body;

  try {
    // Check if email already exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(user_password, 10);

    // Insert user into DB
    const newUser = await pool.query(
      "INSERT INTO users (username, email, user_password) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username, email, hashedPassword],
    );

    // Create token
    const token = jwt.sign({ id: newUser.rows[0].id }, process.env.SECRET_KEY);

    res.status(201).json({
      message: "User registered",
      user: newUser.rows[0],
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { email, user_password } = req.body;

  try {
    // Find user
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = result.rows[0];

    // Check password
    const isMatch = await bcrypt.compare(user_password, user.user_password);

    if (!isMatch) {
      return res.status(400).json({ error: "Wrong password" });
    }

    // Create token
    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY);

    res.json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
