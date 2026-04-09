import express from "express";
import {
  createCheckpoint,
  getCheckpointsByClub,
  getCheckpointByNum,
  deleteCheckpoint
} from "./checkPointController.js";

import { manageCheckpoint } from "../authentication/authCheckpointAccess.js";
const router = express.Router();

router.post("/:clubId", manageCheckpoint, createCheckpoint);
router.get("/:clubId", getCheckpointsByClub);
router.get("/:clubId/:checkpointNum", getCheckpointByNum);
router.delete("/:clubId/:checkpointNum", manageCheckpoint, deleteCheckpoint);

export default router;