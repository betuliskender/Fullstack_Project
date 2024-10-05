import React, { useContext, useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { AuthContext } from "../utility/authContext";
import { GETALLCHARACTERS } from "../graphql/queries";
import { Character, Campaign } from "../utility/types";
import { changeCharacterInCampaign } from "../utility/apiservice";

interface ChangeCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign;
  currentCharacterId: string;
  refetchCampaigns: () => void;
}

const ChangeCharacterModal: React.FC<ChangeCharacterModalProps> = ({
  isOpen,
  onClose,
  campaign,
  currentCharacterId,
  refetchCampaigns,
}) => {
  const { token } = useContext(AuthContext);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>(""); // Default is empty string
  const [availableCharacters, setAvailableCharacters] = useState<Character[]>([]);

  const { loading, error, data: charactersData , refetch} = useQuery(GETALLCHARACTERS, {
    context: { headers: { Authorization: token ? `Bearer ${token}` : "" } },
  });

  // useEffect to update available characters when data changes
  useEffect(() => {
    if (charactersData && charactersData.characters) {
      setAvailableCharacters(
        charactersData.characters.filter(
          (character: Character) =>
            !campaign.characters.some((c) => c._id === character._id)
        )
      );
    }
  }, [charactersData, campaign.characters]);

  const handleCharacterChange = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const form = event.currentTarget;
  const newCharacterId = (form.elements.namedItem("newCharacterId") as HTMLSelectElement).value;

  console.log("New Character ID (Frontend):", newCharacterId);

  if (campaign && currentCharacterId && token) {
    try {
      console.log("Calling mutation...");

      // Tjek mutation og log resultatet
      const response = await changeCharacterInCampaign(campaign._id!, currentCharacterId, newCharacterId, token);
      console.log("Mutation response (Frontend):", response);

      if (!response) {
        throw new Error("No response from backend mutation.");
      }

      // Kald refetch for at opdatere data
      await refetch();
      console.log("Refetch completed");

      await refetchCampaigns();
      console.log("Refetch campaigns completed");

      onClose();  // Luk modalen efter opdatering
    } catch (error) {
      console.error("Error during mutation or refetch:", error);
    }
  } else {
    console.error("Campaign, CharacterId, or Token is missing.");
  }
};

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Edit Character in Campaign</h2>
        {loading && <p>Loading characters...</p>}
        {error && <p>Error loading characters: {error.message}</p>}
        <form onSubmit={handleCharacterChange}>
          <label>
            Select new character:
            <select
              name="newCharacterId"
              value={selectedCharacterId || ""} // Ensure default is a string
              onChange={(e) => setSelectedCharacterId(e.target.value)}
            >
              <option value="" disabled>
                Select a character
              </option>
              {availableCharacters.map((character: Character) => (
                <option key={character._id} value={character._id}>
                  {character.name}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
};

export default ChangeCharacterModal;
