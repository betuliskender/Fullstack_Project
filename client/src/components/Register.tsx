import React, { useState, ChangeEvent } from "react";
import { registerUser } from "../utility/apiservice";
import { User } from "../utility/types";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  FormControl,
  FormLabel,
  Text,
  Spinner,
} from "@chakra-ui/react";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
  const [user, setUser] = useState<User>({ firstName: "", lastName: "", userName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setSuccessMessage(null); // Clear previous success messages

    // Simple form validation
    if (user.password.length < 6) {
      return setError("Password must be at least 6 characters long.");
    }
    if (!user.email || !user.firstName || !user.lastName || !user.userName) {
      return setError("All fields are required.");
    }

    setLoading(true); // Start loading

    try {
      const response = await registerUser(user); // Call registerUser API function
      setSuccessMessage(response.message); // Display success message
      setUser({ firstName: "", lastName: "", userName: "", email: "", password: "" }); // Clear form
    } catch (error) {
      setError("Error registering user. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Register</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {error && <Text color="red.500">{error}</Text>} {/* Display error messages */}
          {successMessage && <Text color="green.500">{successMessage}</Text>} {/* Display success message */}
          <form onSubmit={handleSubmit}>
            <FormControl id="firstName" isRequired>
              <FormLabel>First Name</FormLabel>
              <Input
                type="text"
                name="firstName"
                value={user.firstName}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="lastName" isRequired>
              <FormLabel>Last Name</FormLabel>
              <Input
                type="text"
                name="lastName"
                value={user.lastName}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="userName" isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                name="userName"
                value={user.userName}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                name="password"
                value={user.password}
                onChange={handleChange}
              />
            </FormControl>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleSubmit}
            isLoading={loading}
            disabled={loading}
          >
            {loading ? <Spinner size="sm" /> : "Register"}
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RegisterModal;
