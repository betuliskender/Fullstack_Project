import express from "express";
import { createCharacter } from "../controllers/characterController.js";

const router = express.Router();

// Create Character Endpoint
router.post("/", createCharacter);

export default router;