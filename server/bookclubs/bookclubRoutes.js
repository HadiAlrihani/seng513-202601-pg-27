import express from "express";
import {
  getPublicClubs,
  joinClub,
  joinClubByCode,
  getUserClubs,
  leaveClub,
  setRecentClub,
  getRecentClub
} from "./bookclubController.js";

const router = express.Router();

router.get("/public", getPublicClubs);
router.get("/user/:userId", getUserClubs);
router.post("/join", joinClub);
router.post("/join-by-code", joinClubByCode);
router.post("/leave", leaveClub);
router.patch("/set-recent-club", setRecentClub)
router.get("/get-recent-club", getRecentClub);

export default router;