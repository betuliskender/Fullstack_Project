import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../utility/authContext";
import { Character, Campaign } from "../utility/types";
import { changeCharacterInCampaign } from "../utility/apiservice";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Select,
} from "@chakra-ui/react";

interface ChangeCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign;
  currentCharacterId: string;
  availableCharacters: Character[];
  refetchCampaigns: () => void;
  setCampaign: React.Dispatch<React.SetStateAction<Campaign | null>>;
}

const ChangeCharacterModal: React.FC<ChangeCharacterModalProps> = ({
  isOpen,
  onClose,
  campaign,
  currentCharacterId,
  availableCharacters,
  refetchCampaigns,
  setCampaign,
}) => {
  const { token } = useContext(AuthContext);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>("");

  useEffect(() => {
    // Set selected character to the current one when the modal opens
    setSelectedCharacterId(currentCharacterId);
    console.log("Available Characters:", availableCharacters);
    console.log("Characters in Campaign:", campaign.characters);
  }, [currentCharacterId, availableCharacters, campaign]);

  const handleCharacterChange = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newCharacterId = selectedCharacterId;

    if (campaign && currentCharacterId && token) {
      try {
        const response = await changeCharacterInCampaign(
          campaign._id!,
          currentCharacterId,
          newCharacterId,
          token
        );

        if (!response) {
          throw new Error("No response from backend mutation.");
        }

        // Find the new character from availableCharacters
        const newCharacter = availableCharacters.find(
          (character) => character._id === newCharacterId
        );

        if (!newCharacter) {
          throw new Error("New character not found in available characters.");
        }

        // Update the campaign with the new character
        const updatedCampaign = {
          ...campaign,
          characters: campaign.characters.map((character) =>
            character._id === currentCharacterId ? newCharacter : character
          ),
        };

        // Update the campaign state
        setCampaign((prevCampaign) =>
          prevCampaign && prevCampaign._id === campaign._id ? updatedCampaign : prevCampaign
        );

        await refetchCampaigns();
        onClose(); // Close modal after submission
      } catch (error) {
        console.error("Error during API call or state update:", error);
      }
    }
  };

  // Filter characters for the dropdown that aren't already in the campaign
  const filteredCharacters = availableCharacters.filter(
    (character) => !campaign.characters.some((c) => c._id === character._id)
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Change Character in Campaign</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleCharacterChange}>
            <FormControl mb={4}>
              <FormLabel>Select new character:</FormLabel>
              <Select
                value={selectedCharacterId}
                onChange={(e) => setSelectedCharacterId(e.target.value)}
                placeholder="Select a character"
              >
                {filteredCharacters.map((character: Character) => (
                  <option key={character._id} value={character._id}>
                    {character.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <ModalFooter>
              <Button colorScheme="blue" type="submit">
                Save
              </Button>
              <Button variant="ghost" onClick={onClose} ml={3}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ChangeCharacterModal;
