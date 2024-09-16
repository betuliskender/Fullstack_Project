import mongoose from "mongoose";

const characterItemSchema = new mongoose.Schema(
    {
        character: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Character",
        required: true,
        },
        item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
        },
    },

    );

const CharacterItem = mongoose.model("CharacterItem", characterItemSchema);
export default CharacterItem;