import express from "express";
import {
  createCharacter,
  deleteCharacter,
  editCharacter,
} from "../controllers/characterController.js";
import { authMiddleware } from "../utility/authMiddleware.js";

const characterRoutes = express.Router();

characterRoutes.post("/", authMiddleware, createCharacter);

characterRoutes.delete("/:id", authMiddleware, deleteCharacter);

characterRoutes.put("/:id", authMiddleware, editCharacter);

export default characterRoutes;
