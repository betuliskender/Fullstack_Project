import React from "react";
import { FormControl, FormLabel, Input, Select } from "@chakra-ui/react";

interface Props {
  character: { name: string; level: number; race: { name: string }; class: { name: string }; background: string; imageURL: string };
  races: { index: string; name: string }[];
  classes: { index: string; name: string }[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const CharacterDetailsStep: React.FC<Props> = ({ character, races, classes, onChange }) => (
  <>
    <FormControl>
      <FormLabel>Name</FormLabel>
      <Input placeholder="Name" name="name" value={character.name} onChange={onChange} mb={3}/>
    </FormControl>
    <FormControl>
      <FormLabel>Level</FormLabel>
      <Input type="number" name="level" value={character.level} onChange={onChange} mb={3}/>
    </FormControl>
    <FormControl>
      <FormLabel>Race</FormLabel>
      <Select placeholder={character.race.name} name="race" value={character.race.name} onChange={onChange} mb={3}>
        {races.map((race) => (
          <option key={race.index} value={race.index}>
            {race.name}
          </option>
        ))}
      </Select>
    </FormControl>
    <FormControl>
      <FormLabel>Class</FormLabel>
      <Select placeholder={character.class.name} name="class" value={character.class.name} onChange={onChange} mb={3}>
        {classes.map((cls) => (
          <option key={cls.index} value={cls.index}>
            {cls.name}
          </option>
        ))}
      </Select>
    </FormControl>
    <FormControl>
        <FormLabel>Background</FormLabel>
        <Input placeholder="Background" name="background" value={character.background} onChange={onChange} mb={3} />
        </FormControl>
        <FormControl>
        <FormLabel>Image URL</FormLabel>
        <Input placeholder="Image URL" name="imageURL" value={character.imageURL} onChange={onChange} mb={3} />
    </FormControl>
  </>
);

export default CharacterDetailsStep;
