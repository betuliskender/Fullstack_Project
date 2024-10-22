import express from "express";
import multer from "multer";
import path from "path";
import {
  createCampaign,
  addCharacterToCampaign,
  editCampaign,
  deleteCampaign,
  removeCharacterFromCampaign,
  changeCharacterInCampaign,
  getAllCampaigns,
  getCampaignById,
  uploadMapToCampaign,
} from "../controllers/campaignController.js";
import { authMiddleware } from "../utility/authMiddleware.js";

const router = express.Router();

// Set up storage with Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/"); // Save files to the "uploads" folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Use unique name for each file
  },
});

// Configure Multer middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/; // Accept only image formats
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});

router.post("/", authMiddleware, createCampaign);
router.post("/:campaignId/characters", authMiddleware, addCharacterToCampaign);
router.put("/:campaignId", authMiddleware, editCampaign);
router.delete("/:campaignId", authMiddleware, deleteCampaign);
router.put(
  "/:campaignId/characters/:characterId",
  authMiddleware,
  changeCharacterInCampaign
);
router.delete(
  "/:campaignId/characters/:characterId",
  authMiddleware,
  removeCharacterFromCampaign
);
router.get("/:campaignId", authMiddleware, getCampaignById);
router.get("/", authMiddleware, getAllCampaigns);

// Route to upload a map to a campaign
router.post(
  "/:campaignId/upload-map",
  authMiddleware,
  upload.single("mapImage"),
  uploadMapToCampaign
);

export default router;
