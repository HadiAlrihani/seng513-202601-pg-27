import express from "express";
import { getPublicClubs, joinClub } from "./bookclubController.js";

const router = express.Router();

router.get("/public", getPublicClubs);
router.post("/join", joinClub);

export default router;