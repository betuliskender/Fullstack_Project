import React, { useState, useContext, useEffect } from "react";
import { editSession, deleteSession } from "../utility/apiservice";
import { AuthContext } from "../utility/authContext";
import { Campaign, Session } from "../utility/types";

interface EditSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign;
  session: Session;
  onSessionUpdated: (updatedSession: Session) => void;
  onSessionDeleted: (deletedSessionId: string) => void;
}

const EditSessionModal: React.FC<EditSessionModalProps> = ({
  isOpen,
  onClose,
  campaign,
  session,
  onSessionUpdated,
  onSessionDeleted,
}) => {
  const { token } = useContext(AuthContext);

  // Function to safely parse sessionDate
  const parseSessionDate = (dateString: string | undefined) => {
    if (!dateString) return ""; // Return an empty string if no date is provided
    const parsedDate = new Date(dateString);
    return !isNaN(parsedDate.getTime()) ? parsedDate.toISOString().split("T")[0] : ""; // Only return valid dates
  };

  const [sessionDate, setSessionDate] = useState(parseSessionDate(session.sessionDate));
  const [logEntry, setLogEntry] = useState(session.logEntry);

  // Keep the modal state updated whenever the session changes
  useEffect(() => {
    setSessionDate(parseSessionDate(session.sessionDate));
    setLogEntry(session.logEntry);
  }, [session]);

  // Handle saving session updates
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (token && campaign._id && session._id) {
        const updatedSession = await editSession(
          campaign._id,
          session._id,
          { sessionDate, logEntry },
          token
        );

        // Manually update the session in the state
        onSessionUpdated(updatedSession);
        onClose();
      }
    } catch (error) {
      console.error("Error editing session:", error);
    }
  };

  // Handle deleting a session
  const handleDelete = async () => {
    try {
      if (token && campaign._id && session._id) {
        await deleteSession(campaign._id, session._id, token);
        onSessionDeleted(session._id); // Remove the session from the state
        onClose();
      }
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Edit Session</h2>
        <form onSubmit={handleSave}>
          <label>
            Session Date:
            <input
              type="date"
              value={sessionDate} // Safely handle date input
              onChange={(e) => setSessionDate(e.target.value)} // Handle date change
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
          <button type="submit">Save Changes</button>
        </form>
        <button onClick={handleDelete} className="delete-button">
          Delete Session
        </button>
      </div>
    </div>
  );
};

export default EditSessionModal;
