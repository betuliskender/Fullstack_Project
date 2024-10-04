import React, { useState, ChangeEvent, FormEvent, useContext } from "react";
import { createCampaign } from "../utility/apiservice";
import { Campaign } from "../utility/types";
import { AuthContext } from "../utility/authContext";

interface ProfilePageProps {
  isLoggedIn: boolean;
}

const CampaignForm: React.FC<ProfilePageProps> = ({ isLoggedIn }) => {
  const { user, token } = useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [campaign, setCampaign] = useState<Campaign>({
    name: "",
    description: "",
    user: user?._id || "",  // Forbinder brugeren med kampagnen
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCampaign({
      ...campaign,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (token) {
        await createCampaign(campaign, token);
        setSuccessMessage("Campaign created successfully!");

        // Ryd form
        setCampaign({
          name: "",
          description: "",
          user: user?._id || "",
        });
      } else {
        console.error("Token is null or undefined");
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
    }
  };

  return (
    <React.Fragment>
      {isLoggedIn ? (
        <div>
          <h1>Create Campaign</h1>
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
          <form onSubmit={handleSubmit}>
            <div>
              <label>Name:</label>
              <input type="text" name="name" value={campaign.name} onChange={handleChange} />
            </div>
            <div>
              <label>Description:</label>
              <textarea name="description" value={campaign.description} onChange={handleChange} />
            </div>
            <button type="submit">Create Campaign</button>
          </form>
        </div>
      ) : (
        <div>
          <h2>You need to log in to create a campaign</h2>
        </div>
      )}
    </React.Fragment>
  );
};

export default CampaignForm;
