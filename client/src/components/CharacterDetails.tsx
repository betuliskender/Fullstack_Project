import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Character } from "../utility/types";
import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Image,
  Grid,
  GridItem,
  Divider,
  Card,
  CardBody,
  CardHeader,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";

const CharacterDetails: React.FC = () => {
  const location = useLocation();
  const character = location.state?.character as Character;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState<{ type: "spell" | "skill"; name: string; details: any } | null>(null);

  if (!character) {
    return <p>No character data available.</p>;
  }

  const handleCardClick = (type: "spell" | "skill", name: string, details: any) => {
    setSelectedItem({ type, name, details });
    onOpen();
  };

  return (
    <Box p={5}>
      {/* Character Name */}
      <Heading as="h1" size="2xl" mb={5}>
        {character.name}
      </Heading>

      {/* Character Image and Attributes */}
      <HStack align="start" spacing={8}>
        {/* Image */}
        <Image
          src={character.imageURL}
          alt={character.name}
          width="300px"
          height="300px"
          objectFit="cover"
          borderRadius="md"
          boxShadow="lg"
        />

        {/* Attributes */}
        <VStack align="start" spacing={3}>
          <Heading as="h2" size="md" mb={3}>
            Attributes
          </Heading>
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            {Object.entries(character.attributes).map(([key, value]) => (
              <GridItem key={key}>
                <Text fontSize="lg">
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
                </Text>
              </GridItem>
            ))}
          </Grid>
        </VStack>
      </HStack>


      {/* Character Basic Details */}
      <VStack align="start" spacing={4} mb={5}>
        <Text fontSize="lg"><strong>Race:</strong> {character.race.name}</Text>
        <Text fontSize="lg"><strong>Class:</strong> {character.class.name}</Text>
        <Text fontSize="lg"><strong>Background:</strong> {character.background}</Text>
        <Text fontSize="lg"><strong>Level:</strong> {character.level}</Text>
      </VStack>
      
      <Divider my={5} />

      {/* Spells Section */}
      <Heading as="h2" size="lg" mb={3}>
        Spells
      </Heading>
      <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
        {character.spells?.map((spell) => (
          <Card
            key={spell.name}
            boxShadow="md"
            borderRadius="md"
            onClick={() => handleCardClick("spell", spell.name, spell)}
            cursor="pointer"
          >
            <CardHeader>
              <Heading as="h3" size="md">
                {spell.name}
              </Heading>
            </CardHeader>
            <CardBody>
              <Text>
                <strong>Level:</strong> {spell.level}
              </Text>
              <Text mt={2}>
                {spell.description.length > 100
                  ? `${spell.description.substring(0, 100)}...`
                  : spell.description}
              </Text>
            </CardBody>
          </Card>
        ))}
      </Grid>

      <Divider my={5} />

      {/* Skills Section */}
      <Heading as="h2" size="lg" mb={3}>
        Skills
      </Heading>
      <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
        {character.skills?.map((skill) => (
          <Card
            key={skill.name}
            boxShadow="md"
            borderRadius="md"
            onClick={() => handleCardClick("skill", skill.name, skill)}
            cursor="pointer"
          >
            <CardHeader>
              <Heading as="h3" size="md">
                {skill.name}
              </Heading>
            </CardHeader>
            <CardBody>
              <Text>
                <strong>Ability Score:</strong> {skill.abilityScore}
              </Text>  
            </CardBody>
          </Card>
        ))}
      </Grid>

      {/* Modal for Spell Details */}
        {selectedItem && selectedItem.type === "spell" && (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>{selectedItem.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Text>
                <strong>Level:</strong> {selectedItem.details.level}
                </Text>
                <Text mt={2}>
                <strong>Description:</strong> {selectedItem.details.description}
                </Text>
                {selectedItem.details.duration && (
                <Text mt={2}>
                    <strong>Duration:</strong> {selectedItem.details.duration}
                </Text>
                )}
                {selectedItem.details.damage && (
                <Text mt={2}>
                    <strong>Damage:</strong> {selectedItem.details.damage}
                </Text>
                )}
            </ModalBody>
            <ModalFooter>
                <Button onClick={onClose} colorScheme="blue">
                Close
                </Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
        )}

    </Box>
  );
};

export default CharacterDetails;
