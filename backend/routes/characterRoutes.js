import express from "express";
import { createCharacter, deleteCharacter, editCharacter } from "../controllers/characterController.js";

const router = express.Router();

router.post("/", createCharacter);

router.delete("/:id", deleteCharacter);

router.put("/:id", editCharacter);

export default router;