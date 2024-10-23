import React, { useContext, useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../utility/authContext";
import { GET_CAMPAIGNS_WITH_CHARACTERS } from "../graphql/queries";
import { deleteCampaign, editCampaign } from "../utility/apiservice";
import { Campaign } from "../utility/types";
import CreateCampaignModal from "./CreateCampaignModal";
import { FaCog } from "react-icons/fa";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  IconButton,
  Text,
} from "@chakra-ui/react";
import EditCampaignModal from "./EditCampaignModal";

interface ProfilePageProps {
  isLoggedIn: boolean;
}

const CampaignType: React.FC<ProfilePageProps> = ({ isLoggedIn }) => {
  const { token } = useContext(AuthContext);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null);
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const { loading, error, data, refetch } = useQuery(
    GET_CAMPAIGNS_WITH_CHARACTERS,
    {
      context: {
        headers: {
          Authorization: token ? `${token}` : "",
        },
      },
      fetchPolicy: "network-only",
    }
  );

  useEffect(() => {
    if (isLoggedIn && token) {
      refetch();
    }
  }, [isLoggedIn, token, refetch]);

  useEffect(() => {
    if (data && data.campaigns) {
      setCampaigns(data.campaigns);
    }
  }, [data]);

  const handleDelete = async (id: string) => {
    try {
      if (token) {
        await deleteCampaign(id, token);
        refetch();
      }
    } catch (error) {
      console.error("Error deleting campaign:", error);
    }
  };

  const handleEditSubmit = async (updatedCampaign: Campaign) => {
    if (updatedCampaign && token) {
      try {
        await editCampaign(updatedCampaign._id!, updatedCampaign, token);
        refetch();
        setIsEditModalOpen(false);
      } catch (error) {
        console.error("Error updating campaign:", error);
      }
    }
  };

  const handleEdit = (campaign: Campaign) => {
    setCurrentCampaign(campaign);
    setIsEditModalOpen(true);
  }

  const handleCampaignCreated = (newCampaign: Campaign) => {
    setCampaigns((prevCampaigns) => [...prevCampaigns, newCampaign]);
  }

  const handleCampaignClick = (campaignId: string) => {
    navigate(`/campaign/${campaignId}`);
  };

  if (!isLoggedIn || !token) {
    return <p>You must be logged in to view campaigns.</p>;
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Box p={5}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Heading as="h1" size="lg">Campaigns</Heading>
        <Button onClick={() => setModalOpen(true)} colorScheme="teal">Create new Campaign</Button>
      </Box>
    <CreateCampaignModal
      isOpen={modalOpen}
      onClose={() => setModalOpen(false)}
      isLoggedIn={isLoggedIn}
      onCampaignCreated={handleCampaignCreated}
    />

    <Box mt={5} display="grid" gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
      {campaigns.map((campaign: Campaign) => (
        <Card key={campaign._id}>
          <CardHeader>
            <Heading as="h2" size="md">{campaign.name}</Heading>
            <IconButton
              icon={<FaCog />}
              aria-label="Edit campaign"
              onClick={() => handleEdit(campaign)}
              position="absolute"
              top="10px"
              right="10px"
            />
          </CardHeader>
          <CardBody>
            <Text>{campaign.description}</Text>
            <Button onClick={() => handleCampaignClick(campaign._id!)} colorScheme="blue">View</Button>
            <Button onClick={() => campaign._id && handleDelete(campaign._id!)} colorScheme="red">Delete</Button>
          </CardBody>
        </Card>
        ))}
    </Box>

    <EditCampaignModal
      isOpen={isEditModalOpen}
      onClose={() => setIsEditModalOpen(false)}
      isLoggedIn={isLoggedIn}
      currentCampaign={currentCampaign}
      onSubmit={handleEditSubmit}
      />
  </Box>

      // <div>
    //   <div className="header-container">
    //     <h1>Active Campaigns</h1>
    //     <Link to="/create-campaign">
    //       <button className="create-button">Create New Campaign</button>
    //     </Link>
    //   </div>
    //   <div className="campaign-grid">
    //     {campaigns.map((campaign: Campaign) => (
    //       <div key={campaign._id} className="campaign-card">
    //         <FaCog className="edit-icon" onClick={() => handleEdit(campaign)} />

    //         <div className="campaign-info">
    //           <h3 className="campaign-title">{campaign.name}</h3>
    //           <p className="campaign-description">{campaign.description}</p>
    //         </div>

    //         <div className="button-group">
    //           <button
    //             onClick={() => handleCampaignClick(campaign._id!)}
    //             className="view-button"
    //           >
    //             View
    //           </button>
    //           <button
    //             onClick={() => handleDelete(campaign._id!)}
    //             className="delete-button"
    //           >
    //             Delete
    //           </button>
    //         </div>
    //       </div>
    //     ))}
    //   </div>

    //   {/* Modal til at redigere kampagne */}
    //   {isEditModalOpen && currentCampaign && (
    //     <div className="modal">
    //       <div className="modal-content">
    //         <span className="close" onClick={handleModalClose}>
    //           &times;
    //         </span>
    //         <h2>Edit Campaign</h2>
    //         <form onSubmit={handleFormSubmit}>
    //           <label>
    //             Name:
    //             <input
    //               type="text"
    //               name="name"
    //               value={currentCampaign.name}
    //               onChange={handleInputChange}
    //             />
    //           </label>
    //           <label>
    //             Description:
    //             <input
    //               type="text"
    //               name="description"
    //               value={currentCampaign.description}
    //               onChange={handleInputChange}
    //             />
    //           </label>
    //           <button type="submit">Save</button>
    //         </form>
    //       </div>
    //     </div>
    //   )}
    // </div>
  );
};

export default CampaignType;
