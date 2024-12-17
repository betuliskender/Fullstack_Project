import React from "react";
import { Grid, Card, CardHeader, CardBody, Heading, Text } from "@chakra-ui/react";
import { APISpell } from "../utility/types";

interface SpellGridProps {
  spells: APISpell[];
  onCardClick: (spell: APISpell) => void;
}

const SpellGrid: React.FC<SpellGridProps> = ({ spells, onCardClick }) => {
  return (
    <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
      {spells.map((spell) => (
        <Card
          key={spell.index}
          boxShadow="md"
          borderRadius="md"
          cursor="pointer"
          onClick={() => onCardClick(spell)}
        >
          <CardHeader>
            <Heading as="h3" size="md">
              {spell.name}
            </Heading>
          </CardHeader>
          <CardBody>
            <Text>
              <strong>Level:</strong> {spell.level}
            </Text>
            <Text>
              <strong>Duration:</strong> {spell.duration}
            </Text>
            <Text mt={2}>
              {spell.desc && spell.desc.length > 0
                ? spell.desc[0].length > 100
                  ? `${spell.desc[0].substring(0, 100)}...`
                  : spell.desc[0]
                : "No description available"}
            </Text>
            
          </CardBody>
        </Card>
      ))}
    </Grid>
  );
};

export default SpellGrid;
