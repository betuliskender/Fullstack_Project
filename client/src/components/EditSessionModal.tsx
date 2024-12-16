import React, { useState, useContext, useEffect } from "react";
import { editSession } from "../utility/apiservice";
import { AuthContext } from "../utility/authContext";
import { Campaign, Session } from "../utility/types";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";

interface EditSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign;
  session: Session;
  onSessionUpdated: (updatedSession: Session) => void;
}

const EditSessionModal: React.FC<EditSessionModalProps> = ({
  isOpen,
  onClose,
  campaign,
  session,
  onSessionUpdated,
}) => {
  const { token } = useContext(AuthContext);

  // Safely parse the sessionDate to display in the input field
  const parseSessionDate = (dateString: string | undefined) => {
    if (!dateString) return ""; // Return an empty string if no date is provided
    const parsedDate = new Date(dateString);
    return !isNaN(parsedDate.getTime()) ? parsedDate.toISOString().split("T")[0] : ""; // Only return valid dates
  };

  const [sessionDate, setSessionDate] = useState(parseSessionDate(session.sessionDate));
  const [logEntry, setLogEntry] = useState(session.logEntry);
  const [title, setTitle] = useState(session.title || "");
  const [isSaving, setIsSaving] = useState(false); // Track saving state

  // Keep the modal state updated whenever the session changes
  useEffect(() => {
    setTitle(session.title || "");
    setSessionDate(parseSessionDate(session.sessionDate));
    setLogEntry(session.logEntry);
  }, [session]);

  // Handle saving session updates
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true); // Start saving state

    try {
      if (token && campaign._id && session._id) {
        const updatedSession = await editSession(
          campaign._id,
          session._id,
          { title, sessionDate, logEntry },
          token
        );

        // Manually update the session in the state
        onSessionUpdated(updatedSession);
        setIsSaving(false); // Stop saving state
        console.log("Session updated successfully"); // Debugging line
        onClose(); // Close modal after saving
      }
    } catch (error) {
      setIsSaving(false); // Stop saving if there's an error
      console.error("Error editing session:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Session</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSave}>
            <FormControl mb={4}>
              <FormLabel>Session Date:</FormLabel>
              <Input
                type="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                required
              />
            </FormControl>
            <FormControl mb={4}>
  <FormLabel>Title:</FormLabel>
  <Input
    type="text"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    placeholder="Enter session title"
    required
  />
</FormControl>
            <FormControl mb={4}>
              <FormLabel>Log Entry:</FormLabel>
              <Textarea
                value={logEntry}
                onChange={(e) => setLogEntry(e.target.value)}
                placeholder="Describe the events of this session..."
                required
              />
            </FormControl>

            <Button
              colorScheme="teal"
              type="submit"
              isLoading={isSaving} // Show loading spinner while saving
              loadingText="Saving..."
              mr={3}
            >
              Save Changes
            </Button>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditSessionModal;
