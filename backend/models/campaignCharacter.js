import mongoose from "mongoose";

const campaignCharacterSchema = new mongoose.Schema(
    {
        campaign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campaign",
        required: true,
        },
        character: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Character",
        required: true,
        },
    },

    );

const CampaignCharacter = mongoose.model("CampaignCharacter", campaignCharacterSchema);
export default CampaignCharacter;