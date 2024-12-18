import React from "react";
import { Box, Heading, Spinner, Grid, Text } from "@chakra-ui/react";

interface Skill {
  _id: string;
  name: string;
  abilityScore: string;
}

interface Props {
  skills: Skill[];
  selectedSkills: Skill[];
  onSkillClick: (skill: Skill) => void;
  loading: boolean;
}

const SkillSelector: React.FC<Props> = ({ skills, selectedSkills, onSkillClick, loading }) => {
  return (
    <Box overflow="auto" height="70vh">
      <Heading size="sm" mb={4}>
        Step 4: Select Skills
      </Heading>
      {loading ? (
        <Box textAlign="center" my={4}>
          <Spinner size="lg" />
          <Text>Loading Skills...</Text>
        </Box>
      ) : skills.length > 0 ? (
        <Grid templateColumns="repeat(auto-fit, minmax(150px, 1fr))" gap={4}>
          {skills.map((skill) => (
            <Box
              key={skill._id}
              border="1px solid"
              borderColor={selectedSkills.some((s) => s._id === skill._id) ? "green.500" : "gray.200"}
              borderRadius="md"
              p={2}
              shadow="sm"
              cursor="pointer"
              onClick={() => onSkillClick(skill)}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Heading as="h3" size="sm" mb={1} textAlign="center">
                {skill.name}
              </Heading>
              <Text fontSize="xs" color="gray.600" textAlign="center">
                {skill.abilityScore}
              </Text>
            </Box>
          ))}
        </Grid>
      ) : (
        <Text>No skills available.</Text>
      )}
    </Box>
  );
};

export default SkillSelector;
