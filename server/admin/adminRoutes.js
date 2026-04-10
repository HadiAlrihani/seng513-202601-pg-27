import express from "express";
import { requireAuth, requireAdmin } from "../middleware/authMiddleware.js";
import { getAllUsers, deleteUser } from "./adminController.js";

const router = express.Router();

// All admin routes require authentication and admin status
router.use(requireAuth, requireAdmin);

router.get("/users", getAllUsers);
router.delete("/users/:userId", deleteUser);

export default router;
