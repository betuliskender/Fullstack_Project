import React, { useState, useContext } from "react";
import { addCharacterToCampaign } from "../utility/apiservice";
import { AuthContext } from "../utility/authContext";
import { useQuery } from "@apollo/client";
import { GETALLCHARACTERS } from "../graphql/queries";
import { Character, Campaign } from "../utility/types";
import {
  Button,
  FormControl,
  FormLabel,
  Select,
  Spinner,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

interface AddCharacterToCampaignProps {
  campaignId: string;
  allCampaigns: Campaign[];
  refetchCampaigns: () => void;
  onCharacterAdded: (newCharacter: Character) => void;
}

const AddCharacterToCampaign: React.FC<AddCharacterToCampaignProps> = ({
  campaignId,
  allCampaigns,
  refetchCampaigns,
  onCharacterAdded,
}) => {
  const { token } = useContext(AuthContext);
  const [selectedCharacter, setSelectedCharacter] = useState<string>("");
  const { loading: charactersLoading, data: charactersData, error } = useQuery(
    GETALLCHARACTERS,
    {
      context: {
        headers: {
          Authorization: token ? `${token}` : "",
        },
      },
    }
  );
  
  const { isOpen, onOpen, onClose } = useDisclosure(); // Chakra's modal control

  const allAssignedCharacterIds = allCampaigns.flatMap((campaign) =>
    campaign.characters.map((c) => c._id)
  );

  const handleCharacterSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCharacter(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedCharacter && token) {
      try {
        const response = await addCharacterToCampaign(
          campaignId,
          selectedCharacter,
          token
        );
        console.log(response.message);

        const newCharacter = charactersData.characters.find(
          (character: Character) => character._id === selectedCharacter
        );

        if (newCharacter) {
          onCharacterAdded(newCharacter);
        }

        setSelectedCharacter("");
        refetchCampaigns();
        onClose(); // Close modal after submission
      } catch (error) {
        console.error("Error adding character to campaign:", error);
      }
    }
  };

  if (charactersLoading) return <Spinner />;
  if (error) return <Text color="red.500">Error loading characters: {error.message}</Text>;

  const availableCharacters = charactersData.characters.filter(
    (character: Character) => !allAssignedCharacterIds.includes(character._id)
  );

  return (
    <>
      <Button onClick={onOpen} colorScheme="teal" mb={4}>
        Add Character to Campaign
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a Character</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <FormControl mb={4} isRequired>
                <FormLabel>Select a Character:</FormLabel>
                <Select
                  placeholder="Select a character"
                  value={selectedCharacter}
                  onChange={handleCharacterSelect}
                >
                  {availableCharacters.map((character: Character) => (
                    <option key={character._id} value={character._id}>
                      {character.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <ModalFooter>
                <Button colorScheme="teal" type="submit" isDisabled={!selectedCharacter}>
                  Add Character
                </Button>
              </ModalFooter>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddCharacterToCampaign;
