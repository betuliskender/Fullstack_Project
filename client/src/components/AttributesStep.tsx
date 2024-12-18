import React from "react";
import { Box, FormControl, FormLabel, Input, Grid, GridItem } from "@chakra-ui/react";

interface Attributes {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

interface Props {
  attributes: Attributes;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AttributesStep: React.FC<Props> = ({ attributes, onChange }) => {
  return (
    <Box>
      <Grid gap={4}>
        {Object.entries(attributes).map(([key, value]) => (
          <GridItem key={key}>
            <FormControl>
              <FormLabel>{key.charAt(0).toUpperCase() + key.slice(1)}</FormLabel>
              <Input
                type="number"
                name={key}
                value={value}
                onChange={onChange}
                placeholder={`Enter ${key}`}
              />
            </FormControl>
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};

export default AttributesStep;
