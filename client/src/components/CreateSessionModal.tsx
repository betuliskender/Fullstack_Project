import React, { useState, useContext } from "react";
import { AuthContext } from "../utility/authContext";
import { createSession } from "../utility/apiservice";
import { Campaign, Session } from "../utility/types";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";

interface SessionFormProps {
  campaign: Campaign;
  onSessionCreated: (newSession: Session) => void;
}

const SessionForm: React.FC<SessionFormProps> = ({ campaign, onSessionCreated }) => {
  const { token } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [logEntry, setLogEntry] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (token && campaign._id) {
        const newSession = await createSession(campaign._id, { title, sessionDate, logEntry }, token);
        setTitle("");
        setSessionDate("");
        setLogEntry("");
        onSessionCreated(newSession); // Call the parent component with the new session
        onClose(); // Close modal after session creation
      }
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  return (
    <>
      {/* Button to open the modal */}
      <Button onClick={onOpen} colorScheme="teal">
        Create New Session
      </Button>

      {/* Chakra Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a New Session</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
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
                  placeholder="Enter a title for the session"
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

              <Button colorScheme="teal" type="submit">
                Create Session
              </Button>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SessionForm;
