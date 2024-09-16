import Character from "../models/characterModel.js";

export const createCharacter = async (req, res) => {
  const { name, level, race, class: characterClass, background, imageURL, attributes, user } = req.body;

  console.log("Request Body:", req.body);


  try {
    const newCharacter = new Character({
      name,
      level,
      race,
      class: characterClass,
      background,
      imageURL,
      attributes,
      user,
    });

    const savedCharacter = await newCharacter.save();
    res.status(201).json(savedCharacter);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Could not create character", error });
  }
};