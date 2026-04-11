import { pool } from "../authentication/dbConfig.js";

const parsePositiveInt = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

const getMembership = async (userId, clubId) => {
  const result = await pool.query(
    `
    SELECT
      m.user_id,
      m.club_id,
      m.user_role,
      m.progress_checkpoint,
      b.club_name,
      b.book_title
    FROM bookclub_members m
    JOIN bookclubs b ON b.id = m.club_id
    WHERE m.user_id = $1 AND m.club_id = $2
    `,
    [userId, clubId]
  );

  return result.rows[0] || null;
};

export const getClubCheckpoints = async (req, res) => {
  const clubId = parsePositiveInt(req.params.clubId);
  const userId = parsePositiveInt(req.params.userId);

  if (!clubId || !userId) {
    return res.status(400).json({ error: "Valid clubId and userId are required" });
  }

  try {
    const membership = await getMembership(userId, clubId);

    if (!membership) {
      return res.status(403).json({ error: "You must join this club first" });
    }

    const checkpointsResult = await pool.query(
      `
      SELECT checkpoint_num, checkpoint_name
      FROM checkpoints
      WHERE club_id = $1
      ORDER BY checkpoint_num ASC
      `,
      [clubId]
    );

    const currentProgress = membership.progress_checkpoint ?? 0;

    const checkpoints = checkpointsResult.rows.map((checkpoint) => ({
      ...checkpoint,
      is_unlocked: checkpoint.checkpoint_num <= currentProgress,
    }));

    return res.status(200).json({
      club: {
        id: clubId,
        club_name: membership.club_name,
        book_title: membership.book_title,
        user_role: membership.user_role,
        progress_checkpoint: currentProgress,
      },
      checkpoints,
    });
  } catch (error) {
    console.error("Error fetching club checkpoints:", error);
    return res.status(500).json({ error: "Failed to fetch checkpoints" });
  }
};

export const updateUserProgress = async (req, res) => {
  const clubId = parsePositiveInt(req.body.clubId);
  const userId = parsePositiveInt(req.body.userId);
  const progressCheckpoint = parsePositiveInt(req.body.progressCheckpoint);

  if (!clubId || !userId || !progressCheckpoint) {
    return res.status(400).json({
      error: "Valid clubId, userId, and progressCheckpoint are required",
    });
  }

  try {
    const membership = await getMembership(userId, clubId);

    if (!membership) {
      return res.status(403).json({ error: "You must join this club first" });
    }

    const checkpointExists = await pool.query(
      `
      SELECT 1
      FROM checkpoints
      WHERE club_id = $1 AND checkpoint_num = $2
      `,
      [clubId, progressCheckpoint]
    );

    if (checkpointExists.rows.length === 0) {
      return res.status(404).json({ error: "Checkpoint not found" });
    }

    await pool.query(
      `
      UPDATE bookclub_members
      SET progress_checkpoint = $3
      WHERE user_id = $1 AND club_id = $2
      `,
      [userId, clubId, progressCheckpoint]
    );

    return res.status(200).json({
      message: "Progress updated successfully",
      progress_checkpoint: progressCheckpoint,
    });
  } catch (error) {
    console.error("Error updating progress:", error);
    return res.status(500).json({ error: "Failed to update progress" });
  }
};

export const getCheckpointMessages = async (req, res) => {
  const clubId = parsePositiveInt(req.params.clubId);
  const checkpointNum = parsePositiveInt(req.params.checkpointNum);
  const userId = parsePositiveInt(req.params.userId);

  if (!clubId || !checkpointNum || !userId) {
    return res.status(400).json({
      error: "Valid clubId, checkpointNum, and userId are required",
    });
  }

  try {
    const membership = await getMembership(userId, clubId);

    if (!membership) {
      return res.status(403).json({ error: "You must join this club first" });
    }

    const currentProgress = membership.progress_checkpoint ?? 0;

    if (checkpointNum > currentProgress) {
      return res.status(403).json({
        error: "This discussion is still locked",
      });
    }

    const checkpointResult = await pool.query(
      `
      SELECT checkpoint_name
      FROM checkpoints
      WHERE club_id = $1 AND checkpoint_num = $2
      `,
      [clubId, checkpointNum]
    );

    if (checkpointResult.rows.length === 0) {
      return res.status(404).json({ error: "Checkpoint not found" });
    }

    const messagesResult = await pool.query(
      `
      SELECT
        cm.id,
        cm.club_id,
        cm.checkpoint_num,
        cm.user_id,
        u.username,
        cm.message_text,
        cm.created_at
      FROM checkpoint_messages cm
      JOIN users u ON u.id = cm.user_id
      WHERE cm.club_id = $1 AND cm.checkpoint_num = $2
      ORDER BY cm.created_at ASC, cm.id ASC
      `,
      [clubId, checkpointNum]
    );

    return res.status(200).json({
      checkpoint: {
        checkpoint_num: checkpointNum,
        checkpoint_name: checkpointResult.rows[0].checkpoint_name,
      },
      messages: messagesResult.rows,
    });
  } catch (error) {
    console.error("Error fetching checkpoint messages:", error);
    return res.status(500).json({ error: "Failed to fetch messages" });
  }
};

export const postCheckpointMessage = async (req, res) => {
  const clubId = parsePositiveInt(req.body.clubId);
  const checkpointNum = parsePositiveInt(req.body.checkpointNum);
  const userId = parsePositiveInt(req.body.userId);
  const messageText = (req.body.messageText || "").trim();

  if (!clubId || !checkpointNum || !userId || !messageText) {
    return res.status(400).json({
      error: "Valid clubId, checkpointNum, userId, and messageText are required",
    });
  }

  try {
    const membership = await getMembership(userId, clubId);

    if (!membership) {
      return res.status(403).json({ error: "You must join this club first" });
    }

    const currentProgress = membership.progress_checkpoint ?? 0;

    if (checkpointNum > currentProgress) {
      return res.status(403).json({
        error: "This discussion is still locked",
      });
    }

    const checkpointExists = await pool.query(
      `
      SELECT 1
      FROM checkpoints
      WHERE club_id = $1 AND checkpoint_num = $2
      `,
      [clubId, checkpointNum]
    );

    if (checkpointExists.rows.length === 0) {
      return res.status(404).json({ error: "Checkpoint not found" });
    }

    const insertedResult = await pool.query(
      `
      INSERT INTO checkpoint_messages (club_id, checkpoint_num, user_id, message_text)
      VALUES ($1, $2, $3, $4)
      RETURNING id, club_id, checkpoint_num, user_id, message_text, created_at
      `,
      [clubId, checkpointNum, userId, messageText]
    );

    const usernameResult = await pool.query(
      "SELECT username FROM users WHERE id = $1",
      [userId]
    );

    //sets the last updated club/discussion of the user
    // const setDiscussionProgress = await pool.query(
    //   `UPDATE users
    //    SET last_updated_club = $1, last_updated_checkpoint = $2
    //    WHERE id = $3`,
    //    [clubId, checkpointNum, userId]
    // );

    return res.status(201).json({
      message: "Message posted successfully",
      postedMessage: {
        ...insertedResult.rows[0],
        username: usernameResult.rows[0]?.username || "Unknown User",
      },
    });
  } catch (error) {
    console.error("Error posting checkpoint message:", error);
    return res.status(500).json({ error: "Failed to post message" });
  }
};

export const getRecentDiscussion = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "user does not exist" });
  }

  try {
    const result = await pool.query(
      "SELECT last_updated_club, last_updated_checkpoint FROM users WHERE id = $1",
      [userId]
    );

    console.log("Query result:", result.rows);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const { last_updated_club, last_updated_checkpoint } = result.rows[0];

    console.log({ last_updated_club, last_updated_checkpoint });

    if (last_updated_club == null || last_updated_checkpoint == null) {
      return res.status(400).json({
        error: "Missing checkpoint or club or both"
      });
    }

    return res.status(200).json({
      club_id: last_updated_club,
      checkpoint_num: last_updated_checkpoint
    });

  } catch (err) {
    console.error("FULL ERROR:", err);
    return res.status(500).json({ error: "server error" });
  }
};