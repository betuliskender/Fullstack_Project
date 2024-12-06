import mongoose from "mongoose";

const characterSpellSchema = new mongoose.Schema(
    {
        character: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Character",
        required: true,
        },
        spell: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Spell",
        required: true,
        },
    },

);
const CharacterSpell = mongoose.model("CharacterSpell", characterSpellSchema);

export default CharacterSpell;