// Main server file

import express from "express";
import cors from "cors";
import authRoutes from "./authentication/authRoutes.js";
import { pool } from "./authentication/dbConfig.js";
import bookclubRoutes from "./bookclubs/bookclubRoutes.js";
import genreRoutes from "./genres/genreRoutes.js";


const app = express();
const PORT = 5000;

app.use(cors());
// Middleware to read JSON data from requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Test route to check server + database
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "Server is running and DB is connected",
      time: result.rows[0],
    });
  } catch (err) {
    console.error("Route DB error:", err.message);
    res.status(500).json({
      error: "Database connection failed",
      details: err.message,
    });
  }
});
// All auth routes (register + login)
app.use("/users", authRoutes);
app.use("/bookclubs", bookclubRoutes);
app.use("/genres", genreRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
