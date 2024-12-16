import { useQuery } from "@apollo/client";
import {
  Box,
  Heading,
  Grid,
  Card,
  CardHeader,
  CardBody,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { GET_ALL_SKILLS } from "../graphql/queries";
import React, { useState } from "react";

interface Skill {
  name: string;
  abilityScore: string;
  desc: string;
}

const Skills: React.FC = () => {
  const { loading, error, data } = useQuery(GET_ALL_SKILLS);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  // Åbn modal med valgt skill
  const handleCardClick = (skill: Skill) => {
    setSelectedSkill(skill);
    onOpen();
  };

  if (loading) return <Spinner size="xl" />;
  if (error)
    return (
      <Alert status="error">
        <AlertIcon />
        Failed to load skills: {error.message}
      </Alert>
    );

  return (
    <Box p={5}>
      <Heading as="h1" size="2xl" mb={5}>
        Skills
      </Heading>
      <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
        {data.skills.map((skill: Skill) => (
          <Card
            key={skill.name}
            boxShadow="md"
            borderRadius="md"
            cursor="pointer"
            onClick={() => handleCardClick(skill)} // Åbn modal ved klik
          >
            <CardHeader>
              <Heading as="h3" size="md">
                {skill.name}
              </Heading>
            </CardHeader>
            <CardBody>
              <Text>
                <strong>Ability Score:</strong> {skill.abilityScore}
              </Text>
              <Text mt={2}>
                {/* Vis kun kort desc */}
                {skill.desc.length > 100
                  ? `${skill.desc.substring(0, 100)}...`
                  : skill.desc}
              </Text>
            </CardBody>
          </Card>
        ))}
      </Grid>

      {/* Modal til at vise fuld description */}
      {selectedSkill && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedSkill.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>
                <strong>Ability Score:</strong> {selectedSkill.abilityScore}
              </Text>
              <Text mt={4}>
                <strong>Description:</strong> {selectedSkill.desc}
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default Skills;
