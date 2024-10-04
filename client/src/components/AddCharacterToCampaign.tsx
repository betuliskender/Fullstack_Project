import React, { useState, useContext } from "react";
import { addCharacterToCampaign } from "../utility/apiservice"; // Importér API-kaldet
import { AuthContext } from "../utility/authContext";
import { useQuery } from "@apollo/client";
import { GETALLCHARACTERS } from "../graphql/queries";
import { Character } from "../utility/types";

interface AddCharacterToCampaignProps {
  campaignId: string;
}

const AddCharacterToCampaign: React.FC<AddCharacterToCampaignProps> = ({ campaignId }) => {
  const { token } = useContext(AuthContext); // Hent token fra context
  const [selectedCharacter, setSelectedCharacter] = useState("");
  const { loading: charactersLoading, data: charactersData, error } = useQuery(GETALLCHARACTERS, {
    context: {
      headers: {
        Authorization: token ? `${token}` : "",
      },
    },
  });

  const handleCharacterSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCharacter(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedCharacter && token) {
      try {
        const response = await addCharacterToCampaign(campaignId, selectedCharacter, token); // Brug API-kaldet
        console.log(response.message);
      } catch (error) {
        console.error("Error adding character to campaign:", error);
      }
    }
  };

  if (charactersLoading) return <p>Loading characters...</p>;
  if (error) return <p>Error loading characters: {error.message}</p>;

  return (
    <div>
      <h3>Add a Character to Campaign</h3>
      <form onSubmit={handleSubmit}>
        <select value={selectedCharacter} onChange={handleCharacterSelect}>
          <option value="">Select a character</option>
          {charactersData.characters.map((character: Character) => (
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
