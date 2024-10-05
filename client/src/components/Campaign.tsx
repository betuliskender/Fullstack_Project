import React, { useContext, useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { AuthContext } from "../utility/authContext";
import { GET_CAMPAIGNS_WITH_CHARACTERS } from "../graphql/queries";
import { deleteCampaign, editCampaign } from "../utility/apiservice";
import { Campaign } from "../utility/types";
import AddCharacterToCampaign from "./AddCharacterToCampaign";


interface ProfilePageProps {
  isLoggedIn: boolean;
}

const CampaignType: React.FC<ProfilePageProps> = ({ isLoggedIn }) => {
  const { token } = useContext(AuthContext);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null);

  const { loading, error, data, refetch } = useQuery(
    GET_CAMPAIGNS_WITH_CHARACTERS,
    {
      context: {
        headers: {
          Authorization: token ? `${token}` : "",
        },
      },
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
          <div key={campaign._id} className="campaign-card">
            <div className="campaign-info">
              <h3 className="campaign-title">{campaign.name}</h3>
              <p className="campaign-description">{campaign.description}</p>
            </div>

            <div className="campaign-characters">
              <h4>Characters in this campaign:</h4>
              <ul className="character-list">
                {campaign.characters && campaign.characters.length > 0 ? (
                  campaign.characters.map((character) => (
                    <li key={character._id}>{character.name}</li>
                  ))
                ) : (
                  <p>No characters in this campaign.</p>
                )}
              </ul>

              <div className="add-character-section">
                <AddCharacterToCampaign
                  campaignId={campaign._id!}
                  allCampaigns={campaigns}
                  refetchCampaigns={refetch}
                />
              </div>
            </div>

            <div className="button-group">
              <button
                onClick={() => campaign._id && handleDelete(campaign._id)}
                className="delete-button"
              >
                Delete
              </button>
              <button
                onClick={() => handleEdit(campaign)}
                className="edit-button"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

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
