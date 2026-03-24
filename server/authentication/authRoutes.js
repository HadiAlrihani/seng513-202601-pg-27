// Defines API routes for authentication

import express from "express";
import { registerUser, loginUser } from "./authController.js";

const router = express.Router();

// register route
router.post("/register", registerUser);

// login route
router.post("/login", loginUser);

export default router;
