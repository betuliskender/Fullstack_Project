import express from "express";
import {
  createCharacter,
  deleteCharacter,
  editCharacter,
} from "../controllers/characterController.js";
import { authMiddleware } from "../utility/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createCharacter);

router.delete("/:id", authMiddleware, deleteCharacter);

router.put("/:id", authMiddleware, editCharacter);

export default router;
