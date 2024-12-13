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
  formatDate: (sessionDate: string) => string; // Til visning
}

const SessionLogs: React.FC<SessionLogsProps> = ({
  sessions,
  onEditSession,
  onDeleteSession,
  formatDate,
}) => {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  const handleSessionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSessionId(event.target.value);
  };

  // Sortér sessioner efter deres originale dato (ikke formateret)
  const sortedSessions = [...sessions].sort((a, b) => {
    const dateA = new Date(a.sessionDate).getTime(); // Brug den originale dato
    const dateB = new Date(b.sessionDate).getTime();
    return dateB - dateA; // Nyeste først
  });

  const selectedSession = sortedSessions.find(
    (session) => session._id === selectedSessionId
  );

  const bgColor = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("black", "white");

  return (
    <VStack align="start" spacing={4}>
      <Heading as="h3" size="md">
        Session Logs
      </Heading>
      {sortedSessions.length === 0 ? (
        <Text>No session logs available for this campaign.</Text>
      ) : (
        <>
          {/* Dropdown for selecting a session */}
          <Select
            placeholder="Select a session log"
            onChange={handleSessionChange}
            value={selectedSessionId || ""}
          >
            {sortedSessions.map((session) => (
              <option key={session._id} value={session._id}>
                {session.title} - {formatDate(session.sessionDate)}
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
                Title: {selectedSession.title}
              </Text>
              <Text>
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
