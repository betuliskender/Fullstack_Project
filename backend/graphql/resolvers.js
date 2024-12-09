import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import Character from "../models/characterModel.js";
import Campaign from "../models/campaignModel.js";
import Session from "../models/sessionModel.js";
import Skill from "../models/skillModel.js";
import Spell from "../models/spellModel.js";

const resolvers = {
  Query: {
    characters: async (_, __, { user }) => {
      if (!user) throw new Error("Authentication required");
      return await Character.find({ user: user.id }).populate("user");
    },
    character: async (_, { id }, { user }) => {
      if (!user) throw new Error("Authentication required");
      return await Character.findById(id).populate("user");
    },
    campaigns: async (_, __, { user }) => {
      if (!user) throw new Error("Authentication required");
      return await Campaign.find().populate("characters").populate("sessions");
    },
    campaign: async (_, { _id }, { user }) => {
      if (!user) throw new Error("Authentication required");

      return await Campaign.findById(_id)
        .populate("characters")
        .populate("sessions")
        .populate({
          path: "maps",
          populate: {
            path: "pins.character",
            select: "_id name imageURL",
          },
        });
    },
    sessions: async (_, __, { user }) => {
      if (!user) throw new Error("Authentication required");
      return await Session.find().populate("campaign");
    },
    session: async (_, { id }, { user }) => {
      if (!user) throw new Error("Authentication required");
      return await Session.findById(id).populate("campaign");
    },
    maps: async (_, __, { user }) => {
      if (!user) throw new Error("Authentication required");
      return await Map.find().populate("campaign").populate("session");
    },
    map: async (_, { id }, { user }) => {
      if (!user) throw new Error("Authentication required");
      return await Map.findById(id).populate("campaign").populate("session");
    },
    spell: async (_, { id }) => {
      return await Spell.findById(id);
    },
    spells: async () => {
      return await Spell.find();
    },
    skill: async (_, { id }) => {
      return await Skill.findById(id);
    },
    skills: async () => {
      return await Skill.find();
    },
  },

  Mutation: {
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
      if (!user) {
        throw new Error("User not found");
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new Error("Invalid password");
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      return {
        token,
        user,
      };
    },

    createCharacter: async (
      _,
      { name, classType, level, attributes },
      { user }
    ) => {
      if (!user) throw new Error("Authentication required");
      const newCharacter = new Character({
        name,
        classType,
        level,
        attributes,
        user: user.id,
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
      },
      { user }
    ) => {
      if (!user) throw new Error("Authentication required");
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
      return updatedCharacter;
    },

    deleteCharacter: async (_, { id }, { user }) => {
      if (!user) throw new Error("Authentication required");
      const character = await Character.findById(id);
      if (!character) {
        throw new Error("Character not found");
      }
      if (character.user.toString() !== user.id) {
        throw new Error("Not authorized to delete this character");
      }
      await Character.findByIdAndDelete(id);
      return { message: "Character deleted successfully" };
    },

    createCampaign: async (_, { name, description }, { user }) => {
      if (!user) throw new Error("Authentication required");
      const newCampaign = new Campaign({
        name,
        description,
        characters: [],
        sessions: [],
      });
      return await newCampaign.save();
    },

    createSession: async (
      _,
      { campaignId, sessionDate, logEntry },
      { user }
    ) => {
      if (!user) throw new Error("Authentication required");
      const newSession = new Session({
        campaign: campaignId,
        sessionDate,
        logEntry,
      });
      return await newSession.save();
    },

    editSession: async (_, { id, sessionDate, logEntry }, { user }) => {
      if (!user) throw new Error("Authentication required");
      return await Session.findByIdAndUpdate(
        id,
        { sessionDate, logEntry },
        { new: true }
      );
    },

    deleteSession: async (_, { id }, { user }) => {
      if (!user) throw new Error("Authentication required");
      return await Session.findByIdAndDelete(id);
    },

    addPinToMap: async (_, { mapId, x, y, characterId }, { user }) => {
      if (!user) throw new Error("Authentication required");

      const map = await Map.findById(mapId);
      if (!map) throw new Error("Map not found");

      if (characterId) {
        const characterExists = await Character.findById(characterId);
        if (!characterExists) throw new Error("Character not found");
      }

      const originalPins = [...map.pins];
      map.pins = map.pins.filter(
        (pin) => pin.character.toString() !== characterId
      );

      console.log("Original Pins:", originalPins);
      console.log("Pins after removal:", map.pins);

      map.pins.push({ x, y, character: characterId });
      await map.save();

      const updatedMap = await Map.findById(mapId).populate({
        path: "pins.character",
        select: "_id name imageURL",
      });

      console.log("Updated Map after adding pin:", updatedMap);

      return updatedMap;
    },
    updateUserProfile: async (_, { firstName, lastName, email, profileImage }, { user }) => {
      if (!user) throw new Error("Authentication required");
  
      const updatedData = { firstName, lastName, email };
      if (profileImage) updatedData.profileImage = profileImage;
  
      const updatedUser = await User.findByIdAndUpdate(user.id, updatedData, {
        new: true,
      });
  
      return updatedUser;
    },
  },
};

export default resolvers;
