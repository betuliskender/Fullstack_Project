import express from "express";
import { registerUser, login } from "../controllers/userController.js";
import {
  validateUserLogin,
  validateUserRegistration,
  handleValidationErrors,
} from "../utility/validationMiddleware.js";

const router = express.Router();

router.post(
  "/register",
  validateUserRegistration,
  handleValidationErrors,
  registerUser
);
router.post("/login", validateUserLogin, login);

export default router;
