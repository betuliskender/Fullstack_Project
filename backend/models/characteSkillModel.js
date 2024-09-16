import mongoose from "mongoose";

const characterSkillSchema = new mongoose.Schema(
  {
    character: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Character",
      required: true,
    },
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
    },
  },

);

const CharacterSkill = mongoose.model("CharacterSkill", characterSkillSchema);
export default CharacterSkill;