import mongoose from "mongoose";

const spellSchema = new mongoose.Schema(
    {
        name: {
        type: String,
        required: true,
        },
        level: {
        type: Number,
        required: true,
        },
        description: {
        type: String,
        required: true,
        },
        damage: {
        type: Number,
        required: true,
        },
    },

    );
    
const Spell = mongoose.model("Spell", spellSchema);
export default Spell;