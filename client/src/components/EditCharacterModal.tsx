import React, { useState, ChangeEvent, useEffect } from "react";
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
  FormControl,
  FormLabel,
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
  const [character, setCharacter] = useState<Character | null>(null);

  // Sync character state with currentCharacter prop when it changes
  useEffect(() => {
    if (currentCharacter) {
      setCharacter(currentCharacter);
    }
  }, [currentCharacter]);

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
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  placeholder="Name"
                  name="name"
                  value={character.name}
                  onChange={handleInputChange}
                  mb={3}

                />
              </FormControl>
              <FormControl>
                <FormLabel>Level</FormLabel>
                <Input
                  placeholder="Level"
                  name="level"
                  value={character.level}
                  onChange={handleInputChange}
                  mb={3}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Background</FormLabel>
                <Input
                  placeholder="Background"
                  name="background"
                  value={character.background}
                  onChange={handleInputChange}
                  mb={3}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Image URL</FormLabel>
                <Input
                  placeholder="Image URL"
                  name="imageURL"
                  value={character.imageURL}
                  onChange={handleInputChange}
                  mb={3}
                />
              </FormControl>

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
