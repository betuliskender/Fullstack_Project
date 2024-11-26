import express from "express";
import {
  getAllSkills,
  getSkillById,
} from "../controllers/skillController.js";

const router = express.Router();

// Get all skills
router.get("/", getAllSkills);

// Get a skill by ID
router.get("/:id", getSkillById);

export default router;