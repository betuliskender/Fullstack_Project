import React, { useState, ChangeEvent, useContext } from "react";
import { createCharacter } from "../utility/apiservice";
import { Character as CharacterType } from "../utility/types";
import { AuthContext } from "../utility/authContext";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Button,
  Text
} from "@chakra-ui/react";

interface CharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  onCharacterCreated: (character: CharacterType) => void;
}

const CharacterModal: React.FC<CharacterModalProps> = ({ isOpen, onClose, isLoggedIn, onCharacterCreated }) => {
  const { user, token } = useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [character, setCharacter] = useState<CharacterType>({
    name: "",
    level: 1,
    race: "",
    class: "",
    background: "",
    imageURL: "",
    attributes: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
    },
    user: user?._id || "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name in character.attributes) {
      setCharacter({
        ...character,
        attributes: {
          ...character.attributes,
          [name]: Number(value),
        },
      });
    } else {
      setCharacter({
        ...character,
        [name]: value,
      });
    }
  };

  const handleSubmit = async () => {
    try {
      if (token) {
        const newCharacter = await createCharacter(character, token); // Assuming this returns the created character
        setSuccessMessage("Character created successfully");

        // Clear form
        setCharacter({
          name: "",
          level: 1,
          race: "",
          class: "",
          background: "",
          imageURL: "",
          attributes: {
            strength: 0,
            dexterity: 0,
            constitution: 0,
            intelligence: 0,
            wisdom: 0,
            charisma: 0,
          },
          user: user?._id || "",
        });

        // Notify parent component of the new character
        onCharacterCreated(newCharacter); // Call the callback function

        // Close the modal after successful creation
        onClose();
      } else {
        console.error("Token is null or undefined");
      }
    } catch (error) {
      console.error("Error creating character:", error);
    }
  };

  return (
    <>
      {isLoggedIn && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create Character</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {successMessage && <Text color="green">{successMessage}</Text>}
              <Input placeholder="Name" name="name" value={character.name} onChange={handleChange} mb={3} />
              <Input placeholder="Level" type="number" name="level" value={character.level} onChange={handleChange} mb={3} />
              <Input placeholder="Race" name="race" value={character.race} onChange={handleChange} mb={3} />
              <Input placeholder="Class" name="class" value={character.class} onChange={handleChange} mb={3} />
              <Input placeholder="Background" name="background" value={character.background} onChange={handleChange} mb={3} />
              <Input placeholder="Image URL" name="imageURL" value={character.imageURL} onChange={handleChange} mb={3} />
              <Input placeholder="Strength" type="number" name="strength" value={character.attributes.strength} onChange={handleChange} mb={3} />
              <Input placeholder="Dexterity" type="number" name="dexterity" value={character.attributes.dexterity} onChange={handleChange} mb={3} />
              <Input placeholder="Constitution" type="number" name="constitution" value={character.attributes.constitution} onChange={handleChange} mb={3} />
              <Input placeholder="Intelligence" type="number" name="intelligence" value={character.attributes.intelligence} onChange={handleChange} mb={3} />
              <Input placeholder="Wisdom" type="number" name="wisdom" value={character.attributes.wisdom} onChange={handleChange} mb={3} />
              <Input placeholder="Charisma" type="number" name="charisma" value={character.attributes.charisma} onChange={handleChange} mb={3} />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={handleSubmit}>
                Create Character
              </Button>
              <Button variant="ghost" onClick={onClose} ml={3}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      {!isLoggedIn && (
        <div>
          <h2>You need to login to see this page</h2>
        </div>
      )}
    </>
  );
};

export default CharacterModal;
