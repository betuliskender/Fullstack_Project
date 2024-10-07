// import React, { useEffect, useState, useContext } from "react";
// import { useParams } from "react-router-dom";
// import { useQuery } from "@apollo/client";
// import { AuthContext } from "../utility/authContext";
// import { GET_CAMPAIGN_BY_ID, GETALLCHARACTERS } from "../graphql/queries";
// import { Campaign, Character } from "../utility/types";
// import AddCharacterToCampaign from "./AddCharacterToCampaign";
// import ChangeCharacterModal from "./ChangeCharacterModal";
// import { removeCharacterFromCampaign } from "../utility/apiservice";

// const CampaignDetail: React.FC = () => {
//   const { token } = useContext(AuthContext);
//   const { campaignId } = useParams<{ campaignId: string }>();
//   const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null);
//   const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false);
//   const [currentCharacterId, setCurrentCharacterId] = useState<string | null>(null);
//   const [availableCharacters, setAvailableCharacters] = useState<Character[]>([]);

//   // Fetching the specific campaign details
//   const { loading, error, data, refetch } = useQuery(GET_CAMPAIGN_BY_ID, {
//     variables: { id: campaignId },
//     context: {
//       headers: {
//         Authorization: token ? `${token}` : "",
//       },
//     },
//     fetchPolicy: "network-only",
//   });

//   // Fetching all characters data
//   const { data: charactersData, loading: charactersLoading, error: charactersError } = useQuery(GETALLCHARACTERS, {
//     context: {
//       headers: {
//         Authorization: token ? `${token}` : "",
//       },
//     },
//   });

//   useEffect(() => {
//     console.log("Received data for campaign:", data); // Debug log for campaign data
//     if (data && data.campaign) {
//       setCurrentCampaign(data.campaign);
//     } else {
//       console.error("Campaign not found or data is null");
//     }
//   }, [data]);

//   useEffect(() => {
//     if (charactersData && charactersData.characters && currentCampaign) {
//       const available = charactersData.characters.filter(
//         (character: Character) =>
//           !currentCampaign.characters.some((c) => c._id === character._id)
//       );
//       setAvailableCharacters(available);
//     }
//   }, [charactersData, currentCampaign]);

//   const handleCharacterEdit = (characterId: string) => {
//     setCurrentCharacterId(characterId);
//     setIsCharacterModalOpen(true);
//   };

//   const handleModalClose = () => {
//     setIsCharacterModalOpen(false);
//     setCurrentCharacterId(null);
//   };

//   const handleRemoveCharacter = async (characterId: string) => {
//     try {
//       if (token && campaignId) {
//         const response = await removeCharacterFromCampaign(campaignId, characterId, token);
//         if (response.message) {
//           // Update the state to remove the character locally
//           setCurrentCampaign((prevCampaign) => {
//             if (!prevCampaign) return null;
//             const updatedCampaign = {
//               ...prevCampaign,
//               characters: prevCampaign.characters.filter(
//                 (character) => character._id !== characterId
//               ),
//             };
//             console.log("Updated campaign state after removal:", updatedCampaign);
//             return updatedCampaign;
//           });
//           // Remove the refetch call to rely solely on the manual state update
//           // await refetch(); // Comment this line if it's causing issues
//         }
//       }
//     } catch (error) {
//       console.error("Error removing character from campaign:", error);
//     }
//   };
//   if (loading || charactersLoading) return <p>Loading...</p>;
//   if (error || charactersError) return <p>Error: {error?.message || charactersError?.message}</p>;

//   return (
//     <div>
//       {currentCampaign ? (
//         <>
//           <h2>{currentCampaign.name}</h2>
//           <p>{currentCampaign.description}</p>
//           <h3>Characters in this campaign:</h3>
//           <ul>
//             {currentCampaign.characters.map((character: Character) => (
//               <li key={character._id}>
//                 {character.name}
//                 <button onClick={() => character._id && handleCharacterEdit(character._id)}>Edit Character</button>
//                 <button onClick={() => character._id && handleRemoveCharacter(character._id)}>Remove Character</button>
//               </li>
//             ))}
//           </ul>
//           <AddCharacterToCampaign
//             campaignId={currentCampaign._id!}
//             allCampaigns={[currentCampaign]}
//             refetchCampaigns={refetch}
//           />
//           <ChangeCharacterModal
//             isOpen={isCharacterModalOpen}
//             onClose={handleModalClose}
//             campaign={currentCampaign}
//             currentCharacterId={currentCharacterId!}
//             availableCharacters={availableCharacters}
//             refetchCampaigns={refetch}
//             setCampaigns={setCurrentCampaign}
//           />
//         </>
//       ) : (
//         <p>No campaign data available.</p>
//       )}
//     </div>
//   );
// };

// export default CampaignDetail;
