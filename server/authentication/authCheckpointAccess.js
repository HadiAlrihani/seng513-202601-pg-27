import {pool} from "../authentication/dbConfig.js";

export const manageCheckpoint = async (req, res, next) => {

    const userId = req.body.userId;
    const {clubId} = req.params;
  

try {
    const userResult = await pool.query(
    `SELECT isAdmin
    FROM users 
    WHERE id = $1
    `,
      [userId]
    );

    const isAdmin = userResult.rows[0]?.isadmin === true;

    if (isAdmin) {
        return next();
    } 

    const memberResult = await pool.query(
    
    `SELECT user_role
    FROM bookclub_members 
    WHERE user_id = $1 AND club_id = $2`,
    [userId, clubId]
    );

    const isModerator = memberResult.rows.length > 0 && memberResult.rows[0].user_role === "moderator";

        if (!isModerator){
            return res.status(400).json({error: "You are not moderator."})
    } 
    return next();
  
  
}catch (error) {
        console.error("Checkpoint error:", error);
        return res.status(500).json({ error: "error" });
    }
};