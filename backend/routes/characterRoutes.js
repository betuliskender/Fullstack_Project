import express from "express";
import {
  createCharacter,
  deleteCharacter,
  editCharacter,
  getAllCharacters,
  getCharacterById
} from "../controllers/characterController.js";
import { authMiddleware } from "../utility/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createCharacter);

router.delete("/:id", authMiddleware, deleteCharacter);

router.put("/:id", authMiddleware, editCharacter);

router.get("/", authMiddleware, getAllCharacters);

router.get("/:id", authMiddleware, getCharacterById);

export default router;
