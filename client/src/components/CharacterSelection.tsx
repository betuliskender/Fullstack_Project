import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import { Character } from "../utility/types";

interface CharacterSelectionProps {
    availableCharacters: Character[];
    selectedCharacter: string;
    onSelect: (id: string) => void;
  }
  
  const CharacterSelection: React.FC<CharacterSelectionProps> = ({
    availableCharacters,
    selectedCharacter,
    onSelect,
  }) => (
    <FormControl mb={4} isRequired>
      <FormLabel>Select a Character:</FormLabel>
      <Select
        placeholder="Select a character"
        value={selectedCharacter}
        onChange={(e) => onSelect(e.target.value)}
      >
        {availableCharacters.map((character) => (
          <option key={character._id} value={character._id}>
            {character.name}
          </option>
        ))}
      </Select>
    </FormControl>
  );

  export default CharacterSelection;
  