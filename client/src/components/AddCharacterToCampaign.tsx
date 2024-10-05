import React, { useState, useContext } from "react";
import { addCharacterToCampaign } from "../utility/apiservice"; // Importér API-kaldet
import { AuthContext } from "../utility/authContext";
import { useQuery } from "@apollo/client";
import { GETALLCHARACTERS } from "../graphql/queries";
import { Character, Campaign } from "../utility/types";

interface AddCharacterToCampaignProps {
  campaignId: string;
  allCampaigns: Campaign[]; // Pass alle kampagner som prop
}

const AddCharacterToCampaign: React.FC<AddCharacterToCampaignProps> = ({ campaignId, allCampaigns }) => {
  const { token } = useContext(AuthContext);
  const [selectedCharacter, setSelectedCharacter] = useState('');
  const { loading: charactersLoading, data: charactersData, error } = useQuery(GETALLCHARACTERS, {
    context: {
      headers: {
        Authorization: token ? `${token}` : "",
      },
    },
  });

  // Saml alle karakter-ID'er, der er tilføjet til en kampagne
  const allAssignedCharacterIds = allCampaigns.flatMap(campaign => campaign.characters.map(c => c._id));

  const handleCharacterSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCharacter(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedCharacter && token) {
      try {
        const response = await addCharacterToCampaign(campaignId, selectedCharacter, token);
        console.log(response.message);

        // Tøm dropdown-menuen
        setSelectedCharacter('');
      } catch (error) {
        console.error("Error adding character to campaign:", error);
      }
    }
  };

  if (charactersLoading) return <p>Loading characters...</p>;
  if (error) return <p>Error loading characters: {error.message}</p>;

  // Filtrer karakterer, der allerede er tilknyttet en hvilken som helst kampagne
  const availableCharacters = charactersData.characters.filter(
    (character: Character) => !allAssignedCharacterIds.includes(character._id)
  );

  return (
    <div>
      <h3>Add a Character to Campaign</h3>
      <form onSubmit={handleSubmit}>
        <select value={selectedCharacter} onChange={handleCharacterSelect}>
          <option value="">Select a character</option>
          {availableCharacters.map((character: Character) => (
            <option key={character._id} value={character._id}>
              {character.name}
            </option>
          ))}
        </select>
        <button type="submit">Add Character</button>
      </form>
    </div>
  );
};

export default AddCharacterToCampaign;
