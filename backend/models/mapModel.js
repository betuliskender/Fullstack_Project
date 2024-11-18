import mongoose from "mongoose";

const mapSchema = new mongoose.Schema({
  pinLocation: {
    type: String,
    required: false,
  },
  imageURL: {
    type: String,
    required: true,
  },
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    required: true,
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session",
    required: false,
  },
  pins: [
    {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
      character: { type: mongoose.Schema.Types.ObjectId, ref: "Character" },
    },
  ],
});

const Map = mongoose.model("Map", mapSchema);
export default Map;
