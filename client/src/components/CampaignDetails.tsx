import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { AuthContext } from "../utility/authContext";
import { GET_CAMPAIGN_BY_ID, GETALLCHARACTERS } from "../graphql/queries";
import AddCharacterToCampaign from "./AddCharacterToCampaign";
import ChangeCharacterModal from "./ChangeCharacterModal";
import SessionForm from "./CreateSessionModal";
import EditSessionModal from "./EditSessionModal";
import MapUpload from "./MapUpload";
import { Campaign, Session, Character, Map } from "../utility/types";
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
  Select,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { addPinToMap } from "../utility/apiservice";

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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(
    null
  );

  const toast = useToast();

  const {
    loading: campaignLoading,
    error: campaignError,
    data: campaignData,
    refetch: refetchCampaign,
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
          setCampaign((prevCampaign) => {
            if (!prevCampaign) return null;
  
            // Fjern pins for karakteren
            const updatedMaps = prevCampaign.maps?.map((map) => ({
              ...map,
              pins: map.pins ? map.pins.filter((pin) => pin.character?._id !== characterId) : [],
            }));
  
            return {
              ...prevCampaign,
              characters: prevCampaign.characters.filter(
                (character) => character._id !== characterId
              ),
              maps: updatedMaps || [],
            };
          });
  
          toast({
            title: "Character removed successfully.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error("Error removing character from campaign:", error);
        toast({
          title: "Failed to remove character.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };
  

  const handleMapClick = async (
    event: React.MouseEvent<HTMLImageElement>,
    mapId: string
  ) => {
    if (!campaign || !token) return;
  
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Number(((event.clientX - rect.left) / rect.width) * 100);
    const y = Number(((event.clientY - rect.top) / rect.height) * 100);
  
    if (!selectedCharacter) {
      toast({
        title: "Please select a character before placing a pin.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  
    try {
      // Kald backend for at tilføje pin
      const updatedMap = await addPinToMap(
        campaign._id!,
        mapId,
        x,
        y,
        token,
        selectedCharacter
      );
  
      // Opdater state manuelt for en hurtig UI-opdatering
      setCampaign((prevCampaign) => {
        if (!prevCampaign) return null;
  
        const updatedMaps = prevCampaign.maps?.map((map) =>
          map._id === updatedMap._id ? updatedMap : map
        );
  
        return { ...prevCampaign, maps: updatedMaps };
      });
  
      // Kald refetch for at sikre data konsistens
      refetchCampaign();
  
      toast({
        title: "Pin added successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error adding pin:", error);
      toast({
        title: "Failed to add pin.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
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
      <VStack align="flex-start" spacing={4}>
        <Heading as="h1">{campaign?.name}</Heading>
        <Text>{campaign?.description}</Text>

        <Heading as="h3" size="md">
          Characters in this campaign:
        </Heading>

        {/* Dropdown for selecting a character */}
        <Select
          placeholder="Select a character"
          onChange={(e) => setSelectedCharacter(e.target.value)}
        >
          {campaign?.characters.map((character) => (
            <option key={character._id} value={character._id}>
              {character.name}
            </option>
          ))}
        </Select>

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
              left="-40px"
              top="50%"
              transform="translateY(-50%)"
              zIndex={2}
            />
            <Box position="relative" width="full" height="400px">
              <Image
                src={`http://localhost:5000${campaign.maps[currentSlide].imageURL}`}
                alt="Campaign Map"
                borderRadius="md"
                boxSize="400px"
                objectFit="cover"
                onClick={(event) =>
                  campaign.maps &&
                  handleMapClick(event, campaign.maps[currentSlide]._id!)
                }
              />
              {campaign.maps[currentSlide]?.pins?.map((pin) => (
  <Box
    key={pin._id} // Brug pin._id som en unik nøgle
    className="pin"
    position="absolute"
    left={`${pin.x}%`}
    top={`${pin.y}%`}
    transform="translate(-50%, -50%)"
    bg="transparent"
    borderRadius="50%"
    width="30px"
    height="30px"
    display="flex"
    alignItems="center"
    justifyContent="center"
  >
    {pin.character?.imageURL ? (
      <Image
        src={pin.character.imageURL}
        alt={pin.character.name || "Character"}
        borderRadius="50%"
        boxSize="30px"
        objectFit="cover"
        border="2px solid white"
      />
    ) : (
      <Text
        fontSize="xs"
        color="white"
        bg="black"
        borderRadius="md"
        p={1}
        textAlign="center"
        maxWidth="50px"
      >
        {pin.character?.name || "Unknown"}
      </Text>
    )}
  </Box>
              ))}
            </Box>
            <IconButton
              icon={<ChevronRightIcon />}
              aria-label="Next Map"
              onClick={goToNextSlide}
              position="absolute"
              right="-40px"
              top="50%"
              transform="translateY(-50%)"
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
