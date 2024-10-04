import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  characters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Character",
    },
  ],
  sessions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
    },
  ],
}, { timestamps: true });

const Campaign = mongoose.model("Campaign", campaignSchema);
export default Campaign;
