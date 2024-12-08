import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Box } from "@chakra-ui/react";
import D20 from "./D20";

const FrontPage: React.FC = () => {
  return (
    <Box position="relative" h="100vh" w="100vw" overflow="hidden">
      {/* Three.js Canvas */}
      <Canvas
        camera={{ position: [0, 2, 5] }}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <Stars />
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <D20 />
        <OrbitControls enableZoom={false} />
      </Canvas>

      {/* Text Overlay */}
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        color="white"
        textAlign="center"
        zIndex="10"
        pointerEvents="none"
      >
        <h1
          style={{
            fontSize: "4rem",
            marginBottom: "1rem",
            lineHeight: "1.2",
            fontFamily: "QuillFont, serif",
          }}
        >
          <span>Welcome</span>
          <br />
          <span>to</span>
          <br />
          <span>Quill and Dice</span>
        </h1>
        <p style={{ fontSize: "1.5rem", fontFamily: "QuillFont, serif" }}>
          Your adventure starts here...
        </p>
      </Box>

      {/* Buttons */}
      <Box
        position="absolute"
        top="20px"
        right="20px"
        zIndex="11"
        display="flex"
        gap="10px"
      ></Box>
    </Box>
  );
};

export default FrontPage;
