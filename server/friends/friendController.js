import { pool } from "../authentication/dbConfig.js";

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

export const searchUsers = async (req, res) => {
    const { query = "", userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: "userId is required" });
    }

    try {
        const result = await pool.query(
            `
            SELECT 
                u.id,
                u.username,
                CASE
                    WHEN fr.status = 'accepted' THEN 'friends'
                    WHEN fr.status = 'pending' AND fr.sender_id = $2 THEN 'pending_sent'
                    WHEN fr.status = 'pending' AND fr.receiver_id = $2 THEN 'pending_received'
                    ELSE 'none'
                END AS relationship
            FROM users u
            LEFT JOIN friend_requests fr
                ON (
                    (fr.sender_id = $2 AND fr.receiver_id = u.id)
                    OR
                    (fr.receiver_id = $2 AND fr.sender_id = u.id)
                )
            WHERE LOWER(u.username) LIKE LOWER($1)
              AND u.id <> $2
            ORDER BY u.username
            `,
            [`%${query}%`, Number(userId)]
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Search failed" });
    }
};

export const sendRequest = async (req, res) => {
    const { senderId, receiverId } = req.body;

    if (!senderId || !receiverId) {
        return res.status(400).json({ error: "senderId and receiverId are required" });
    }

    if (Number(senderId) === Number(receiverId)) {
        return res.status(400).json({ error: "Cannot add yourself" });
    }

    try {
        const existing = await pool.query(
            `
            SELECT *
            FROM friend_requests
            WHERE (sender_id = $1 AND receiver_id = $2)
               OR (sender_id = $2 AND receiver_id = $1)
            `,
            [Number(senderId), Number(receiverId)]
        );

        if (existing.rows.length > 0) {
            const existingRequest = existing.rows[0];

            if (existingRequest.status === "accepted") {
                return res.status(400).json({ error: "You are already friends" });
            }

            if (existingRequest.status === "pending") {
                return res.status(400).json({ error: "Request already exists" });
            }

            if (existingRequest.status === "declined") {
                await pool.query(
                    `
                    DELETE FROM friend_requests
                    WHERE id = $1
                    `,
                    [existingRequest.id]
                );
            }
        }

        await pool.query(
            `
            INSERT INTO friend_requests (sender_id, receiver_id)
            VALUES ($1, $2)
            `,
            [Number(senderId), Number(receiverId)]
        );

        res.json({ message: "Request sent" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to send request" });
    }
};

export const getRequests = async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await pool.query(
            `
            SELECT fr.id, fr.sender_id, u.username
            FROM friend_requests fr
            JOIN users u ON fr.sender_id = u.id
            WHERE fr.receiver_id = $1
              AND fr.status = 'pending'
            ORDER BY fr.created_at DESC
            `,
            [Number(userId)]
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch requests" });
    }
};

export const acceptRequest = async (req, res) => {
    const { requestId } = req.params;

    try {
        await pool.query(
            `
            UPDATE friend_requests
            SET status = 'accepted'
            WHERE id = $1
            `,
            [Number(requestId)]
        );

        res.json({ message: "Accepted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to accept" });
    }
};

export const declineRequest = async (req, res) => {
    const { requestId } = req.params;

    try {
        await pool.query(
            `
            UPDATE friend_requests
            SET status = 'declined'
            WHERE id = $1
            `,
            [Number(requestId)]
        );

        res.json({ message: "Declined" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to decline" });
    }
};

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
            ORDER BY u.username
            `,
            [Number(userId)]
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch friends" });
    }
};

export const getFriendBookshelf = async (req, res) => {
    const { userId, friendId } = req.params;

    try {
        const friendship = await pool.query(
            `
            SELECT 1
            FROM friend_requests
            WHERE status = 'accepted'
              AND (
                (sender_id = $1 AND receiver_id = $2)
                OR
                (sender_id = $2 AND receiver_id = $1)
              )
            LIMIT 1
            `,
            [Number(userId), Number(friendId)]
        );

        if (friendship.rows.length === 0) {
            return res.status(403).json({ error: "You can only view accepted friends' shelves." });
        }

        const friendResult = await pool.query(
            `SELECT id, username FROM users WHERE id = $1`,
            [Number(friendId)]
        );

        if (friendResult.rows.length === 0) {
            return res.status(404).json({ error: "Friend not found." });
        }

        const booksResult = await pool.query(
            `
            SELECT ub.book_id, ub.read_status, ub.date_started, ub.date_finished,
                   ub.rating, ub.review, ub.reviewed_at, ub.is_favorite,
                   b.title, b.author, b.cover_image, b.book_length
            FROM user_books ub
            JOIN books b ON ub.book_id = b.id
            WHERE ub.user_id = $1
            ORDER BY b.title ASC
            `,
            [Number(friendId)]
        );

        const grouped = {
            to_read: [],
            reading: [],
            finished: [],
        };

        for (const book of booksResult.rows) {
            if (grouped[book.read_status]) {
                grouped[book.read_status].push(book);
            }
        }

        return res.json({
            friend: friendResult.rows[0],
            shelf: grouped,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch friend's bookshelf" });
    }
};