import express from "express";
import cors from "cors";
import authRoutes from "./authentication/authRoutes.js";
import { pool } from "./authentication/dbConfig.js";
import adminRoutes from "./admin/adminRoutes.js";
import bookclubRoutes from "./bookclubs/bookclubRoutes.js";
import profileRoutes from "./profile/profileRoutes.js";
import bookshelfRoutes from "./bookshelf/bookshelfRoutes.js";
import discussionRoutes from "./discussions/discussionRoutes.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

app.use("/users", authRoutes);
app.use("/admin", adminRoutes);
app.use("/bookclubs", bookclubRoutes);
app.use("/profile", profileRoutes);
app.use("/bookshelf", bookshelfRoutes);
app.use("/discussions", discussionRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
