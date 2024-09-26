import express from "express";
import { registerUser, login } from "../controllers/userController.js";
import {
  validateUserLogin,
  validateUserRegistration,
  handleValidationErrors,
} from "../utility/validationMiddleware.js";

const userRoutes = express.Router();

userRoutes.post(
  "/register",
  validateUserRegistration,
  handleValidationErrors,
  registerUser
);
userRoutes.post("/login", validateUserLogin, login);

export default userRoutes;
