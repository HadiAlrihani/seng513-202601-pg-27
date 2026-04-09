import express from "express";
import {
  createCheckpoint,
  getCheckpointsByClub,
  getCheckpointByNum,
  deleteCheckpoint
} from "./checkPointController.js";

const router = express.Router();

router.post("/:clubId", createCheckpoint);
router.get("/:clubId", getCheckpointsByClub);
router.get("/:clubId/:checkpointNum", getCheckpointByNum);
router.delete("/:clubId/:checkpointNum", deleteCheckpoint);

export default router;