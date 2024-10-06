import React, { useState, useContext } from "react";
import { AuthContext } from "../utility/authContext";
import { loginUser } from "../utility/apiservice";
import { User } from "../utility/types";
import { Button, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

interface LoginModalProps {
  onLogin: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onLogin, isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setLoggedIn, setUser, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const data = await loginUser({ email, password });

      const token = data.jwtToken;
      const user: User = data.user;
      console.log("JWT token:", token);

      // Store the token
      setToken(token);
      setUser(user); // Save user data in context

      console.log("Login successful");
      setLoggedIn(true);
      onLogin();
      onClose(); // Close the modal after login
      navigate("/profile");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Login</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <div className="email">
              <label htmlFor="email">Email</label>
              <Input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                mb={3}
              />
            </div>
            <div className="password">
              <label htmlFor="password">Password</label>
              <Input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                mb={3}
              />
            </div>
            <Button colorScheme="blue" type="submit" width="100%">
              Login
            </Button>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;
