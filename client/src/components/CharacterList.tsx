import React from "react";
import { UnorderedList, ListItem, Flex, Text, HStack, Button } from "@chakra-ui/react";
import { Character } from "../utility/types";

interface CharacterListProps {
  characters: Character[];
  onEdit: (characterId: string) => void;
  onRemove: (characterId: string) => void;
}

const CharacterList: React.FC<CharacterListProps> = ({ characters, onEdit, onRemove }) => (
  <UnorderedList>
    {characters.map((character) => (
      <ListItem key={character._id}>
        <Flex justifyContent="space-between" alignItems="center">
          <Text>{character.name}</Text>
          <HStack>
            <Button size="sm" onClick={() => character._id && onEdit(character._id)}>Edit</Button>
            <Button size="sm" colorScheme="red" onClick={() => character._id && onRemove(character._id)}>Remove</Button>
          </HStack>
        </Flex>
      </ListItem>
    ))}
  </UnorderedList>
);

export default CharacterList;
