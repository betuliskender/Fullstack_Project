import fetch from "node-fetch";
import Spell from "../models/spellModel.js";

export const populateSpells = async () => {
  try {
    console.log("Checking if spells need to be populated...");
    const existingSpells = await Spell.countDocuments();
    if (existingSpells > 0) {
      console.log("Spells already populated. Skipping population.");
      return;
    }

    console.log("Populating spells...");
    const response = await fetch("https://www.dnd5eapi.co/api/spells");
    const data = await response.json();

    if (!data.results || !Array.isArray(data.results)) {
      throw new Error("Invalid data from API");
    }

    for (const spell of data.results) {
      const spellDetailsResponse = await fetch(`https://www.dnd5eapi.co${spell.url}`);
      const spellDetails = await spellDetailsResponse.json();

      const newSpell = new Spell({
        name: spellDetails.name,
        level: spellDetails.level,
        description: spellDetails.desc.join(" "),
        damage: spellDetails.damage ? spellDetails.damage.damage_dice : null,
        duration: spellDetails.duration,
      });

      await newSpell.save();
    }

    console.log("Spells populated successfully!");
  } catch (error) {
    console.error("Failed to populate spells:", error.message);
  }
};
