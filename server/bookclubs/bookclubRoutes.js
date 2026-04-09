import express from "express";
import {
  getPublicClubs,
  joinClub,
  joinClubByCode,
} from "./bookclubController.js";

const router = express.Router();

router.get("/public", getPublicClubs);
router.post("/join", joinClub);
router.post("/join-by-code", joinClubByCode);

export default router;