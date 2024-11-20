import mongoose, { startSession } from "mongoose";

const characterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
  race: {
    name: { type: String, required: true },
    traits: [{ type: String }],
    languages: [{ type: String }]
  },
  class: {
    name: { type: String, required: true },
    proficiencies: [{ type: String }],
    starting_equipment: [{ type: String }]
  },
  background: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
  },
  attributes: {
    strength: {
      type: Number,
      required: true,
    },
    dexterity: {
      type: Number,
      required: true,
    },
    constitution: {
      type: Number,
      required: true,
    },
    intelligence: {
      type: Number,
      required: true,
    },
    wisdom: {
      type: Number,
      required: true,
    },
    charisma: {
      type: Number,
      required: true,
    },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Character = mongoose.model("Character", characterSchema);

export default Character;
