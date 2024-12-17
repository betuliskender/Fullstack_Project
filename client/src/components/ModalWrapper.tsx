import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react";

interface ModalWrapperProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    children: React.ReactNode;
  }
  
  const ModalWrapper: React.FC<ModalWrapperProps> = ({
    isOpen,
    onClose,
    onSubmit,
    children,
  }) => (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add a Character</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={onSubmit}>{children}</form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );

  export default ModalWrapper;