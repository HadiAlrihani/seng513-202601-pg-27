import { pool } from "../authentication/dbConfig.js";

export const createCheckpoint = async (req, res) => {

  const {clubId} = req.params;
  const {checkpoint_num, checkpoint_name} = req.body;

try {
    const result = await pool.query(
      `INSERT INTO checkpoints (club_id, checkpoint_num, checkpoint_name)
       VALUES ($1, $2, $3)
       RETURNING *`
      [clubId, checkpoint_num, checkpoint_name]
    );

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching checkpoints:", error);
    return res.status(500).json({ error: "Failed to add checkpoints" });
  }
};


export const getCheckpointsByClub = async (req, res) => {
    const {clubId} = req.params;
try {
    const result = await pool.query(
      `SELECT *
      FROM checkpoints
      WHERE club_id = $1
      ORDER BY checkpoint_num ASC
      `,
      [clubId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching checkpoints:", error);
    return res.status(500).json({ error: "Failed to add checkpoints" });
  }
};

export const getCheckpointByNum = async (req, res) => {
    const {clubId, checkpointNum} = req.params;
try {
    const result = await pool.query(
      `SELECT *
      FROM checkpoints
      WHERE club_id = $1
      AND checkpoint_num = $2`,
      [clubId, checkpointNum]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching checkpoints:", error);
    return res.status(500).json({ error: "Failed to add checkpoints" });
  }
};

export const deleteCheckpoint = async (req, res) => {
    const {clubId, checkpointNum} = req.params;
try {
    await pool.query(
      `DELETE
      FROM checkpoints
      WHERE club_id = $1
      AND checkpoint_num = $2`,
      [clubId, checkpointNum]
    );

    res.json({message: "Checkpoint deleted"});
  } catch (error) {
    console.error("Error fetching checkpoints:", error);
    return res.status(500).json({ error: "Failed to add checkpoints" });
  }
};