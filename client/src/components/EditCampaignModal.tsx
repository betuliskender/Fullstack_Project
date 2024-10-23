import React, { useState, ChangeEvent, useEffect } from "react";
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
} from "@chakra-ui/react";
import { Campaign } from "../utility/types";

interface EditCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  currentCampaign: Campaign | null;
  onSubmit: (updatedCampaign: Campaign) => void;
}

const EditCampaignModal: React.FC<EditCampaignModalProps> = ({
  isOpen,
  onClose,
  currentCampaign,
  onSubmit,
}) => {
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  // Sync the campaign state with the currentCampaign prop when it changes
  useEffect(() => {
    if (currentCampaign) {
      setCampaign(currentCampaign);
    }
  }, [currentCampaign]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCampaign((prevCampaign) => ({
      ...prevCampaign!,
      [name]: value,
    }));
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (campaign) {
      onSubmit(campaign); // Pass the updated campaign back to the parent component
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Campaign</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {campaign && (
            <form onSubmit={handleFormSubmit}>
              <Input
                placeholder="Name"
                name="name"
                value={campaign.name}
                onChange={handleInputChange}
                mb={3}
              />
              <Input
                placeholder="Description"
                name="description"
                value={campaign.description}
                onChange={handleInputChange}
                mb={3}
              />
            </form>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button colorScheme="green" onClick={handleFormSubmit}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditCampaignModal;
