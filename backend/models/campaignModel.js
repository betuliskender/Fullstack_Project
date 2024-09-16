import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
    {
        name: {
        type: String,
        required: true,
        },
        description: {
        type: String,
        required: true,
        },
    },

    );

const Campaign = mongoose.model("Campaign", campaignSchema);
export default Campaign;