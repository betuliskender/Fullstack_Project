import React from "react";
import { Link } from "react-router-dom";
import { HStack, Button, useDisclosure } from "@chakra-ui/react";
import ColorModeSwitch from "./ColorModeSwitch";
import LogIn from "./LogIn"; // Import the LogIn modal component
import RegisterModal from "./Register"; // Import the Register modal component

interface NavbarProps {
  isLoggedIn: boolean;
  onLogin: () => void; // Callback function to handle login event
  onLogout: () => void; // Callback function to handle logout event
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, onLogin, onLogout }) => {
  const { isOpen: isLoginOpen, onOpen: onLoginOpen, onClose: onLoginClose } = useDisclosure();
  const { isOpen: isRegisterOpen, onOpen: onRegisterOpen, onClose: onRegisterClose } = useDisclosure();

  return (
    <HStack spacing={4} justify="space-between">
      <HStack spacing={4}>
        <Link to="/">
          <Button colorScheme="teal" variant="ghost">
            Home
          </Button>
        </Link>
        {isLoggedIn && (
          <>
            <Link to="/profile">
              <Button colorScheme="teal" variant="ghost">
                Profile
              </Button>
            </Link>
            <Link to="/character">
              <Button colorScheme="teal" variant="ghost">
                Characters
              </Button>
            </Link>
          </>
        )}
      </HStack>
      <HStack spacing={4}>
        {isLoggedIn ? (
          
          <>
            <Button colorScheme="teal" variant="solid" onClick={onLogout}>
              Logout
            </Button>
            <ColorModeSwitch />
          </>
          
        ) : (
          <>
            <Button colorScheme="teal" variant="solid" onClick={onLoginOpen}>
              Login
            </Button>
            <Button colorScheme="teal" variant="solid" onClick={onRegisterOpen}>
              Register
            </Button>
            <ColorModeSwitch />
            {/* Login Modal */}
            <LogIn isOpen={isLoginOpen} onClose={onLoginClose} onLogin={onLogin} />
            {/* Register Modal */}
            <RegisterModal isOpen={isRegisterOpen} onClose={onRegisterClose} />
          </>
        )}
      </HStack>
    </HStack>
  );
};

export default Navbar;
