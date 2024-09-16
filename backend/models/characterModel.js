import mongoose from "mongoose";

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
    type: String,
    required: true,
  },
  class: {
    type: String,
    required: true,
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
