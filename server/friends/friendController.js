import { pool } from "../authentication/dbConfig.js";

// CREATE TABLE (safe init)
export const initializeFriendRequestsTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS friend_requests (
                id SERIAL PRIMARY KEY,
                sender_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                receiver_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                status VARCHAR(20) NOT NULL DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT no_self_request CHECK (sender_id <> receiver_id)
            );
        `);
        console.log("friend_requests table ready");
    } catch (err) {
        console.error("Error creating friend_requests table:", err);
    }
};

// SEARCH USERS
export const searchUsers = async (req, res) => {
    const { query, userId } = req.query;

    try {
        const result = await pool.query(
            `
            SELECT id, username
            FROM users
            WHERE LOWER(username) LIKE LOWER($1)
            AND id <> $2
            ORDER BY username
            `,
            [`%${query}%`, userId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Search failed" });
    }
};

// SEND REQUEST
export const sendRequest = async (req, res) => {
    const { senderId, receiverId } = req.body;

    if (senderId === receiverId) {
        return res.status(400).json({ error: "Cannot add yourself" });
    }

    try {
        const existing = await pool.query(
            `
            SELECT * FROM friend_requests
            WHERE (sender_id = $1 AND receiver_id = $2)
               OR (sender_id = $2 AND receiver_id = $1)
            `,
            [senderId, receiverId]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({ error: "Request already exists" });
        }

        await pool.query(
            `
            INSERT INTO friend_requests (sender_id, receiver_id)
            VALUES ($1, $2)
            `,
            [senderId, receiverId]
        );

        res.json({ message: "Request sent" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to send request" });
    }
};

// INCOMING REQUESTS
export const getRequests = async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await pool.query(
            `
            SELECT fr.id, u.username
            FROM friend_requests fr
            JOIN users u ON fr.sender_id = u.id
            WHERE fr.receiver_id = $1
            AND fr.status = 'pending'
            `,
            [userId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch requests" });
    }
};

// ACCEPT
export const acceptRequest = async (req, res) => {
    const { requestId } = req.params;

    try {
        await pool.query(
            `UPDATE friend_requests SET status='accepted' WHERE id=$1`,
            [requestId]
        );

        res.json({ message: "Accepted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to accept" });
    }
};

// DECLINE
export const declineRequest = async (req, res) => {
    const { requestId } = req.params;

    try {
        await pool.query(
            `UPDATE friend_requests SET status='declined' WHERE id=$1`,
            [requestId]
        );

        res.json({ message: "Declined" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to decline" });
    }
};

// FRIEND LIST
export const getFriends = async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await pool.query(
            `
            SELECT u.id, u.username
            FROM friend_requests fr
            JOIN users u
            ON (
                (fr.sender_id = $1 AND u.id = fr.receiver_id)
                OR
                (fr.receiver_id = $1 AND u.id = fr.sender_id)
            )
            WHERE fr.status = 'accepted'
            `,
            [userId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch friends" });
    }
};