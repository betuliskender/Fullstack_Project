import Spell from "../models/spellModel.js";

// Get all spells
import axios from "axios";

export const getAllSpells = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  try {
    // 1. Hent alle spells fra D&D API
    const response = await axios.get("https://www.dnd5eapi.co/api/spells");
    const allSpells = response.data.results;

    // 2. Hent detaljer for alle spells og konverter classes
    const detailedSpells = await Promise.all(
      allSpells.map(async (spell) => {
        const spellDetails = await axios.get(`https://www.dnd5eapi.co${spell.url}`);
        const spellData = spellDetails.data;

        // Omformater classes til array af strings
        spellData.classes = spellData.classes?.map((c) => c.name) || [];
        return spellData;
      })
    );

    // 3. Pagination (optional, men vi bevarer det for ydeevne)
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedSpells = detailedSpells.slice(startIndex, endIndex);

    // 4. Returner alle spells
    res.status(200).json({
      page: parseInt(page),
      limit: parseInt(limit),
      totalSpells: detailedSpells.length,
      totalPages: Math.ceil(detailedSpells.length / limit),
      spells: paginatedSpells,
    });
  } catch (error) {
    console.error("Error fetching spells:", error.message);
    res.status(500).json({ message: "Failed to fetch spells", error: error.message });
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
