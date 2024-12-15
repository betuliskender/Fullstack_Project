import React, { useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Character, Spell } from "../utility/types";
import { editCharacter } from "../utility/apiservice";
import { AuthContext } from "../utility/authContext";
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
  useToast 
} from "@chakra-ui/react";

const CharacterDetails: React.FC = () => {
  const location = useLocation();
  const character = location.state?.character as Character;
  const {token} = useContext(AuthContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [spell, setSpell] = useState<Spell | null>(null);
  const [attributes, setAttributes] = useState(character.attributes);
  const toast = useToast();


  const updateAttribute = (key: string, delta: number) => {
    setAttributes((prevAttributes) => ({
      ...prevAttributes,
      [key]: prevAttributes[key] + delta,
    }));
  };

  const saveAttributes = async () => {
    try {
      const updatedCharacter = await editCharacter(character._id!, {
        ...character,
        attributes,
      }, token!);

      console.log("Character successfully updated:", updatedCharacter);

      // Show a success toast
      toast({
        title: "Attributes updated.",
        description: "Your character's attributes have been successfully saved.",
        status: "success",
        duration: 3000, // Message disappears after 3 seconds
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to save attributes:", error);

      // Show an error toast
      toast({
        title: "Error updating attributes.",
        description: "Something went wrong. Please try again.",
        status: "error",
        duration: 3000, // Message disappears after 3 seconds
        isClosable: true,
      });
    }
  };


  if (!character) {
    return <p>No character data available.</p>;
  }

  const handleCardClick = (spell: Spell) => {
    setSpell(spell);
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

      <VStack align="start" spacing={4}>
        <Heading as="h2" size="md" mb={4}>
          Attributes
        </Heading>
        <Grid templateColumns="repeat(2, 1fr)" gap={4} width="100%">
          {Object.entries(attributes)
            .filter(([key]) => key !== "__typename") // Exclude __typename
            .map(([key, value]) => (
              <GridItem key={key}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Text fontSize="lg" flex="1">
                    <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                  </Text>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Button
                      size="sm"
                      onClick={() => updateAttribute(key, -1)}
                      disabled={value <= 0} // Prevent negative values
                    >
                      -
                    </Button>
                    <Text minWidth="30px" textAlign="center">{value}</Text>
                    <Button size="sm" onClick={() => updateAttribute(key, 1)}>
                      +
                    </Button>
                  </Box>
                </Box>
              </GridItem>
            ))}
        </Grid>
        <HStack justifyContent="flex-end" width="100%">
          <Button colorScheme="blue" size="xs" onClick={saveAttributes}>
            Update Attributes
          </Button>
        </HStack>
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
            onClick={() => handleCardClick(spell)}
            cursor="pointer"
          >
            <CardHeader>
              <Heading as="h3" size="md">
                {spell.name}
              </Heading>
            </CardHeader>
            <CardBody>
              <Text >
                <strong>Level:</strong> {spell.level}
              </Text>
              <Text paddingTop={2}>
                  <strong>Duration: </strong> {spell.duration}
              </Text>
              <Text mt={2}>
                <strong>Description:</strong>{" "}
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
        {spell && (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>{spell.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Text>
                <strong>Level:</strong> {spell.level}
                </Text>
                {spell.duration && (
                <Text mt={2}>
                    <strong>Duration:</strong> {spell.duration}
                </Text>
                )}
                <Text mt={2}>
                <strong>Description:</strong> {spell.description}
                </Text>
                {spell.damage && (
                <Text mt={2}>
                    <strong>Damage:</strong> {spell.damage}
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
