import express from "express";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
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
  deleteMapFromCampaign,
} from "../controllers/campaignController.js";
import { authMiddleware } from "../utility/authMiddleware.js";
import Map from "../models/mapModel.js";
import Campaign from "../models/campaignModel.js";

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "dnd-maps",
    allowed_formats: ["jpg", "png", "jpeg"],
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      return uniqueSuffix + path.extname(file.originalname);
    },
  },
});

const upload = multer({ storage: storage });

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

router.post(
  "/:campaignId/upload-map",
  authMiddleware,
  upload.single("mapImage"),
  async (req, res) => {
    try {
      const mapUrl = req.file.path; // Cloudinary URL
      const campaignId = req.params.campaignId;

      const campaign = await Campaign.findById(campaignId);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }

      const newMap = new Map({
        imageURL: mapUrl,
        pins: [],
        campaign: campaignId,
      });

      await newMap.save();

      campaign.maps.push(newMap._id);
      await campaign.save();

      res.status(200).json({
        message: "Map uploaded successfully",
        map: newMap,
      });
    } catch (error) {
      console.error("Error uploading map:", error);
      res.status(500).json({ message: "Error uploading map" });
    }
  }
);

router.post("/:campaignId/maps/:mapId/pins", authMiddleware, async (req, res) => {
  const { mapId, campaignId } = req.params;
  const { x, y, characterId } = req.body;

  console.log("Request Params:", { campaignId, mapId });
  console.log("Request Body:", { x, y, characterId });

  try {
    if (!x || !y || typeof x !== "number" || typeof y !== "number") {
      return res.status(400).json({ message: "Invalid pin coordinates" });
    }

    const map = await Map.findById(mapId);
    if (!map) {
      return res.status(404).json({ message: "Map not found" });
    }

    map.pins = map.pins.filter((pin) => pin.character?.toString() !== characterId);

    map.pins.push({ x, y, character: characterId });
    await map.save();

    const updatedMap = await Map.findById(mapId).populate({
      path: "pins.character",
      select: "_id name imageURL",
    });

    res.status(201).json({ message: "Pin added successfully", pins: updatedMap.pins });
  } catch (error) {
    console.error("Error adding pin:", error);
    res.status(500).json({ message: "Failed to add pin", error });
  }
});

router.delete(
  "/:campaignId/maps/:mapId",
  authMiddleware,
  deleteMapFromCampaign
);


export default router;