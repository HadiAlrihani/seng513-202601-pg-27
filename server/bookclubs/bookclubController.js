import { pool } from "../authentication/dbConfig.js";

export const getPublicClubs = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM bookclubs WHERE visibility = 'public' ORDER BY id ASC"
    );

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching public clubs:", error);
    return res.status(500).json({ error: "Failed to fetch public clubs" });
  }
};

export const joinClub = async (req, res) => {
  const { userId, clubId } = req.body;

  if (!userId || !clubId) {
    return res.status(400).json({
      error: "userId and clubId are required",
    });
  }

  try {
    const clubResult = await pool.query(
      "SELECT * FROM bookclubs WHERE id = $1",
      [clubId]
    );

    if (clubResult.rows.length === 0) {
      return res.status(404).json({ error: "Club not found" });
    }

    const club = clubResult.rows[0];

    if (club.number_members >= club.max_members) {
      return res.status(400).json({ error: "Club is full" });
    }

    const existingMemberResult = await pool.query(
      "SELECT * FROM bookclub_members WHERE user_id = $1 AND club_id = $2",
      [userId, clubId]
    );

    if (existingMemberResult.rows.length > 0) {
      return res.status(400).json({ error: "User already joined this club" });
    }

    await pool.query(
      `INSERT INTO bookclub_members (user_id, club_id, user_role, progress_checkpoint)
       VALUES ($1, $2, $3, $4)`,
      [userId, clubId, "member", null]
    );

    await pool.query(
      "UPDATE bookclubs SET number_members = number_members + 1 WHERE id = $1",
      [clubId]
    );

    return res.status(200).json({
      message: "Joined club successfully",
      clubId,
    });
  } catch (error) {
    console.error("Error joining club:", error);
    return res.status(500).json({ error: "Failed to join club" });
  }
};

export const joinClubByCode = async (req, res) => {
  const { userId, code } = req.body;

  if (!userId || !code) {
    return res.status(400).json({
      error: "userId and code are required",
    });
  }

  try {
    const clubResult = await pool.query(
      "SELECT * FROM bookclubs WHERE club_code = $1 AND visibility = 'private'",
      [code]
    );

    if (clubResult.rows.length === 0) {
      return res.status(404).json({ error: "Invalid club code" });
    }

    const club = clubResult.rows[0];

    if (club.number_members >= club.max_members) {
      return res.status(400).json({ error: "Club is full" });
    }

    const existingMemberResult = await pool.query(
      "SELECT * FROM bookclub_members WHERE user_id = $1 AND club_id = $2",
      [userId, club.id]
    );

    if (existingMemberResult.rows.length > 0) {
      return res.status(400).json({ error: "User already joined this club" });
    }

    await pool.query(
      `INSERT INTO bookclub_members (user_id, club_id, user_role, progress_checkpoint)
       VALUES ($1, $2, $3, $4)`,
      [userId, club.id, "member", null]
    );

    await pool.query(
      "UPDATE bookclubs SET number_members = number_members + 1 WHERE id = $1",
      [club.id]
    );

    return res.status(200).json({
      message: "Joined private club successfully",
      club,
    });
  } catch (error) {
    console.error("Error joining club by code:", error);
    return res.status(500).json({ error: "Failed to join club by code" });
  }
};

export const getUserClubs = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    const result = await pool.query(
      `
      SELECT
        b.*,
        m.user_role,
        m.progress_checkpoint
      FROM bookclubs b
      JOIN bookclub_members m ON b.id = m.club_id
      WHERE m.user_id = $1
      ORDER BY b.id ASC
      `,
      [userId]
    );

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching user clubs:", error);
    return res.status(500).json({ error: "Failed to fetch joined clubs" });
  }
};

export const leaveClub = async (req, res) => {
  const { userId, clubId } = req.body;

  if (!userId || !clubId) {
    return res.status(400).json({ error: "userId and clubId are required" });
  }

  try {
    const existingMemberResult = await pool.query(
      "SELECT * FROM bookclub_members WHERE user_id = $1 AND club_id = $2",
      [userId, clubId]
    );

    if (existingMemberResult.rows.length === 0) {
      return res.status(404).json({ error: "Membership not found" });
    }

    await pool.query(
      "DELETE FROM bookclub_members WHERE user_id = $1 AND club_id = $2",
      [userId, clubId]
    );

    await pool.query(
      `
      UPDATE bookclubs
      SET number_members = CASE
        WHEN number_members > 0 THEN number_members - 1
        ELSE 0
      END
      WHERE id = $1
      `,
      [clubId]
    );

    return res.status(200).json({ message: "Left club successfully" });
  } catch (error) {
    console.error("Error leaving club:", error);
    return res.status(500).json({ error: "Failed to leave club" });
  }
};