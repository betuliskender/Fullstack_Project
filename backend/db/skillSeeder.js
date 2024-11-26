import fetch from "node-fetch";
import Skill from "../models/skillModel.js";

export const populateSkills = async () => {
  try {
    console.log("Checking if skills need to be populated...");
    const existingSkills = await Skill.countDocuments();
    if (existingSkills > 0) {
      console.log("Skills already populated. Skipping population.");
      return;
    }

    console.log("Populating skills...");
    const response = await fetch("https://www.dnd5eapi.co/api/skills");
    const data = await response.json();

    if (!data.results || !Array.isArray(data.results)) {
      throw new Error("Invalid data from API");
    }

    console.log(`Found ${data.results.length} skills. Fetching details...`);

    for (const skill of data.results) {
      const skillDetailsResponse = await fetch(`https://www.dnd5eapi.co${skill.url}`);
      const skillDetails = await skillDetailsResponse.json();

      const newSkill = new Skill({
        name: skillDetails.name,
        level: skillDetails.level,
        description: skillDetails.desc,
        abilityScore: skillDetails.ability_score.name,
      });

      await newSkill.save();
    }

    console.log("Skills populated successfully!");
  } catch (error) {
    console.error("Failed to populate skills:", error.message);
  }
};
