import bcrypt from "bcrypt";
import { pool } from "../authentication/dbConfig.js";

export const updateUsername = async (req, res) => {
    const { user_id, new_username } = req.body;

    try {
        //check if the  requested username already exists
        const existing_username = await pool.query(
            "SELECT 1 FROM users WHERE username = $1 AND id != $2",
            [new_username, user_id]
        );

        if (existing_username.rows.length > 0) {
            return res.status(400).json({ error: "Username already taken"});
        }

        //update username for this user in db
        const updated_user = await pool.query(
            "UPDATE users SET username = $1 WHERE id = $2 RETURNING username",
            [new_username, user_id]
        );

        res.status(200).json({
            message: "username updated",
            new_username: updated_user.rows[0].username });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "server error"})
    }
};

export const updateEmail = async (req, res) => {
    console.log("placeholder")
};

export const resetPassword = async (req, res) => {
    console.log("placeholder")
};