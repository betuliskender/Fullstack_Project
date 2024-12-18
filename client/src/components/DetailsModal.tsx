import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
} from "@chakra-ui/react";

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    name: string;
    level?: string | number;
    abilityScore?: string;
    description?: string;
    desc?: string | string[];
  } | null;
}

const DetailsModal: React.FC<DetailsModalProps> = ({ isOpen, onClose, item }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      {item && (
        <>
          <ModalHeader>{item.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {item.level && (
              <Text>
                <strong>Level:</strong> {item.level}
              </Text>
            )}
            {item.abilityScore && (
              <Text mt={2}>
                <strong>Ability Score:</strong> {item.abilityScore}
              </Text>
            )}
            <Text mt={2}>
              <strong>Description:</strong> {item.description || item.desc}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} colorScheme="blue">
              Close
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  </Modal>
);

export default DetailsModal;
