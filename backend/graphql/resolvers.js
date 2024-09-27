import User from "../models/userModel.js";
import Character from "../models/characterModel.js";
import Campaign from "../models/campaignModel.js";
import Session from "../models/sessionModel.js";
import CampaignCharacter from "../models/campaignCharacter.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const resolvers = {
  Query: {
    users: async () => await User.find().populate("characters"),
    user: async (_, { id }) => await User.findById(id).populate("characters"),

    characters: async () => await Character.find().populate("user"),
    character: async (_, { id }) =>
      await Character.findById(id).populate("user"),

    campaigns: async () =>
      await Campaign.find().populate("characters").populate("sessions"),
    campaign: async (_, { id }) =>
      await Campaign.findById(id).populate("characters").populate("sessions"),

    sessions: async () => await Session.find().populate("campaign"),
    session: async (_, { id }) =>
      await Session.findById(id).populate("campaign"),
  },

  Mutation: {
    // User mutations
    registerUser: async (
      _,
      { firstName, lastName, userName, email, password }
    ) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) throw new Error("User already exists");

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        firstName,
        lastName,
        userName,
        email,
        password: hashedPassword,
      });

      return await newUser.save();
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("No user exists with that email");

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error("Invalid credentials");

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      return token;
    },

    // Character mutations
    createCharacter: async (
      _,
      {
        name,
        level,
        race,
        class: characterClass,
        background,
        imageURL,
        userId,
        attributes,
      }
    ) => {
      const newCharacter = new Character({
        name,
        level,
        race,
        class: characterClass,
        background,
        imageURL,
        attributes,
        user: userId,
      });

      return await newCharacter.save();
    },

    editCharacter: async (
      _,
      {
        id,
        name,
        level,
        race,
        class: characterClass,
        background,
        imageURL,
        attributes,
      }
    ) => {
      const updatedCharacter = await Character.findByIdAndUpdate(
        id,
        {
          name,
          level,
          race,
          class: characterClass,
          background,
          imageURL,
          attributes,
        },
        { new: true }
      );

      if (!updatedCharacter) throw new Error("Character not found");
      return updatedCharacter;
    },

    deleteCharacter: async (_, { id }) => {
      const deletedCharacter = await Character.findByIdAndDelete(id);
      if (!deletedCharacter) throw new Error("Character not found");
      return deletedCharacter;
    },

    // Campaign mutations
    createCampaign: async (_, { name, description }) => {
      const newCampaign = new Campaign({ name, description });
      return await newCampaign.save();
    },

    editCampaign: async (_, { id, name, description }) => {
      const updatedCampaign = await Campaign.findByIdAndUpdate(
        id,
        { name, description },
        { new: true }
      );
      if (!updatedCampaign) throw new Error("Campaign not found");
      return updatedCampaign;
    },

    deleteCampaign: async (_, { id }) => {
      const deletedCampaign = await Campaign.findByIdAndDelete(id);
      if (!deletedCampaign) throw new Error("Campaign not found");

      await CampaignCharacter.deleteMany({ campaign: id }); // Delete characters linked to campaign
      return deletedCampaign;
    },

    addCharacterToCampaign: async (_, { campaignId, characterId }) => {
      const campaignCharacter = new CampaignCharacter({
        campaign: campaignId,
        character: characterId,
      });
      return await campaignCharacter.save();
    },

    changeCharacterInCampaign: async (
      _,
      { campaignId, characterId, newCharacterId }
    ) => {
      const campaignCharacter = await CampaignCharacter.findOne({
        campaign: campaignId,
        character: characterId,
      });
      if (!campaignCharacter)
        throw new Error("Character not found in this campaign");

      campaignCharacter.character = newCharacterId;
      return await campaignCharacter.save();
    },

    removeCharacterFromCampaign: async (_, { campaignId, characterId }) => {
      const campaignCharacter = await CampaignCharacter.findOneAndDelete({
        campaign: campaignId,
        character: characterId,
      });
      if (!campaignCharacter)
        throw new Error("Character not found in this campaign");

      return campaignCharacter;
    },

    // Session mutations
    createSession: async (_, { campaignId, sessionDate, logEntry }) => {
      const newSession = new Session({
        sessionDate: sessionDate || new Date(),
        logEntry,
        campaign: campaignId,
      });

      return await newSession.save();
    },

    editSession: async (_, { id, sessionDate, logEntry }) => {
      const updatedSession = await Session.findByIdAndUpdate(
        id,
        { sessionDate, logEntry },
        { new: true }
      );
      if (!updatedSession) throw new Error("Session not found");
      return updatedSession;
    },

    deleteSession: async (_, { id }) => {
      const deletedSession = await Session.findByIdAndDelete(id);
      if (!deletedSession) throw new Error("Session not found");
      return deletedSession;
    },
  },
};
