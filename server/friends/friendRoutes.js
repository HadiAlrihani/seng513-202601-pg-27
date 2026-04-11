import express from "express";
import {
    searchUsers,
    sendRequest,
    getRequests,
    acceptRequest,
    declineRequest,
    getFriends,
} from "./friendController.js";

const router = express.Router();

router.get("/search", searchUsers);
router.post("/request", sendRequest);
router.get("/requests/:userId", getRequests);
router.patch("/request/:requestId/accept", acceptRequest);
router.patch("/request/:requestId/decline", declineRequest);
router.get("/:userId", getFriends);

export default router;