import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { AuthContext } from "../utility/authContext";
import { GET_CAMPAIGN_BY_ID, GETALLCHARACTERS } from "../graphql/queries";
import AddCharacterToCampaign from "./AddCharacterToCampaign";
import ChangeCharacterModal from "./ChangeCharacterModal";
import SessionForm from "./CreateSessionModal";
import EditSessionModal from "./EditSessionModal";
import MapUpload from "./MapUpload"; // Import MapUpload component
import { Campaign, Session, Character, Map } from "../utility/types"; // Import Map type
import {
  removeCharacterFromCampaign,
  deleteSession,
} from "../utility/apiservice";
import "../styles/campaignDetails.css";

// Chakra UI imports
import {
  Box,
  Button,
  Heading,
  Text,
  UnorderedList,
  ListItem,
  useToast,
  VStack,
  HStack,
  Divider,
  IconButton,
  Image,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

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
  const toast = useToast();
  const [currentSlide, setCurrentSlide] = useState(0);

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
      setCampaign(campaignData.campaign);
    }
  }, [campaignData]);

  const handleMapUploaded = (uploadedMap: Map) => {
    setCampaign((prevCampaign) => {
      if (prevCampaign) {
        return {
          ...prevCampaign,
          maps: [...(prevCampaign.maps ?? []), uploadedMap],
        };
      }
      return prevCampaign;
    });
  };

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
          toast({
            title: "Character removed.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error("Error removing character from campaign:", error);
      }
    }
  };

  const handleSessionEdit = (session: Session) => {
    setCurrentSession(session);
    setIsEditSessionModalOpen(true);
  };

  const handleSessionDeleted = async (sessionId: string) => {
    if (campaign && token) {
      try {
        await deleteSession(campaign._id!, sessionId, token);

        setCampaign((prevCampaign) => {
          if (!prevCampaign) return prevCampaign;

          const updatedSessions = prevCampaign.sessions.filter(
            (session) => session._id !== sessionId
          );

          return { ...prevCampaign, sessions: updatedSessions };
        });
        toast({
          title: "Session deleted.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error("Error deleting session:", error);
      }
    }
  };

  const handleSessionUpdated = (updatedSession: Session) => {
    setCampaign((prevCampaign) => {
      if (!prevCampaign) return prevCampaign;

      const updatedSessions = prevCampaign.sessions.map((session) =>
        session._id === updatedSession._id ? updatedSession : session
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

  const formatDate = (sessionDate: string) => {
    const timestamp = Number(sessionDate);
    if (!isNaN(timestamp)) {
      return new Date(timestamp).toLocaleDateString("en-GB");
    } else if (!isNaN(Date.parse(sessionDate))) {
      return new Date(sessionDate).toLocaleDateString("en-GB");
    }
    return "Invalid Date";
  };

  const goToNextSlide = () => {
    if (campaign && campaign.maps) {
      setCurrentSlide((prev) => (prev + 1) % (campaign?.maps?.length || 1));
    }
  };

  const goToPreviousSlide = () => {
    if (campaign && campaign.maps) {
      setCurrentSlide((prev) =>
        prev === 0 ? (campaign.maps?.length || 1) - 1 : prev - 1
      );
    }
  };

  if (campaignLoading || charactersLoading)
    return <Text>Loading campaign details...</Text>;
  if (campaignError)
    return <Text>Error loading campaign details: {campaignError.message}</Text>;
  if (charactersError)
    return <Text>Error loading characters: {charactersError.message}</Text>;

  return (
    <Box className="campaign-details-container" p={4}>
      {/* Left side: Campaign Information */}
      <VStack align="flex-start" spacing={4}>
        <Heading as="h1">{campaign?.name}</Heading>
        <Text>{campaign?.description}</Text>

        <Heading as="h3" size="md">
          Characters in this campaign:
        </Heading>
        <UnorderedList>
          {campaign?.characters.map((character) => (
            <ListItem key={character._id}>
              {character.name}
              <HStack spacing={2} mt={2}>
                <Button
                  size="sm"
                  onClick={() =>
                    character._id && handleCharacterEdit(character._id)
                  }
                >
                  Edit Character
                </Button>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() =>
                    character._id && handleCharacterRemove(character._id)
                  }
                >
                  Remove Character
                </Button>
              </HStack>
            </ListItem>
          ))}
        </UnorderedList>

        <AddCharacterToCampaign
          campaignId={campaign ? campaign._id || "" : ""}
          allCampaigns={campaign ? [campaign] : []}
          refetchCampaigns={() => {}}
          onCharacterAdded={handleCharacterAdded}
        />

        <Divider />

        {/* Session Form */}
        <SessionForm
          campaign={campaign!}
          onSessionCreated={handleSessionCreated}
        />

        <Heading as="h3" size="md">
          Sessions for this campaign:
        </Heading>
        {campaign?.sessions && campaign.sessions.length > 0 ? (
          <UnorderedList>
            {campaign.sessions.map((session) => (
              <ListItem key={session._id}>
                <Text>
                  <strong>Date:</strong> {formatDate(session.sessionDate)}
                  <br />
                  <strong>Log:</strong> {session.logEntry}
                </Text>
                <HStack spacing={2} mt={2}>
                  <Button size="sm" onClick={() => handleSessionEdit(session)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() =>
                      session._id && handleSessionDeleted(session._id)
                    }
                  >
                    Delete
                  </Button>
                </HStack>
              </ListItem>
            ))}

          </UnorderedList>
        ) : (
          <Text>No sessions found for this campaign.</Text>
        )}

        {/* MapUpload Component */}
        {campaign && token && (
          <MapUpload
            campaignId={campaign._id!}
            token={token}
            onMapUploaded={handleMapUploaded}
          />
        )}
      </VStack>

      {/* Right side: Carousel for Maps */}
      <VStack mt={8} spacing={4}>
        {campaign?.maps && campaign.maps.length > 0 ? (
          <Box position="relative" width="full">
            <IconButton
              icon={<ChevronLeftIcon />}
              aria-label="Previous Map"
              onClick={goToPreviousSlide}
              position="absolute"
              left="-40px" // Adjust this value to move the button outside the image
              top="50%" // Center the button vertically relative to the image
              transform="translateY(-50%)" // Adjust for perfect centerin
              zIndex={2}
            />
            <Image
              src={`http://localhost:5000${campaign.maps[currentSlide].imageURL}`}
              alt="Campaign Map"
              borderRadius="md"
              boxSize="400px"
              objectFit="cover"
              mx="auto"
            />
            <IconButton
              icon={<ChevronRightIcon />}
              aria-label="Next Map"
              onClick={goToNextSlide}
              position="absolute"
              right="-40px" // Adjust this value to move the button outside the image
              top="50%" // Center the button vertically relative to the image
              transform="translateY(-50%)" // Adjust for perfect centering
              zIndex={2}
            />
          </Box>
        ) : (
          <Text>No maps found for this campaign.</Text>
        )}
      </VStack>

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
        />
      )}
    </Box>
  );
};

export default CampaignDetails;
