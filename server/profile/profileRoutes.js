// Defines API routes for updating profile information

import express from "express";
import { updateUsername, updateEmail, resetPassword, deactivateAccount } from "./profileController.js";

const router = express.Router();

// change username route
router.patch("/update-username", updateUsername);

// change email route
router.patch("/update-email", updateEmail);

// reset password route
router.patch("/reset-password", resetPassword);

//Deactivate account route
router.delete("/deactivate-account", deactivateAccount);

export default router;