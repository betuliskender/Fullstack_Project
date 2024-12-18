import React from "react";
import { Box, Heading, Spinner, Grid } from "@chakra-ui/react";

interface Spell {
  index: string;
  name: string;
  desc: string[];
}

interface Props {
  spells: Spell[];
  selectedSpells: { name: string; description: string }[];
  onSpellSelect: (spell: Spell) => void;
  loading: boolean;
}

const SpellSelector: React.FC<Props> = ({ spells, selectedSpells, onSpellSelect, loading }) => {
  return (
    <Box overflow="auto" height="70vh">
      <Heading size="sm" mb={4}>
        Step 3: Select Spells
      </Heading>
      {loading ? (
        <Box textAlign="center" my={4}>
          <Spinner size="lg" />
          <Heading as="h3" size="sm">
            Loading Class Spells...
          </Heading>
        </Box>
      ) : spells.length > 0 ? (
        <Grid templateColumns="repeat(auto-fit, minmax(150px, 1fr))" gap={4}>
          {spells.map((spell) => (
            <Box
              key={spell.index}
              border="1px solid"
              borderColor={selectedSpells.some((s) => s.name === spell.name) ? "green.500" : "gray.200"}
              borderRadius="md"
              p={2} // Reduced padding
              shadow="sm" // Reduced shadow for compact look
              cursor="pointer"
              onClick={() => onSpellSelect(spell)}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Heading as="h3" size="sm" mb={1} textAlign="center">
                {spell.name}
              </Heading>
            </Box>
          ))}
        </Grid>
      ) : (
        <Heading as="h3" size="sm" textAlign="center">
          No spells available for this class.
        </Heading>
      )}
    </Box>
  );
};

export default SpellSelector;
