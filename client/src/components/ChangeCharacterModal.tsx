import React, { useContext, useState, useEffect } from "react";
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
        // Indstil dropdown til den aktuelle karakter, når modalen åbnes
        setSelectedCharacterId(currentCharacterId);

        // Debug logs for at kontrollere data
        console.log("Available Characters:", availableCharacters);
        console.log("Characters in Campaign:", campaign.characters);
    }, [currentCharacterId, availableCharacters, campaign]);

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
                        character._id === currentCharacterId ? newCharacter : character
                    ),
                };

                // Opdatér kampagnelisten i state
                setCampaign((prevCampaign) =>
                    prevCampaign && prevCampaign._id === campaign._id ? updatedCampaign : prevCampaign
                );

                await refetchCampaigns();
                onClose(); // Luk modal
            } catch (error) {
                console.error("Error during API call or state update:", error);
            }
        }
    };

    // Filtrer karaktererne til dropdown-menuen for kun at vise karakterer, som ikke allerede er tilknyttet kampagnen
    const filteredCharacters = availableCharacters.filter(
        (character) => !campaign.characters.some((c) => c._id === character._id)
    );

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
                                {filteredCharacters.map((character: Character) => (
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
