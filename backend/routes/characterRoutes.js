import express from "express";
import {
  createCharacter,
  deleteCharacter,
  editCharacter,
  getAllCharacters,
  getCharacterById,
  addSpellsToCharacter,
  addSkillsToCharacter
} from "../controllers/characterController.js";
import { authMiddleware } from "../utility/authMiddleware.js";

const characterRoutes = express.Router();

characterRoutes.post("/", authMiddleware, createCharacter);

characterRoutes.delete("/:id", authMiddleware, deleteCharacter);

characterRoutes.put("/:id", authMiddleware, editCharacter);

characterRoutes.get("/:id", authMiddleware, getCharacterById);

characterRoutes.get("/", authMiddleware, getAllCharacters);

// Add spells to a character
characterRoutes.post("/:characterId/spells", authMiddleware, addSpellsToCharacter);

// Add skills to a character
characterRoutes.post("/:characterId/skills", authMiddleware, addSkillsToCharacter);

export default characterRoutes;




