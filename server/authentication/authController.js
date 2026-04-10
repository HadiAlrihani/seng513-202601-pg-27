// Handles logic for register and login

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "./dbConfig.js";

// Register a new user
export const registerUser = async (req, res) => {
  const { email, username, user_password } = req.body;

  try {
    // Check if email already exists
    const existingEmail = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );

    if (existingEmail.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const existingUsername = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username],
    );

    if (existingUsername.rows.length > 0) {
      return res.status(400).json({ error: "Username already in use"})
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
  const { username_or_email, user_password } = req.body;

  try {
    // Find user, first by username, then by email
    const username_result = await pool.query("SELECT * FROM users WHERE username = $1", 
      [username_or_email],
    );

    let result = username_result

    if (username_result.rows.length === 0) {
      const email_result = await pool.query("SELECT * FROM users WHERE email = $1",
        [username_or_email],
      );
      result = email_result
      if (email_result.rows.length === 0) {
        return res.status(400).json({ error: "User not found" });
      }
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
      user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
