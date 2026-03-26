import express from "express";
import { getPublicClubs } from "./bookclubController.js";

const router = express.Router();

router.get("/public", getPublicClubs);

export default router;