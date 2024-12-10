import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Cloud } from "@react-three/drei";
import { Box, useColorMode } from "@chakra-ui/react";
//import D20 from "./D20";

const FrontPage: React.FC = () => {
  const { colorMode } = useColorMode();

  const textColor = colorMode === "dark" ? "white" : "#2D3748";

  return (
    <Box position="relative" h="100vh" w="100vw" overflow="hidden">
      {/* Three.js Canvas */}
      <Canvas
        camera={{ position: [0, 2, 5] }}
        style={{ position: "absolute", top: 0, left: 0 , height: "100vh", width: "100vw" }}
      >
        {colorMode === "dark" ? (
          <Stars fade saturation={1} />
        ) : (
          <>
            <Cloud position={[0, 2, -5]} speed={0.2} opacity={0.5} />
            <Cloud position={[-5, 1, -5]} speed={0.3} opacity={0.4} />
            <Cloud position={[5, 1, -5]} speed={0.25} opacity={0.4} />
          </>
        )}
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        {/* <D20 /> */}
        <OrbitControls enableZoom={false} />
      </Canvas>

      {/* Text Overlay */}
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        color={textColor}
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
    </Box>
  );
};

export default FrontPage;
