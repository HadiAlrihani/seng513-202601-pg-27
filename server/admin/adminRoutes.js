import express from "express";
import { requireAuth, requireAdmin } from "../middleware/authMiddleware.js";
import { getAllUsers, deleteUser, getAllClubs, deleteClub } from "./adminController.js";

const router = express.Router();

// All admin routes require authentication and admin status
router.use(requireAuth, requireAdmin);

router.get("/users", getAllUsers);
router.delete("/users/:userId", deleteUser);
router.get("/clubs", getAllClubs);
router.delete("/clubs/:clubId", deleteClub);

export default router;
