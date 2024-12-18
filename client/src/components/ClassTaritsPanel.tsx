import React from "react";
import { Box, IconButton, Text } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

interface Proficiency {
  index: string;
  name: string;
}

interface Equipment {
  equipment: { name: string };
}

interface Props {
  classDetails: {
    name: string;
    proficiencies: Proficiency[];
    starting_equipment: Equipment[];
  };
  onClose: () => void;
}

const ClassDetailsPanel: React.FC<Props> = ({ classDetails, onClose }) => (
  <Box flex="1" p={4} borderLeft="1px solid gray" position="relative">
    <IconButton
      aria-label="Close Class Details"
      icon={<CloseIcon />}
      size="sm"
      position="absolute"
      top="2"
      right="2"
      onClick={onClose}
    />
    <Text fontWeight="bold" fontSize="xl" mb={2}>
      {classDetails.name} Details
    </Text>
    <Text mt={2} fontWeight="bold">
      Proficiencies:
    </Text>
    <Box as="ul" paddingLeft={5}>
      {classDetails.proficiencies.map((prof) => (
        <li key={prof.index}>{prof.name}</li>
      ))}
    </Box>
    <Text mt={2} fontWeight="bold">
      Starting Equipment:
    </Text>
    <Box as="ul" paddingLeft={5}>
      {classDetails.starting_equipment.map((item) => (
        <li key={item.equipment.name}>{item.equipment.name}</li>
      ))}
    </Box>
  </Box>
);

export default ClassDetailsPanel;
