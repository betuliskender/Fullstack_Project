import React, { useContext, useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom"; // Importér useNavigate
import { AuthContext } from "../utility/authContext";
import { GET_CAMPAIGNS_WITH_CHARACTERS } from "../graphql/queries";
import { deleteCampaign, editCampaign } from "../utility/apiservice";
import { Campaign } from "../utility/types";
import "../styles/campaign.css";

interface ProfilePageProps {
  isLoggedIn: boolean;
}

const CampaignType: React.FC<ProfilePageProps> = ({ isLoggedIn }) => {
  const { token } = useContext(AuthContext);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null);
  const navigate = useNavigate(); // Brug useNavigate til at navigere til kampagnesiden

  const { loading, error, data, refetch } = useQuery(GET_CAMPAIGNS_WITH_CHARACTERS, {
    context: {
      headers: {
        Authorization: token ? `${token}` : "",
      },
    },
    fetchPolicy: "network-only",
  });

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

  const handleEdit = (campaign: Campaign) => {
    setCurrentCampaign(campaign);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentCampaign(null);
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (currentCampaign && token) {
      try {
        await editCampaign(currentCampaign._id!, currentCampaign, token);
        refetch();
        handleModalClose();
      } catch (error) {
        console.error("Error updating campaign:", error);
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCurrentCampaign((prevCampaign) => ({
      ...prevCampaign!,
      [name]: value,
    }));
  };

  const handleCampaignClick = (campaignId: string) => {
    navigate(`/campaign/${campaignId}`); // Naviger til den specifikke kampagneside
  };

  if (!isLoggedIn || !token) {
    return <p>You must be logged in to view campaigns.</p>;
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <div className="header-container">
        <h1>Active Campaigns</h1>
        <Link to="/create-campaign">
          <button className="create-button">Create New Campaign</button>
        </Link>
      </div>
      <div className="campaign-grid">
        {campaigns.map((campaign: Campaign) => (
          <div
            key={campaign._id}
            className="campaign-card"
            onClick={() => handleCampaignClick(campaign._id!)} // Gør kampagnekortet klikbart
          >
            <div className="campaign-info">
              <h3 className="campaign-title">{campaign.name}</h3>
              <p className="campaign-description">{campaign.description}</p>
            </div>

            <div className="button-group">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Forhindr kortklik når du klikker på knappen
                  handleDelete(campaign._id!);
                }}
                className="delete-button"
              >
                Delete
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Forhindr kortklik når du klikker på knappen
                  handleEdit(campaign);
                }}
                className="edit-button"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal til at redigere kampagne */}
      {isModalOpen && currentCampaign && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleModalClose}>
              &times;
            </span>
            <h2>Edit Campaign</h2>
            <form onSubmit={handleFormSubmit}>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={currentCampaign.name}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Description:
                <input
                  type="text"
                  name="description"
                  value={currentCampaign.description}
                  onChange={handleInputChange}
                />
              </label>
              <button type="submit">Save</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignType;
