import mongoose from "mongoose";

const mapSchema = new mongoose.Schema(
    {
        pinLocation: {
        type: String,
        required: true,
        },
        imageURL: {
        type: String,
        required: true,
        },
        campgain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campaign",
        required: true,
        },
        session : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
        required: true,
        },
    },

    );

const Map = mongoose.model("Map", mapSchema);
export default Map;