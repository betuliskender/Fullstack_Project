import React, { useContext, useState } from "react";
import { AuthContext } from "../utility/authContext";
import { Character, Campaign } from "../utility/types";
import { changeCharacterInCampaign } from "../utility/apiservice";

interface ChangeCharacterModalProps {
    isOpen: boolean;
    onClose: () => void;
    campaign: Campaign;
    currentCharacterId: string;
    availableCharacters: Character[];
    refetchCampaigns: () => void;
    setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>;
  }
  
  const ChangeCharacterModal: React.FC<ChangeCharacterModalProps> = ({
    isOpen,
    onClose,
    campaign,
    currentCharacterId,
    availableCharacters,
    refetchCampaigns,
    setCampaigns,
  }) => {
    const { token } = useContext(AuthContext);
    const [selectedCharacterId, setSelectedCharacterId] = useState<string>("");
  
    const handleCharacterChange = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newCharacterId = (event.currentTarget.elements.namedItem("newCharacterId") as HTMLSelectElement).value;
      
        if (campaign && currentCharacterId && token) {
          try {
            const response = await changeCharacterInCampaign(campaign._id!, currentCharacterId, newCharacterId, token);
      
            if (!response) {
              throw new Error("No response from backend mutation.");
            }
      
            // Find den nye karakter fra availableCharacters
            const newCharacter = availableCharacters.find((character) => character._id === newCharacterId);
      
            if (!newCharacter) {
              throw new Error("New character not found in available characters.");
            }
      
            // Opdater hele karakterobjektet i kampagnen, inklusive navnet
            const updatedCampaign = {
              ...campaign,
              characters: campaign.characters.map((character) =>
                character._id === currentCharacterId
                  ? newCharacter // Opdater til den nye karakter
                  : character
              ),
            };
      
            // Opdatér kampagnelisten i state
            setCampaigns((prevCampaigns) =>
              prevCampaigns.map((c) => (c._id === campaign._id ? updatedCampaign : c))
            );
      
            await refetchCampaigns();
            onClose(); // Luk modal
          } catch (error) {
            console.error("Error during API call or state update:", error);
          }
        }
      };
  
    return (
      isOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={onClose}>
              &times;
            </span>
            <h2>Edit Character in Campaign</h2>
            <form onSubmit={handleCharacterChange}>
              <label>
                Select new character:
                <select
                  name="newCharacterId"
                  value={selectedCharacterId}
                  onChange={(e) => setSelectedCharacterId(e.target.value)}
                >
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
      )
    );
  };
  
  export default ChangeCharacterModal;
  