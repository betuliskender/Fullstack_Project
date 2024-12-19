import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HStack,
  VStack,
  Button,
  useDisclosure,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useMediaQuery,
} from "@chakra-ui/react";
import ColorModeSwitch from "./ColorModeSwitch";
import LogIn from "./LogIn"; // Import LogIn modal component
import RegisterModal from "./Register"; // Import Register modal component
import { FaVolumeMute, FaVolumeUp, FaBars } from "react-icons/fa";

interface NavbarProps {
  isLoggedIn: boolean;
  onLogin: () => void; // Callback function to handle login event
  onLogout: () => void; // Callback function to handle logout event
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, onLogin, onLogout }) => {
  const { isOpen: isLoginOpen, onOpen: onLoginOpen, onClose: onLoginClose } = useDisclosure();
  const { isOpen: isRegisterOpen, onOpen: onRegisterOpen, onClose: onRegisterClose } = useDisclosure();
  const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Responsive check for small screens
  const [isSmallScreen] = useMediaQuery("(max-width: 768px)");

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  }, []);

  const NavLinks = () => (
    <>
      <Link to="/">
        <Button colorScheme="teal" variant="ghost" w="full">
          Home
        </Button>
      </Link>
      {isLoggedIn && (
        <>
          <Link to="/profile">
            <Button colorScheme="teal" variant="ghost" w="full">
              Profile
            </Button>
          </Link>
          <Link to="/campaign">
            <Button colorScheme="teal" variant="ghost" w="full">
              Campaign
            </Button>
          </Link>
          <Link to="/character">
            <Button colorScheme="teal" variant="ghost" w="full">
              Characters
            </Button>
          </Link>
          <Link to="/spells">
            <Button colorScheme="teal" variant="ghost" w="full">
              Spells
            </Button>
          </Link>
          <Link to="/skills">
            <Button colorScheme="teal" variant="ghost" w="full">
              Skills
            </Button>
          </Link>
        </>
      )}
    </>
  );

  return (
    <HStack spacing={4} justify="space-between" p={4}>
      {/* Left: Hamburger or Links */}
      {isSmallScreen ? (
        <IconButton
          aria-label="Open Menu"
          icon={<FaBars />}
          colorScheme="teal"
          onClick={onDrawerOpen}
        />
      ) : (
        <HStack spacing={4}>
          <NavLinks />
        </HStack>
      )}

      {/* Right: Login/Logout and settings */}
      <HStack spacing={4}>
        {isLoggedIn ? (
          <Button colorScheme="teal" variant="solid" onClick={onLogout}>
            Logout
          </Button>
        ) : (
          <>
            <Button colorScheme="teal" variant="solid" onClick={onLoginOpen}>
              Login
            </Button>
            <Button colorScheme="teal" variant="solid" onClick={onRegisterOpen}>
              Register
            </Button>
            {/* LogIn Modal */}
            <LogIn isOpen={isLoginOpen} onClose={onLoginClose} onLogin={onLogin} />
            {/* Register Modal */}
            <RegisterModal isOpen={isRegisterOpen} onClose={onRegisterClose} />
          </>
        )}
        <ColorModeSwitch />
        <IconButton
          aria-label="Toggle Music"
          icon={isPlaying ? <FaVolumeUp /> : <FaVolumeMute />}
          colorScheme="teal"
          size="sm"
          onClick={toggleMusic}
        />
        <audio ref={audioRef} loop>
          <source src="/assets/401_Feast_of_Crispian.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </HStack>

      {/* Drawer for mobile */}
      <Drawer isOpen={isDrawerOpen} placement="left" onClose={onDrawerClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <VStack align="start">
              <NavLinks />
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </HStack>
  );
};

export default Navbar;
