import { pool } from "../authentication/dbConfig.js";

export const getPublicClubs = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM bookclubs WHERE public = true ORDER BY id ASC"
    );

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching public clubs:", error);
    return res.status(500).json({ error: "Failed to fetch public clubs" });
  }
};