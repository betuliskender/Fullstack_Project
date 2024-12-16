import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { HStack, Button, useDisclosure, IconButton } from "@chakra-ui/react";
import ColorModeSwitch from "./ColorModeSwitch";
import LogIn from "./LogIn"; // Import LogIn modal component
import RegisterModal from "./Register"; // Import Register modal component
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";

interface NavbarProps {
  isLoggedIn: boolean;
  onLogin: () => void; // Callback function to handle login event
  onLogout: () => void; // Callback function to handle logout event
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, onLogin, onLogout }) => {
  const { isOpen: isLoginOpen, onOpen: onLoginOpen, onClose: onLoginClose } = useDisclosure();
  const { isOpen: isRegisterOpen, onOpen: onRegisterOpen, onClose: onRegisterClose } = useDisclosure();

  // Music-controller
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

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
            <Link to="/campaign">
              <Button colorScheme="teal" variant="ghost">
                Campaign
              </Button>
            </Link>
            <Link to="/character">
              <Button colorScheme="teal" variant="ghost">
                Characters
              </Button>
            </Link>
            <Link to="/spells">
              <Button colorScheme="teal" variant="ghost">
                Spells
              </Button>
            </Link>
            <Link to="/skills">
              <Button colorScheme="teal" variant="ghost">
                Skills
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
          </>
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
        {/* Music-button */}
        <IconButton
          aria-label="Toggle Music"
          icon={isPlaying ? <FaVolumeUp /> : <FaVolumeMute />}
          colorScheme="teal"
          size="sm"
          onClick={toggleMusic}
        />
        {/* Audio Element */}
        <audio ref={audioRef} loop>
          <source src="/assets/401_Feast_of_Crispian.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </HStack>
    </HStack>
  );
};

export default Navbar;
