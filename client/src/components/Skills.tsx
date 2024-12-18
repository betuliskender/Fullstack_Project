import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import {
  Box,
  Heading,
  Grid,
  Spinner,
  Alert,
  AlertIcon,
  useDisclosure,
} from "@chakra-ui/react";
import { GET_ALL_SKILLS } from "../graphql/queries";
import DetailsModal from "./DetailsModal";
import { Skill } from "../utility/types";
import InfoCard from "./InfoCard";

const Skills: React.FC = () => {
  const { loading, error, data } = useQuery(GET_ALL_SKILLS);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

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
            <InfoCard
              key={skill.name}
              title={skill.name}
              details={{ "Ability Score": skill.abilityScore }}
              description={skill.desc}
              onClick={() => handleCardClick(skill)} // Åbn modal ved klik
            />
          ))}
        </Grid>
  
        {/* Genbruger DetailsModal */}
        <DetailsModal isOpen={isOpen} onClose={onClose} item={selectedSkill} />
      </Box>
    );
  };
export default Skills;
