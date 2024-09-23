import express from "express";
import { createCampaign, addCharacterToCampaign, editCampaign, deleteCampaign, removeCharacterFromCampaign, changeCharacterInCampaign, getAllCampaigns, getCampaignById} from "../controllers/campaignController.js"
import {authMiddleware} from "../utility/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createCampaign);
router.post("/:campaignId/characters", authMiddleware, addCharacterToCampaign);
router.put("/:campaignId", authMiddleware, editCampaign);
router.delete("/:campaignId", authMiddleware, deleteCampaign);
router.put("/:campaignId/characters/:characterId", authMiddleware, changeCharacterInCampaign);
router.delete("/:campaignId/characters/:characterId", authMiddleware, removeCharacterFromCampaign);
router.get("/:campaignId", authMiddleware, getCampaignById);
router.get("/", authMiddleware, getAllCampaigns);

export default router;