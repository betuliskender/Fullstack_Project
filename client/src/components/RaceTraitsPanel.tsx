import React from "react";
import { Box, IconButton, Text } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

interface Language {
  name: string;
}

interface Trait {
  index: string;
  name: string;
}

interface Props {
  raceDetails: {
    name: string;
    alignment: string;
    age: string;
    size_description: string;
    languages: Language[];
    traits: Trait[];
  };
  onClose: () => void;
}

const RaceTraitsPanel: React.FC<Props> = ({ raceDetails, onClose }) => (
  <Box flex="1" p={4} borderLeft="1px solid gray" position="relative">
    <IconButton
      aria-label="Close Traits"
      icon={<CloseIcon />}
      size="sm"
      position="absolute"
      top="2"
      right="2"
      onClick={onClose}
    />
    <Text fontWeight="bold" fontSize="xl" mb={2}>
      {raceDetails.name} Traits
    </Text>
    <Text mt={2} fontWeight="bold">
      Alignment:
    </Text>
    {raceDetails.alignment}
    <Text mt={2} fontWeight="bold">
      Age:
    </Text>
    {raceDetails.age}
    <Text mt={2} fontWeight="bold">
      Size:
    </Text>
    {raceDetails.size_description}
    <Text mt={2} fontWeight="bold">
      Languages:
    </Text>
    <Text>{raceDetails.languages.map((lang) => lang.name).join(", ")}</Text>
    <Text mt={2} fontWeight="bold">
      Traits:
    </Text>
    <Box as="ul" paddingLeft={5}>
      {raceDetails.traits.map((trait) => (
        <li key={trait.index}>{trait.name}</li>
      ))}
    </Box>
  </Box>
);

export default RaceTraitsPanel;
