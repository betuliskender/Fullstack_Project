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

    // This deletes all the characters from the campaign
    await CampaignCharacter.deleteMany({ campaign: campaignId });

    res.status(200).json({ message: "Campaign deleted successfully" });
  } catch (error) {
    console.log("Error deleting the campaign", error);
    res.status(500).json({ message: "Failed to delete the campaign", error });
  }
};

export const getCampaignById = async (req, res) => {
  const { campaignId } = req.params;

  try {
    const campaign = await Campaign.findById(campaignId);

    if (!campaign) {
      return res
        .status(404)
        .json({ message: "Could not find a campaign with that ID" });
    }
    res.status(200).json(campaign);
  } catch (error) {
    console.log("Error getting the campaign", error);
    res.status(500).json({ message: "Failed to get the campaign", error });
  }
};

export const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find()
    .populate("characters")
    .populate("sessions");
    res.status(200).json(campaigns);
  } catch (error) {
    console.log("Error getting all campaigns", error);
    res.status(500).json({ message: "Failed to get all campaigns", error });
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
        message: "Could not find a campaign or character with those credentials",
      });
    }

    if (!campaign.characters.includes(character._id)) {
      campaign.characters.push(character._id);
    }

    await campaign.save();

    // Opret CampaignCharacter relation
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
    res.status(500).json({ message: "Failed to add the character to the campaign", error });
  }
};


export const changeCharacterInCampaign = async (req, res) => {
  const { campaignId, characterId } = req.params;
  const { newCharacterId } = req.body;

  try {
    // Cast IDs to ObjectId
    const campaignObjectId = new mongoose.Types.ObjectId(campaignId);
    const characterObjectId = new mongoose.Types.ObjectId(characterId);
    const newCharacterObjectId = new mongoose.Types.ObjectId(newCharacterId);

    const campaignCharacter = await CampaignCharacter.findOne({
      campaign: campaignObjectId,
      character: characterObjectId,
    });

    if (!campaignCharacter) {
      return res
        .status(404)
        .json({ message: "Character not found in this campaign" });
    }

    // Update the character in the campaign character document
    campaignCharacter.character = newCharacterObjectId;
    await campaignCharacter.save();

    // Also update the characters in the Campaign collection
    await Campaign.updateOne(
      { _id: campaignObjectId, 'characters': characterObjectId },
      { $set: { 'characters.$': newCharacterObjectId } }
    );

    // Find and return the updated campaign with populated characters
    const updatedCampaign = await Campaign.findById(campaignId).populate('characters');

    res.status(200).json({
      message: "Character changed successfully in campaign",
      campaign: updatedCampaign,
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
    // Fjern karakteren fra CampaignCharacter
    const campaignCharacter = await CampaignCharacter.findOneAndDelete({
      campaign: campaignId,
      character: characterId,
    });

    if (!campaignCharacter) {
      return res
        .status(404)
        .json({ message: "Character not found in this campaign" });
    }

    // Fjern karakteren fra characters-arrayet i Campaign
    const campaign = await Campaign.findByIdAndUpdate(
      campaignId,
      { $pull: { characters: characterId } }, // Brug $pull til at fjerne karakteren fra arrayet
      { new: true } // Returnér den opdaterede kampagne
    );

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    res.status(200).json({
      message: "Character removed from campaign successfully",
      campaign,
    });
  } catch (error) {
    console.log("Error removing character from campaign", error);
    res
      .status(500)
      .json({ message: "Failed to remove character from campaign", error });
  }
};