import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
    {
        sessionDate: {
        type: Date,
        required: true,
        },
        logEntry: {
        type: String,
        required: true,
        },
        campaign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campaign",
        required: true,
        },
    },

    );