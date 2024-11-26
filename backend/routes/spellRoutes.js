import express from "express";
import {
  getAllSpells,
  getSpellById,
} from "../controllers/spellController.js";

const router = express.Router();

// Get all spells
router.get("/", getAllSpells);

// Get a spell by ID
router.get("/:id", getSpellById);

export default router;
