import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { AuthContext } from "../utility/authContext";
import { GET_CAMPAIGN_BY_ID, GETALLCHARACTERS } from "../graphql/queries";
import AddCharacterToCampaign from "./AddCharacterToCampaign";
import ChangeCharacterModal from "./ChangeCharacterModal";
import SessionForm from "./SessionForm";
import EditSessionModal from "./EditSessionModal";
import { Campaign, Session, Character } from "../utility/types";
import { removeCharacterFromCampaign } from "../utility/apiservice";

const CampaignDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useContext(AuthContext);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false);
  const [isEditSessionModalOpen, setIsEditSessionModalOpen] = useState(false);
  const [currentCharacterId, setCurrentCharacterId] = useState<string | null>(
    null
  );
  const [currentSession, setCurrentSession] = useState<Session | null>(null);

  const {
    loading: campaignLoading,
    error: campaignError,
    data: campaignData,
  } = useQuery(GET_CAMPAIGN_BY_ID, {
    variables: { id },
    context: {
      headers: {
        Authorization: token ? `${token}` : "",
      },
    },
    fetchPolicy: "network-only",
  });

  const {
    loading: charactersLoading,
    error: charactersError,
    data: charactersData,
  } = useQuery(GETALLCHARACTERS, {
    context: {
      headers: {
        Authorization: token ? `${token}` : "",
      },
    },
  });

  useEffect(() => {
    if (campaignData && campaignData.campaign) {
      console.log("Campaign data received:", campaignData);

      setCampaign(campaignData.campaign);
    }
  }, [campaignData]);

  const handleSessionCreated = (newSession: Session) => {
    setCampaign((prevCampaign) => {
      if (prevCampaign) {
        return {
          ...prevCampaign,
          sessions: [...(prevCampaign.sessions || []), newSession],
        };
      }
      return prevCampaign;
    });
  };

  const handleCharacterAdded = (newCharacter: Character) => {
    setCampaign((prevCampaign) => {
      if (prevCampaign) {
        return {
          ...prevCampaign,
          characters: [...prevCampaign.characters, newCharacter],
        };
      }
      return prevCampaign;
    });
  };

  const handleCharacterEdit = (characterId: string) => {
    setCurrentCharacterId(characterId);
    setIsCharacterModalOpen(true);
  };

  const handleCharacterRemove = async (characterId: string) => {
    if (campaign && token) {
      try {
        const response = await removeCharacterFromCampaign(
          campaign._id!,
          characterId,
          token
        );

        if (response.message) {
          setCampaign({
            ...campaign,
            characters: campaign.characters.filter(
              (character) => character._id !== characterId
            ),
          });
        }
      } catch (error) {
        console.error("Error removing character from campaign:", error);
      }
    }
  };

  const handleSessionEdit = (session: Session) => {
    setCurrentSession(session); // Set the session to edit
    setIsEditSessionModalOpen(true); // Open modal
  };

  const handleSessionUpdated = (updatedSession: Session) => {
    setCampaign((prevCampaign) => {
      if (!prevCampaign) return prevCampaign;

      // Update the specific session in the campaign's sessions array
      const updatedSessions = prevCampaign.sessions.map((session) =>
        session._id === updatedSession._id ? updatedSession : session
      );

      return { ...prevCampaign, sessions: updatedSessions };
    });
  };

  const handleSessionDeleted = (deletedSessionId: string) => {
    setCampaign((prevCampaign) => {
      if (!prevCampaign) return prevCampaign;

      // Remove the deleted session from the sessions array
      const updatedSessions = prevCampaign.sessions.filter(
        (session) => session._id !== deletedSessionId
      );

      return { ...prevCampaign, sessions: updatedSessions };
    });
  };

  const handleModalClose = () => {
    setIsCharacterModalOpen(false);
    setIsEditSessionModalOpen(false);
    setCurrentCharacterId(null);
    setCurrentSession(null);
  };

  if (campaignLoading || charactersLoading)
    return <p>Loading campaign details...</p>;
  if (campaignError)
    return <p>Error loading campaign details: {campaignError.message}</p>;
  if (charactersError)
    return <p>Error loading characters: {charactersError.message}</p>;

  return (
    <div>
      <h1>{campaign?.name}</h1>
      <p>{campaign?.description}</p>

      <h3>Characters in this campaign:</h3>
      <ul>
        {campaign?.characters.map((character) => (
          <li key={character._id}>
            {character.name}
            <button
              onClick={() =>
                character._id && handleCharacterEdit(character._id)
              }
            >
              Edit Character
            </button>
            <button
              onClick={() =>
                character._id && handleCharacterRemove(character._id)
              }
            >
              Remove Character
            </button>
          </li>
        ))}
      </ul>

      <AddCharacterToCampaign
        campaignId={campaign ? campaign._id || "" : ""}
        allCampaigns={campaign ? [campaign] : []}
        refetchCampaigns={() => {}}
        onCharacterAdded={handleCharacterAdded}
      />

      <SessionForm
        campaign={campaign!}
        onSessionCreated={handleSessionCreated}
      />

      <h3>Sessions for this campaign:</h3>
      {campaign?.sessions && campaign.sessions.length > 0 ? (
        <ul>
          {campaign.sessions.map((session) => {
            // Check if sessionDate is a valid timestamp or a string
            const timestamp = Number(session.sessionDate);
            const formattedDate = !isNaN(timestamp)
              ? new Date(timestamp).toLocaleDateString("en-GB")
              : !isNaN(Date.parse(session.sessionDate))
              ? new Date(session.sessionDate).toLocaleDateString("en-GB")
              : "Invalid Date";

            return (
              <li key={session._id}>
                <strong>Date:</strong> {formattedDate}
                <br />
                <strong>Log:</strong> {session.logEntry}
                <button onClick={() => handleSessionEdit(session)}>Edit</button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No sessions found for this campaign.</p>
      )}

      {isCharacterModalOpen && currentCharacterId && campaign && (
        <ChangeCharacterModal
          isOpen={isCharacterModalOpen}
          onClose={handleModalClose}
          campaign={campaign}
          currentCharacterId={currentCharacterId}
          availableCharacters={charactersData?.characters || []}
          refetchCampaigns={() => {}}
          setCampaign={setCampaign}
        />
      )}
      {isEditSessionModalOpen && currentSession && (
        <EditSessionModal
          isOpen={isEditSessionModalOpen}
          onClose={handleModalClose}
          campaign={campaign!}
          session={currentSession}
          onSessionUpdated={handleSessionUpdated}
          onSessionDeleted={handleSessionDeleted}
        />
      )}
    </div>
  );
};

export default CampaignDetails;
