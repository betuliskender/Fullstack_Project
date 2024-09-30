import express from "express";
import { createSession, editSession, deleteSession } from "../controllers/sessionController.js";
import { authMiddleware } from "../utility/authMiddleware.js";

const router = express.Router();

router.post("/:campaignId/sessions", authMiddleware, createSession);
router.put("/:campaignId/sessions/:sessionId", authMiddleware, editSession);
router.delete("/:campaignId/sessions/:sessionId", authMiddleware, deleteSession);


export default router;
