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
    const { user_id, new_email } = req.body;

    try {
        //check if the  requested username already exists
        const existing_email = await pool.query(
            "SELECT 1 FROM users WHERE email = $1 AND id != $2",
            [new_email, user_id]
        );

        if (existing_email.rows.length > 0) {
            return res.status(400).json({ error: "Email already in use"});
        }

        //update username for this user in db
        const updated_user = await pool.query(
            "UPDATE users SET email = $1 WHERE id = $2 RETURNING email",
            [new_email, user_id]
        );

        res.status(200).json({
            message: "email updated",
            new_email: updated_user.rows[0].email });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "server error"})
    }
};

export const resetPassword = async (req, res) => {
    const { user_id, old_password, new_password } = req.body;

    try {

        // ensure the old password is correct
        const stored_hash = await pool.query(
            "SELECT user_password FROM users WHERE id = $1",
            [user_id]
        );

        const isCorrectPassword = await bcrypt.compare(old_password, stored_hash.rows[0].user_password);

        if (!isCorrectPassword) {
            res.status(400).json({ error: "Current password entered is incorrect" });
        }

        // update password with hash of new password
        const new_hash = await bcrypt.hash(new_password, 10);

        //update username for this user in db
        const updated_user = await pool.query(
            "UPDATE users SET user_password = $1 WHERE id = $2 RETURNING user_password",
            [new_hash, user_id]
        );

        res.status(200).json({ message: "password updated" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "server error"})
    }
};