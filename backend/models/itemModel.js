import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
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

const Item = mongoose.model("Item", itemSchema);
export default Item;