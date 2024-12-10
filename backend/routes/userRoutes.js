import express from "express";
import { registerUser, login, updateProfile } from "../controllers/userController.js";
import {
  validateUserLogin,
  validateUserRegistration,
  handleValidationErrors,
} from "../utility/validationMiddleware.js";
import {authMiddleware} from "../utility/authMiddleware.js";
import multer from "multer";

const userRoutes = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

userRoutes.post(
  "/register",
  validateUserRegistration,
  handleValidationErrors,
  registerUser
);
userRoutes.post("/login", validateUserLogin, login);

userRoutes.put("/profile", authMiddleware, upload.single("profileImage"), updateProfile);

export default userRoutes;
