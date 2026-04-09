import express from "express";
import {
  getPublicClubs,
  joinClub,
  joinClubByCode,
  getUserClubs,
  leaveClub,
  createClub
} from "./bookclubController.js";

const router = express.Router();

router.get("/public", getPublicClubs);
router.get("/user/:userId", getUserClubs);
router.post("/join", joinClub);
router.post("/join-by-code", joinClubByCode);
router.post("/leave", leaveClub);
router.post("/club", createClub)

export default router;