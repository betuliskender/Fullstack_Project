import React, { useState, useContext } from "react";
import { AuthContext } from "../utility/authContext";
import { createSession } from "../utility/apiservice"; // Importér funktionen til at oprette session
import { Campaign, Session } from "../utility/types";

interface SessionFormProps {
  campaign: Campaign;
  onSessionCreated: (newSession: Session) => void;
}

const SessionForm: React.FC<SessionFormProps> = ({ campaign, onSessionCreated }) => {
  const { token } = useContext(AuthContext);
  const [sessionDate, setSessionDate] = useState("");
  const [logEntry, setLogEntry] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (token && campaign._id) {
        const newSession = await createSession(campaign._id, { sessionDate, logEntry }, token);
        setSessionDate("");
        setLogEntry("");
        onSessionCreated(newSession); // Call the parent component with the new session
      }
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  return (
    <div className="session-form">
      <h3>Create a New Session</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Session Date:
          <input
            type="date"
            value={sessionDate}
            onChange={(e) => setSessionDate(e.target.value)}
          />
        </label>
        <label>
          Log Entry:
          <textarea
            value={logEntry}
            onChange={(e) => setLogEntry(e.target.value)}
            placeholder="Describe the events of this session..."
          />
        </label>
        <button type="submit">Create Session</button>
      </form>
    </div>
  );
};

export default SessionForm;
