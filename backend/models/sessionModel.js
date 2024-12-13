import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
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
});

const Session = mongoose.model("Session", sessionSchema);
export default Session;
