import React, { useState, useRef } from "react";
import { uploadMapToCampaign } from "../utility/apiservice";
import { Map } from "../utility/types";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  Heading,
  Text,
} from "@chakra-ui/react";

interface MapUploadProps {
  campaignId: string;
  token: string;
  onMapUploaded: (uploadedMap: Map) => void; // Callback when map is uploaded
}

const MapUpload: React.FC<MapUploadProps> = ({ campaignId, token, onMapUploaded }) => {
  const [mapFile, setMapFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setMapFile(files[0]);
    }
  };

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (mapFile) {
      setIsUploading(true);
      try {
        const uploadedMap = await uploadMapToCampaign(campaignId, mapFile, token);
        onMapUploaded(uploadedMap); // Call the callback function with the uploaded map
        setMapFile(null); // Reset the file input state
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Clear the actual file input field
        }
        setIsModalOpen(false); // Close the modal after upload
      } catch (error) {
        console.error("Error uploading map:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <>
      <Button colorScheme="teal" onClick={() => setIsModalOpen(true)}>
        Upload Map
      </Button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading as="h3" size="lg">Upload a Map for the Campaign</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleUpload}>
              <FormControl mb={4}>
                <FormLabel htmlFor="map-upload">Select a map image</FormLabel>
                <Input
                  ref={fileInputRef} // Attach the ref here
                  type="file"
                  accept="image/*"
                  id="map-upload"
                  onChange={handleFileChange}
                />
              </FormControl>
              {mapFile && (
                <Text mt={2} color="gray.500">
                  Selected File: {mapFile.name}
                </Text>
              )}
              {isUploading && (
                <Spinner size="sm" color="teal.500" mt={2} />
              )}
            </form>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" isLoading={isUploading} isDisabled={isUploading || !mapFile}>
              Upload Map
            </Button>
            <Button colorScheme="gray" onClick={() => setIsModalOpen(false)} ml={3}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MapUpload;
