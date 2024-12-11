import express from "express";
import { registerUser, login, updateProfile } from "../controllers/userController.js";
import {
  validateUserLogin,
  validateUserRegistration,
  handleValidationErrors,
} from "../utility/validationMiddleware.js";
import { authMiddleware } from "../utility/authMiddleware.js";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();

const userRoutes = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "user-profiles",
    allowed_formats: ["jpg", "png", "jpeg"],
    public_id: (req, file) => `${Date.now()}-${file.originalname.split(" ").join("_")}`,
  },
});

const upload = multer({ storage });

// Routes
userRoutes.post(
  "/register",
  validateUserRegistration,
  handleValidationErrors,
  registerUser
);
userRoutes.post("/login", validateUserLogin, login);

userRoutes.put("/profile", authMiddleware, upload.single("profileImage"), updateProfile);

export default userRoutes;
