import React, { useState, ChangeEvent } from "react";
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
} from "@chakra-ui/react";
import { Character } from "../utility/types";

interface EditCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  currentCharacter: Character | null;
  onSubmit: (updatedCharacter: Character) => void;
}

const EditCharacterModal: React.FC<EditCharacterModalProps> = ({
  isOpen,
  onClose,
  currentCharacter,
  onSubmit,
}) => {
  const [character, setCharacter] = useState<Character | null>(currentCharacter);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCharacter((prevCharacter) => ({
      ...prevCharacter!,
      [name]: value,
    }));
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (character) {
      onSubmit(character); // Pass the updated character back to the parent component
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Character</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {character && (
            <form onSubmit={handleFormSubmit}>
              <Input
                placeholder="Name"
                name="name"
                value={character.name}
                onChange={handleInputChange}
                mb={3}
              />
              <Input
                placeholder="Level"
                type="number"
                name="level"
                value={character.level}
                onChange={handleInputChange}
                mb={3}
              />
              <Input
                placeholder="Race"
                name="race"
                value={character.race}
                onChange={handleInputChange}
                mb={3}
              />
              <Input
                placeholder="Class"
                name="class"
                value={character.class}
                onChange={handleInputChange}
                mb={3}
              />
              <Input
                placeholder="Background"
                name="background"
                value={character.background}
                onChange={handleInputChange}
                mb={3}
              />
              <Input
                placeholder="Image URL"
                name="imageURL"
                value={character.imageURL}
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
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditCharacterModal;
