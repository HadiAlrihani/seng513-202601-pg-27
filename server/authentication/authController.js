import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "./dbConfig.js";

export const registerUser = async (req, res) => {
  const { email, username, user_password } = req.body;

  try {
    const existingEmail = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingEmail.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const existingUsername = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (existingUsername.rows.length > 0) {
      return res.status(400).json({ error: "Username already in use" });
    }

    const hashedPassword = await bcrypt.hash(user_password, 10);

    const newUser = await pool.query(
      `
      INSERT INTO users (username, email, user_password)
      VALUES ($1, $2, $3)
      RETURNING id, username, email
      `,
      [username, email, hashedPassword]
    );

    const token = jwt.sign({ id: newUser.rows[0].id }, process.env.SECRET_KEY);

    res.status(201).json({
      message: "User registered",
      user: newUser.rows[0],
      token,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  const { username_or_email, user_password } = req.body;

  try {
    const usernameResult = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username_or_email]
    );

    let result = usernameResult;

    if (usernameResult.rows.length === 0) {
      const emailResult = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [username_or_email]
      );

      result = emailResult;

      if (emailResult.rows.length === 0) {
        return res.status(400).json({ error: "User not found" });
      }
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(user_password, user.user_password);

    if (!isMatch) {
      return res.status(400).json({ error: "Wrong password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};