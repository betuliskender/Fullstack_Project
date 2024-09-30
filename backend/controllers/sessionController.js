import Session from "../models/sessionModel.js";
import Campaign from "../models/campaignModel.js";

export const createSession = async (req, res) => {
  const { campaignId } = req.params;
  const { sessionDate, logEntry } = req.body;

  try {
    const campaign = await Campaign.findById(campaignId);

    if (!campaign) {
      return res.status(404).json({ message: "No campaign found" });
    }

    const currentSessionDate = sessionDate || new Date();

    const newSession = new Session({
      sessionDate: currentSessionDate,
      logEntry,
      campaign: campaign._id,
    });

    const savedSession = await newSession.save();
    res.status(201).json(savedSession);
  } catch (error) {
    console.log("Error creating session", error);
    res.status(500).json({ message: "Failed to create session", error });
  }
};

export const editSession = async (req, res) => {
  const { sessionId } = req.params;
  const { sessionDate, logEntry } = req.body;

  try {
    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    session.sessionDate = sessionDate || session.sessionDate;
    session.logEntry = logEntry || session.logEntry;

    const updatedSession = await session.save();
    res.status(200).json(updatedSession);
  } catch (error) {
    console.log("Error updating session", error);
    res.status(500).json({ message: "Failed to update session", error });
  }
};

export const deleteSession = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const session = await Session.findByIdAndDelete(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.status(200).json({ message: "Session deleted successfully" });
  } catch (error) {
    console.log("Error deleting session", error);
    res.status(500).json({ message: "Failed to delete session", error });
  }
};
