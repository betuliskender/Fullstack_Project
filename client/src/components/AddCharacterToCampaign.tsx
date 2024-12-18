import React, { useState, useContext, useMemo } from "react";
import { addCharacterToCampaign } from "../utility/apiservice";
import { AuthContext } from "../utility/authContext";
import { Character, Campaign } from "../utility/types";
import {
  Button,
  Spinner,
  Text,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { useCharacters } from "../hooks/useCharacters";
import ModalWrapper from "./ModalWrapper";
import CharacterSelection from "./CharacterSelection";

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
  const { loading, characters, error } = useCharacters(token);

  const [selectedCharacter, setSelectedCharacter] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const allAssignedCharacterIds = useMemo(
    () => allCampaigns.flatMap((campaign) => campaign.characters.map((c) => c._id)),
    [allCampaigns]
  );

  const availableCharacters = useMemo(
    () => characters.filter((character: Character) => !allAssignedCharacterIds.includes(character._id)),
    [characters, allAssignedCharacterIds]
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedCharacter && token) {
      try {
        await addCharacterToCampaign(
          campaignId,
          selectedCharacter,
          token
        );

        const newCharacter = characters.find((c: Character) => c._id === selectedCharacter);
        if (newCharacter) onCharacterAdded(newCharacter);

        refetchCampaigns();
        onClose();
      } catch (error) {
        console.error("Error adding character:", error);
      }
    }
  };

  if (loading) return <Spinner />;
  if (error) return <Text color="red.500">Error: {error.message}</Text>;

  return (
    <>
      <Button onClick={onOpen} colorScheme="teal" mb={4}>
        Add Character to Campaign
      </Button>

      <ModalWrapper isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit}>
        <CharacterSelection
          availableCharacters={availableCharacters}
          selectedCharacter={selectedCharacter}
          onSelect={setSelectedCharacter}
        />
        <ModalFooter>
          <Button colorScheme="teal" type="submit" isDisabled={!selectedCharacter}>
            Add Character
          </Button>
        </ModalFooter>
      </ModalWrapper>
    </>
  );
};


export default AddCharacterToCampaign;
