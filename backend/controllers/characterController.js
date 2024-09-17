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

export const deleteCharacter = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCharacter = await Character.findByIdAndDelete(id);
    if (!deletedCharacter) {
      return res.status(404).json({ message: "Character not found" });
    }
    res.status(200).json({ message: "Character deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Could not delete character", error });
  }
};

export const editCharacter = async (req, res) => {
  const { id } = req.params;
  const { name, level, race, class: characterClass, background, imageURL, attributes } = req.body;

  try {
    const updatedCharacter = await Character.findByIdAndUpdate(
      id,
      { name, level, race, class: characterClass, background, imageURL, attributes },
      { new: true, runValidators: true }
    );

    if (!updatedCharacter) {
      return res.status(404).json({ message: "Character not found" });
    }

    res.status(200).json(updatedCharacter);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Could not update character", error });
  }
};