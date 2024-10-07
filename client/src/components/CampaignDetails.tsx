import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { AuthContext } from "../utility/authContext";
import { GET_CAMPAIGN_BY_ID, GETALLCHARACTERS } from "../graphql/queries"; // Importér din query for at hente kampagnedetaljer og alle karakterer
import AddCharacterToCampaign from "./AddCharacterToCampaign";
import ChangeCharacterModal from "./ChangeCharacterModal";
import { Campaign } from "../utility/types";
import { removeCharacterFromCampaign } from "../utility/apiservice";

const CampaignDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Få kampagne-id fra URL
  const { token } = useContext(AuthContext);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false);
  const [currentCharacterId, setCurrentCharacterId] = useState<string | null>(null);

  // Query for at hente kampagnedetaljer
  const { loading: campaignLoading, error: campaignError, data: campaignData, refetch: refetchCampaign } = useQuery(GET_CAMPAIGN_BY_ID, {
    variables: { id },
    context: {
      headers: {
        Authorization: token ? `${token}` : "",
      },
    },
  });

  // Query for at hente alle karakterer
  const { loading: charactersLoading, error: charactersError, data: charactersData } = useQuery(GETALLCHARACTERS, {
    context: {
      headers: {
        Authorization: token ? `${token}` : "",
      },
    },
  });

  useEffect(() => {
    if (campaignData && campaignData.campaign) {
      setCampaign(campaignData.campaign);
    }
  }, [campaignData]);

  const handleCharacterEdit = (characterId: string) => {
    setCurrentCharacterId(characterId);
    setIsCharacterModalOpen(true); // Åbn modal til at ændre karakter
  };

  const handleCharacterRemove = async (characterId: string) => {
    if (campaign && token) {
      try {
        const response = await removeCharacterFromCampaign(campaign._id!, characterId, token);

        if (response.message) {
          // Fjern karakteren fra kampagnen lokalt i state
          setCampaign({
            ...campaign,
            characters: campaign.characters.filter(
              (character) => character._id !== characterId
            ),
          });

          // Opdater kampagnelisten
          await refetchCampaign();
        }
      } catch (error) {
        console.error("Error removing character from campaign:", error);
      }
    }
  };

  const handleModalClose = () => {
    setIsCharacterModalOpen(false);
    setCurrentCharacterId(null);
  };

  if (campaignLoading || charactersLoading) return <p>Loading campaign details...</p>;
  if (campaignError) return <p>Error loading campaign details: {campaignError.message}</p>;
  if (charactersError) return <p>Error loading characters: {charactersError.message}</p>;

  return (
    <div>
      <h1>{campaign?.name}</h1>
      <p>{campaign?.description}</p>

      <h3>Characters in this campaign:</h3>
      <ul>
        {campaign?.characters.map((character) => (
          <li key={character._id}>
            {character.name}
            <button onClick={() => character._id && handleCharacterEdit(character._id)}>
              Edit Character
            </button>
            <button onClick={() => character._id && handleCharacterRemove(character._id)}>
              Remove Character
            </button>
          </li>
        ))}
      </ul>

      {/* Add character functionality */}
      <AddCharacterToCampaign
        campaignId={campaign ? campaign._id || "" : ""}
        allCampaigns={campaign ? [campaign] : []}
        refetchCampaigns={refetchCampaign}
      />

      {/* Modal til at ændre karakter */}
      {isCharacterModalOpen && currentCharacterId && campaign && (
        <ChangeCharacterModal
          isOpen={isCharacterModalOpen}
          onClose={handleModalClose}
          campaign={campaign}
          currentCharacterId={currentCharacterId}
          availableCharacters={charactersData?.characters || []} // Brug alle hentede karakterer her
          refetchCampaigns={refetchCampaign}
          setCampaign={setCampaign}
        />
      )}
    </div>
  );
};

export default CampaignDetails;
