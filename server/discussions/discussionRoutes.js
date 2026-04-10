import express from "express";
import {
  getClubCheckpoints,
  updateUserProgress,
  getCheckpointMessages,
  postCheckpointMessage,
} from "./discussionController.js";

const router = express.Router();

router.get("/clubs/:clubId/checkpoints/:userId", getClubCheckpoints);
router.patch("/progress", updateUserProgress);
router.get(
  "/clubs/:clubId/checkpoints/:checkpointNum/messages/:userId",
  getCheckpointMessages
);
router.post("/messages", postCheckpointMessage);

export default router;