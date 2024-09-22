import mongoose from "mongoose";
import Campaign from "../models/campaignModel.js";
import CampaignCharacter from "../models/campaignCharacter.js";
import Character from "../models/characterModel.js";

export const createCampaign = async (req, res) => {
  const { name, description } = req.body;

  try {
    const newCampaign = new Campaign({
      name,
      description,
    });

    const savedCampaign = await newCampaign.save();
    res.status(201).json(savedCampaign);
  } catch (error) {
    console.log("Error creating a campaign", error);
    res.status(500).json({ message: "Failed to create a campaign", error });
  }
};

export const editCampaign = async (req, res) => {
  const { campaignId } = req.params;
  const { name, description } = req.body;

  try {
    const updatedCampaign = await Campaign.findByIdAndUpdate(
      campaignId,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!updatedCampaign) {
      return res
        .status(404)
        .json({ message: "Could not find a campaign with that ID" });
    }

    res.status(200).json(updatedCampaign);
  } catch (error) {
    console.log("Error updating the campaign", error);
    res.status(500).json({ message: "Failed to update the campaign", error });
  }
};

export const deleteCampaign = async (req, res) => {
  const { campaignId } = req.params;

  try {
    const deletedCampaign = await Campaign.findByIdAndDelete(campaignId);

    if (!deletedCampaign) {
      return res
        .status(404)
        .json({ message: "Could not find a campaign with that ID" });
    }

    //Sletter alle characters fra kampagnen
    await CampaignCharacter.deleteMany({ campaign: campaignId });

    res.status(200).json({ message: "Campaign deleted successfully" });
  } catch (error) {
    console.log("Error deleting the campaign", error);
    res.status(500).json({ message: "Failed to delete the campaign", error });
  }
};

export const addCharacterToCampaign = async (req, res) => {
  const { campaignId } = req.params;
  const { characterId } = req.body;

  try {
    const campaign = await Campaign.findById(campaignId);
    const character = await Character.findById(characterId);

    if (!campaign || !character) {
      return res.status(404).json({
        message:
          "Could not find a campaign or character with those credentials",
      });
    }

    const campaignCharacter = new CampaignCharacter({
      campaign: campaign._id,
      character: character._id,
    });

    await campaignCharacter.save();
    res.status(201).json({
      message: "Character added to campaign successfully",
      campaignCharacter,
    });
  } catch (error) {
    console.log("Error adding the character to the campaign", error);
    res
      .status(500)
      .json({ message: "Failed to add the character to the campaign", error });
  }
};

export const changeCharacterInCampaign = async (req, res) => {
  const { campaignId, characterId } = req.params;
  const { newCharacterId } = req.body;

  try {

    // Cast campaignId og characterId til ObjectId
    const campaignObjectId = new mongoose.Types.ObjectId(campaignId);
    const characterObjectId = new mongoose.Types.ObjectId(characterId);

    const campaignCharacter = await CampaignCharacter.findOne({
      campaign: campaignObjectId,
      character: characterObjectId,
    });

    console.log("CampaignCharacter result:", campaignCharacter);

    if (!campaignCharacter) {
      return res
        .status(404)
        .json({ message: "Character not found in this campaign" });
    }

    // Opdater karakteren til den nye karakter
    campaignCharacter.character = newCharacterId;
    await campaignCharacter.save();

    res.status(200).json({
      message: "Character changed successfully in campaign",
      campaignCharacter,
    });
  } catch (error) {
    console.log("Error changing character in campaign", error);
    res
      .status(500)
      .json({ message: "Failed to change character in campaign", error });
  }
};

export const removeCharacterFromCampaign = async (req, res) => {
  const { campaignId, characterId } = req.params;

  try {
    const campaignCharacter = await CampaignCharacter.findOneAndDelete({
      campaign: campaignId,
      character: characterId,
    });

    if (!campaignCharacter) {
      return res
        .status(404)
        .json({ message: "Character not found in this campaign" });
    }

    res
      .status(200)
      .json({ message: "Character removed from campaign successfully" });
  } catch (error) {
    console.log("Error removing character from campaign", error);
    res
      .status(500)
      .json({ message: "Failed to remove character from campaign", error });
  }
};
