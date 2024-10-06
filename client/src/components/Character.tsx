import React, { useContext, useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { AuthContext } from "../utility/authContext";
import { GETALLCHARACTERS } from "../graphql/queries";
import { Character } from "../utility/types";
import { deleteCharacter, editCharacter } from "../utility/apiservice";
import CharacterModal from "./CharacterModal";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Image,
  Modal,
  Text,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  useDisclosure,
} from "@chakra-ui/react";

interface ProfilePageProps {
  isLoggedIn: boolean;
}

const Characters: React.FC<ProfilePageProps> = ({ isLoggedIn }) => {
  const { token } = useContext(AuthContext);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [currentCharacter, setCurrentCharacter] = useState<Character | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalOpen, setModalOpen] = useState(false);

  const { loading, error, data, refetch } = useQuery(GETALLCHARACTERS, {
    context: {
      headers: {
        Authorization: token ? `${token}` : "",
      },
    },
  });

  useEffect(() => {
    if (isLoggedIn && token) {
      refetch();
    }
  }, [isLoggedIn, token, refetch]);

  useEffect(() => {
    if (data && data.characters) {
      setCharacters(data.characters);
    }
  }, [data]);

  const handleDelete = async (id: string) => {
    try {
      if (token) {
        console.log(`Deleting character with id: ${id}`);
        await deleteCharacter(id, token);
        console.log(`Character with id: ${id} deleted successfully`);
        refetch();
      }
    } catch (error) {
      console.error("Error deleting character:", error);
    }
  };

  const handleEdit = (character: Character) => {
    setCurrentCharacter(character);
    onOpen();
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (currentCharacter && token) {
      try {
        const updatedCharacter = await editCharacter(currentCharacter._id!, currentCharacter, token);
        console.log("Character updated successfully:", updatedCharacter);
        refetch();
        onClose(); // Close the modal after successful update
      } catch (error) {
        console.error("Error updating character:", error);
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCurrentCharacter((prevCharacter) => ({
      ...prevCharacter!,
      [name]: value,
    }));
  };

  const handleCharacterCreated = (newCharacter: Character) => {
    setCharacters((prevCharacters) => [...prevCharacters, newCharacter]);
  };

  if (!isLoggedIn || !token) {
    return <p>You must be logged in to view characters.</p>;
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Box p={5}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Heading as="h1" size="lg">Characters</Heading>
        <Button onClick={() => setModalOpen(true)} colorScheme="teal">Create New Character</Button>
      </Box>

      {/* Character creation modal */}
      <CharacterModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        isLoggedIn={isLoggedIn} 
        onCharacterCreated={handleCharacterCreated} // Pass the callback
      />

      <Box mt={5} display="grid" gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
        {characters.map((char: Character) => (
          <Card key={char._id}>
            <CardHeader>
              <Heading size="md">{char.name}</Heading>
            </CardHeader>
            <CardBody>
              <Image
                src={char.imageURL}
                alt={char.name}
                width="100%"
                height="200px"
                objectFit="cover"
                borderRadius="md"
              />
              <Text>Level: {char.level}</Text>
              <Text>Race: {char.race}</Text>
              <Text>Class: {char.class}</Text>
              <Text>Background: {char.background}</Text>
              <Text>Strength: {char.attributes.strength}</Text>
              <Text>Dexterity: {char.attributes.dexterity}</Text>
              <Text>Constitution: {char.attributes.constitution}</Text>
              <Text>Intelligence: {char.attributes.intelligence}</Text>
              <Text>Wisdom: {char.attributes.wisdom}</Text>
              <Text>Charisma: {char.attributes.charisma}</Text>
              <Button mt={3} colorScheme="red" onClick={() => char._id && handleDelete(char._id)}>
                Delete
              </Button>
              <Button mt={3} ml={3} colorScheme="blue" onClick={() => handleEdit(char)}>
                Edit
              </Button>
            </CardBody>
          </Card>
        ))}
      </Box>

      {/* Chakra Modal for editing a character */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Character</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {currentCharacter && (
              <form onSubmit={handleFormSubmit}>
                <Input
                  placeholder="Name"
                  name="name"
                  value={currentCharacter.name}
                  onChange={handleInputChange}
                  mb={3}
                />
                <Input
                  placeholder="Level"
                  type="number"
                  name="level"
                  value={currentCharacter.level}
                  onChange={handleInputChange}
                  mb={3}
                />
                <Input
                  placeholder="Race"
                  name="race"
                  value={currentCharacter.race}
                  onChange={handleInputChange}
                  mb={3}
                />
                <Input
                  placeholder="Class"
                  name="class"
                  value={currentCharacter.class}
                  onChange={handleInputChange}
                  mb={3}
                />
                <Input
                  placeholder="Background"
                  name="background"
                  value={currentCharacter.background}
                  onChange={handleInputChange}
                  mb={3}
                />
                <Input
                  placeholder="Image URL"
                  name="imageURL"
                  value={currentCharacter.imageURL}
                  onChange={handleInputChange}
                  mb={3}
                />
              </form>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleFormSubmit}>
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Characters; // Consider renaming to Characters for clarity
