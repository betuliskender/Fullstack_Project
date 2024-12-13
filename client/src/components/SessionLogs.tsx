import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Select,
  VStack,
  Button,
  HStack,
  useColorModeValue,

} from "@chakra-ui/react";
import { Session } from "../utility/types";

interface SessionLogsProps {
  sessions: Session[];
  onEditSession: (session: Session) => void;
  onDeleteSession: (sessionId: string) => void;
  formatDate: (sessionDate: string) => string;
}

const SessionLogs: React.FC<SessionLogsProps> = ({
  sessions,
  onEditSession,
  onDeleteSession,
  formatDate,
}) => {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    sessions.length > 0 && sessions[0]._id ? sessions[0]._id : null
  );

  const handleSessionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSessionId(event.target.value);
  };

  const selectedSession = sessions.find(
    (session) => session._id === selectedSessionId
  );

  const bgColor = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("black", "white");

  return (
    <VStack align="start" spacing={4}>
      <Heading as="h3" size="md">
        Session Logs
      </Heading>
      {sessions.length === 0 ? (
        <Text>No session logs available for this campaign.</Text>
      ) : (
        <>
          {/* Dropdown for selecting a session */}
          <Select
            placeholder="Select a session log"
            onChange={handleSessionChange}
            value={selectedSessionId || ""}
          >
            {sessions.map((session) => (
              <option key={session._id} value={session._id}>
                {formatDate(session.sessionDate)} - Log #{session._id}
              </option>
            ))}
          </Select>

          {/* Show details of the selected session */}
          {selectedSession && (
            <Box
              p={4}
              bg={bgColor}
              color={textColor}
              borderRadius="md"
              w="full"
              boxShadow="md"
            >
              <Text fontWeight="bold">
                Date: {formatDate(selectedSession.sessionDate)}
              </Text>
              <Text mt={2}>{selectedSession.logEntry}</Text>
              {/* Edit and Delete buttons */}
              <HStack mt={4} spacing={4}>
                <Button
                  size="sm"
                  colorScheme="blue"
                  onClick={() => onEditSession(selectedSession)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => onDeleteSession(selectedSession._id!)}
                >
                  Delete
                </Button>
              </HStack>
            </Box>
          )}
        </>
      )}
    </VStack>
  );
};

export default SessionLogs;
