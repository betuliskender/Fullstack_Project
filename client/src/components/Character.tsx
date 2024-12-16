import React, { useContext, useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { AuthContext } from "../utility/authContext";
import { GETALLCHARACTERS } from "../graphql/queries";
import { Character } from "../utility/types";
import { deleteCharacter, editCharacter } from "../utility/apiservice";
import CreateCharacterModal from "./CreateCharacterModal";
import { Link } from "react-router-dom";
import EditCharacterModal from "./EditCharacterModal";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";

interface ProfilePageProps {
  isLoggedIn: boolean;
}

const Characters: React.FC<ProfilePageProps> = ({ isLoggedIn }) => {
  const { token } = useContext(AuthContext);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [currentCharacter, setCurrentCharacter] = useState<Character | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);


  const { loading, error, data, refetch } = useQuery(GETALLCHARACTERS, {
    context: {
      headers: {
        Authorization: token ? `${token}` : "",
      },
    },
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (successMessage) {
      // Clear the message after 3 seconds
      timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    }
    
    // Cleanup the timer on unmount or when successMessage changes
    return () => {
      clearTimeout(timer);
    };
  }, [successMessage]);
  
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
        
        // Immediately update local state
        setCharacters((prevCharacters) =>
          prevCharacters.filter((character) => character._id !== id)
      );
      
      // Optionally refetch from server for data consistency
      refetch();
    }
  } catch (error) {
    console.error("Error deleting character:", error);
  }
};

const handleEdit = (character: Character) => {
  setCurrentCharacter(character);
  setIsEditModalOpen(true); // Open the edit modal
};

const handleEditSubmit = async (updatedCharacter: Character) => {
  if (token && updatedCharacter) {
    try {
      const editedCharacter = await editCharacter(updatedCharacter._id!, updatedCharacter, token);
      console.log("Character updated successfully:", editedCharacter);
      refetch();
      setIsEditModalOpen(false); // Close the modal after successful update
    } catch (error) {
      console.error("Error updating character:", error);
    }
  }
};

const handleCharacterCreated = (newCharacter: Character) => {
  setCharacters((prevCharacters) => [...prevCharacters, newCharacter]);
  setSuccessMessage("Character created successfully");
};

if (!isLoggedIn || !token) {
  return <p>You must be logged in to view characters.</p>;
}

if (loading) return <p>Loading...</p>;
if (error) return <p>Error: {error.message}</p>;

return (
  <Box p={5} >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Heading as="h1" size="lg">Characters</Heading>
        {successMessage && <Text color="green">{successMessage}</Text>}
        <Button onClick={() => setModalOpen(true)} colorScheme="teal">Create New Character</Button>
      </Box>

      <CreateCharacterModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        isLoggedIn={isLoggedIn}
        onCharacterCreated={handleCharacterCreated}
      />
      
        <Box mt={5} display="grid" gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6} >
          {characters.map((char: Character) => (
            <Card key={char._id}>
              <CardHeader>
                <Heading size="md">{char.name}</Heading>
              </CardHeader>
              <CardBody>
                <Link to={`/character/${char._id}`} state={{ character: char }}>
                <Image
                  src={char.imageURL}
                  alt={char.name}
                  width="100%"
                  height="200px"
                  objectFit="cover"
                  borderRadius="md"
                />
                <Text mt={2}><strong>Level:</strong> {char.level}</Text>
                <Text mt={2}><strong>Race:</strong> {char.race.name}</Text>
                <Text mt={2}><strong>Class:</strong> {char.class.name}</Text>
                <Text mt={2}><strong>Background:</strong> {char.background}</Text>
                </Link>
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

      <EditCharacterModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentCharacter={currentCharacter}
        isLoggedIn={isLoggedIn}
        onSubmit={handleEditSubmit}
      />
    </Box>
  );
};

export default Characters;
