import Character from "../models/characterModel.js";
import Spell from "../models/spellModel.js";
import CharacterSpell from "../models/characterSpellModel.js";
import CharacterSkill from "../models/characteSkillModel.js";
import Skill from "../models/skillModel.js";

export const createCharacter = async (req, res) => {
  const {
    name,
    level,
    race,
    class: characterClass,
    background,
    imageURL,
    attributes,
  } = req.body;

  try {
    const newCharacter = new Character({
      name,
      level,
      race,
      class: characterClass,
      background,
      imageURL,
      attributes,
      user: req.user.id,
    });

    const savedCharacter = await newCharacter.save();
    res.status(201).json(savedCharacter);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Could not create character", error });
  }
};

export const deleteCharacter = async (req, res) => {
  const { id } = req.params;

  try {
    const character = await Character.findById(id);
    if (!character) {
      return res.status(404).json({ message: "Character not found" });
    }

    if (character.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this character" });
    }

    await Character.findByIdAndDelete(id);
    res.status(200).json({ message: "Character deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Could not delete character", error });
  }
};

export const editCharacter = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    level,
    race,
    class: characterClass,
    background,
    imageURL,
    attributes,
  } = req.body;

  try {
    const character = await Character.findById(id);
    if (!character) {
      return res.status(404).json({ message: "Character not found" });
    }

    if (character.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to edit this character" });
    }

    character.name = name;
    character.level = level;
    character.race = race;
    character.class = characterClass;
    character.background = background;
    character.imageURL = imageURL;
    character.attributes = attributes;

    const updatedCharacter = await character.save();
    res.status(200).json(updatedCharacter);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Could not update character", error });
  }
};

export const getAllCharacters = async (req, res) => {
  try {
    const characters = await Character.find();
    res.status(200).json(characters);
  } catch (error) {
    console.log("Error getting characters", error);
    res.status(500).json({ message: "Failed to get characters", error });
  }
};

export const getCharacterById = async (req, res) => {
  const { id } = req.params;

  try {
    const character = await Character.findById(id);

    if (!character) {
      return res.status(404).json({ message: "Character not found" });
    }

    res.status(200).json(character);
  } catch (error) {
    console.log("Error getting character", error);
    res.status(500).json({ message: "Failed to get character", error });
  }
};

export const addSpellsToCharacter = async (req, res) => {
  const { characterId } = req.params;
  const { spells } = req.body; // Array of spell objects with properties like name and level

  try {
    // Ensure the character exists
    const character = await Character.findById(characterId);
    if (!character) {
      return res.status(404).json({ success: false, message: "Character not found" });
    }

    // Find corresponding spell IDs from the database
    const spellNames = spells.map((spell) => spell.name);
    const matchedSpells = await Spell.find({ name: { $in: spellNames } });

    if (matchedSpells.length !== spells.length) {
      return res.status(400).json({
        success: false,
        message: "One or more spells could not be matched with the database",
      });
    }

    // Save relationships between the character and the matched spells
    const characterSpellDocs = matchedSpells.map((spell) => ({
      character: characterId,
      spell: spell._id,
    }));

    await CharacterSpell.insertMany(characterSpellDocs);

    return res.status(201).json({
      success: true,
      message: "Spells added to character successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

//add skills to character
export const addSkillsToCharacter = async (req, res) => {
  const { characterId } = req.params;
  const { skills } = req.body; 

  try {
    if (!Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({ success: false, message: "Skills array is invalid or empty" });
    }

    const character = await Character.findById(characterId);
    if (!character) {
      return res.status(404).json({ success: false, message: "Character not found" });
    }

    const skillIDs = skills.map((skill) => skill._id);

    const matchedSkills = await Skill.find({ _id: { $in: skillIDs } });

    if (matchedSkills.length !== skillIDs.length) {
      return res.status(400).json({
        success: false,
        message: "Some skills could not be found in the database",
      });
    }

    const existingRelations = await CharacterSkill.find({
      character: characterId,
      skill: { $in: skillIDs },
    });

    const newRelations = matchedSkills
      .filter((skill) => !existingRelations.some((rel) => rel.skill.equals(skill._id)))
      .map((skill) => ({
        character: characterId,
        skill: skill._id,
      }));

    if (newRelations.length > 0) {
      await CharacterSkill.insertMany(newRelations);
    }

    return res.status(201).json({
      success: true,
      message: "Skills added to character successfully",
      addedSkills: newRelations.map((relation) => relation.skill),
    });
  } catch (error) {
    console.error("Error in addSkillsToCharacter:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
