import Character from "../models/characterModel.js";

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
