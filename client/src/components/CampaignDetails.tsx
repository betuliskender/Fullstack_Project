import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../utility/authContext";
import AddCharacterToCampaign from "./AddCharacterToCampaign";
import ChangeCharacterModal from "./ChangeCharacterModal";
import SessionForm from "./CreateSessionModal";
import EditSessionModal from "./EditSessionModal";
import MapUpload from "./MapUpload";
import { Session, Character, Map } from "../utility/types";
import {
  removeCharacterFromCampaign,
  deleteSession,
} from "../utility/apiservice";
import "../styles/campaignDetails.css";
import RollDice from "./RollDice";
import { deleteMapFromCampaign } from "../utility/apiservice";
import { updateCampaignField } from "../utility/updateCampaignFields";
import SessionLogs from "./SessionLogs";
import { useCampaignDetails } from "../hooks/useCampaignDetails";
import { useCharacters } from "../hooks/useCharacters";
import CharacterList from "./CharacterList";

// Chakra UI imports
import {
  Box,
  Button,
  Heading,
  Text,
  useToast,
  VStack,
  Divider,
  IconButton,
  Image,
  Select,
  Grid,
  GridItem,
  Flex,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { addPinToMap } from "../utility/apiservice";

interface ProfilePageProps {
  isLoggedIn: boolean;
}

const CampaignDetails: React.FC<ProfilePageProps> = ({ isLoggedIn }) => {
  const { id } = useParams<{ id: string }>();
  const { token } = useContext(AuthContext);
  const { campaign, setCampaign, loading, error, refetch } = useCampaignDetails(
    id || "",
    token
  );
  const { characters, loading: charactersLoading, error: charactersError } = useCharacters(token);
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

  if (!isLoggedIn) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Box textAlign="center">
          <Heading size="lg" mb={4}>
            You need to log in to view this page
          </Heading>
        </Box>
      </Flex>
    );
  }

  const handleMapUploaded = async (uploadedMap: Map) => {
    try {
      updateCampaignField("maps", uploadedMap, setCampaign);
      await refetch();
    } catch (error) {
      console.error("Error refetching campaign data after upload:", error);
    }
  };

  const handleSessionCreated = (newSession: Session) => {
    updateCampaignField("sessions", newSession, setCampaign);
  };

  const handleCharacterAdded = (newCharacter: Character) => {
    updateCampaignField("characters", newCharacter, setCampaign);
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

            const updatedMaps = prevCampaign.maps?.map((map) => ({
              ...map,
              pins: map.pins
                ? map.pins.filter((pin) => pin.character?._id !== characterId)
                : [],
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

  const handleMapDelete = async (mapId: string) => {
    if (!campaign || !token) return;

    try {
      const response = await deleteMapFromCampaign(campaign._id!, mapId, token);
      if (response.message === "Map deleted successfully") {
        setCampaign((prevCampaign) => {
          if (!prevCampaign) return null;

          const updatedMaps =
            prevCampaign.maps?.filter((map) => map._id !== mapId) || [];

          if (currentSlide >= updatedMaps.length) {
            setCurrentSlide((prev) => Math.max(0, prev - 1));
          }

          return {
            ...prevCampaign,
            maps: updatedMaps,
          };
        });

        toast({
          title: "Map deleted successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error deleting map:", error);
      toast({
        title: "Failed to delete map.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
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
      const updatedMap = await addPinToMap(
        campaign._id!,
        mapId,
        x,
        y,
        token,
        selectedCharacter
      );

      setCampaign((prevCampaign) => {
        if (!prevCampaign) return null;

        const updatedMaps = prevCampaign.maps?.map((map) =>
          map._id === mapId ? { ...map, pins: updatedMap.pins } : map
        );

        return { ...prevCampaign, maps: updatedMaps };
      });

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

  if (loading || charactersLoading)
    return <Text>Loading campaign details...</Text>;
  if (error)
    return <Text>Error loading campaign details: {error.message}</Text>;
  if (charactersError)
    return <Text>Error loading characters: {charactersError.message}</Text>;

  return (
    <Grid
      height="100vh"
      templateAreas={{
        base: `"main" "side"`,
        lg: `"main side"`,
      }}
      templateColumns={{
        base: "1fr",
        lg: "3fr auto",
      }}
      templateRows="1fr"
      gap={4}
      p={4}
    >
      {/* Main Content Area */}
      <GridItem area="main" p={4}>
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
              <Box position="relative" width="full">
                <Image
                  src={campaign.maps[currentSlide].imageURL}
                  alt="Campaign Map"
                  objectFit="cover"
                  borderRadius="md"
                  height="100%"
                  width="100%"
                  onClick={(event) =>
                    campaign.maps &&
                    handleMapClick(event, campaign.maps[currentSlide]._id!)
                  }
                />
                {campaign.maps[currentSlide]?.pins?.map((pin, index) => (
                  <Box
                    key={pin._id || `${pin.x}-${pin.y}-${index}`}
                    className="pin"
                    position="absolute"
                    left={`${pin.x}%`}
                    top={`${pin.y}%`}
                    transform="translate(-50%, -50%)"
                    bg="transparent"
                    borderRadius="50%"
                    width="50px"
                    height="50px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {pin.character?.imageURL ? (
                      <Image
                        src={pin.character.imageURL}
                        alt={pin.character.name || "Character"}
                        borderRadius="50%"
                        boxSize="50px"
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
                <Button
                  colorScheme="red"
                  size="sm"
                  mt={4}
                  onClick={() =>
                    campaign?.maps &&
                    handleMapDelete(campaign.maps[currentSlide]._id!)
                  }
                >
                  Delete Map
                </Button>
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
      </GridItem>

      {/* Right side: Carousel for Maps */}
      <GridItem area="side" p={4}>
        <VStack align="flex-start" spacing={4}>
          <Heading maxWidth="30ch" overflowWrap="break-word" as="h1">
            {campaign?.name}
          </Heading>
          <Text maxWidth="50ch" overflowWrap="break-word">
            {campaign?.description}
          </Text>

          <Heading as="h3" size="md">
            Characters
          </Heading>
          <CharacterList
            characters={campaign?.characters || []}
            onEdit={handleCharacterEdit}
            onRemove={handleCharacterRemove}
          />

          <AddCharacterToCampaign
            campaignId={campaign ? campaign._id || "" : ""}
            allCampaigns={campaign ? [campaign] : []}
            refetchCampaigns={() => {}}
            onCharacterAdded={handleCharacterAdded}
          />

          <Divider />

          {/* Dropdown for selecting a character */}
          <Select
            placeholder="Select character to pin on the map"
            onChange={(e) => setSelectedCharacter(e.target.value)}
          >
            {campaign?.characters.map((character) => (
              <option key={character._id} value={character._id}>
                {character.name}
              </option>
            ))}
          </Select>

          <Divider />

          {/* Session Form */}
          <SessionForm
            campaign={campaign!}
            onSessionCreated={handleSessionCreated}
          />
          <SessionLogs
            sessions={campaign?.sessions || []}
            onEditSession={handleSessionEdit}
            onDeleteSession={handleSessionDeleted}
            formatDate={formatDate}
          />

          {/* MapUpload Component */}
          {campaign && token && (
            <MapUpload
              campaignId={campaign._id!}
              token={token}
              onMapUploaded={handleMapUploaded}
            />
          )}
        </VStack>
        <RollDice />
      </GridItem>

      {isCharacterModalOpen && currentCharacterId && campaign && (
        <ChangeCharacterModal
        isOpen={isCharacterModalOpen}
        onClose={handleModalClose}
        campaign={campaign}
        currentCharacterId={currentCharacterId}
        availableCharacters={characters}
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
    </Grid>
  );
};

export default CampaignDetails;
