import Spell from "../models/spellModel.js";

// Get all spells
export const getAllSpells = async (req, res) => {
  try {
    const spells = await Spell.find();
    res.status(200).json(spells);
  } catch (error) {
    console.log("Error getting spells:", error);
    res.status(500).json({ message: "Failed to get spells", error });
  }
};

// Get a spell by ID
export const getSpellById = async (req, res) => {
  const { id } = req.params;

  try {
    const spell = await Spell.findById(id);

    if (!spell) {
      return res.status(404).json({ message: "Spell not found" });
    }

    res.status(200).json(spell);
  } catch (error) {
    console.log("Error getting spell:", error);
    res.status(500).json({ message: "Failed to get spell", error });
  }
};
