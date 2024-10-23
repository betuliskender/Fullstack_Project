import React, { useState, ChangeEvent, useContext } from "react";
import { createCampaign } from "../utility/apiservice";
import { Campaign as CampaignType } from "../utility/types";
import { AuthContext } from "../utility/authContext";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Button,
  Text
} from "@chakra-ui/react";

interface CampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  onCampaignCreated: (campaign: CampaignType) => void; // New prop
}

const CampaignModal: React.FC<CampaignModalProps> = ({ isOpen, onClose, isLoggedIn, onCampaignCreated }) => {
    const { user, token } = useContext(AuthContext);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [campaign, setCampaign] = useState<CampaignType>({
        name: "",
        description: "",
        user: user?._id || "",
        characters: [],
        sessions: [],
      });
    
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCampaign({
        ...campaign,
        [name]: value,
        });
    };
    
    const handleSubmit = async () => {
        try {
          if (token) {
            const newCampaign = await createCampaign(campaign, token);
            setSuccessMessage("Campaign created successfully!");
    
            // Ryd form
            setCampaign({
              name: "",
              description: "",
              user: user?._id || "",
              characters: [],
              sessions: [],
            });

            onCampaignCreated(newCampaign);
            onClose();

          } else {
            console.error("Token is null or undefined");
          }
        } catch (error) {
          console.error("Error creating campaign:", error);
        }
      };
    
    return (
        <>
      {isLoggedIn && (
        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Create Campaign</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            <form onSubmit={handleSubmit}>
                <Input
                placeholder="Name"
                name="name"
                value={campaign.name}
                onChange={handleChange}
                mb={3}
                />
                <Input
                placeholder="Description"
                name="description"
                value={campaign.description}
                onChange={handleChange}
                mb={3}
                />
                <Button type="submit" colorScheme="blue">
                Create Campaign
                </Button>
            </form>
            {successMessage && <Text mt={3}>{successMessage}</Text>}
            </ModalBody>
            <ModalFooter>
            <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
        </ModalContent>
        </Modal>
        )}
        {!isLoggedIn && (
          <div>
            <h2>You need to login to see this page</h2>
          </div>
        )}
      </>
    );
    }

export default CampaignModal;