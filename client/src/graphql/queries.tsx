import {gql} from '@apollo/client';

export const GETALLCHARACTERS = gql`
  query Characters {
  characters {
    _id
    name
    level
    race
    class
    background
    imageURL
    attributes {
      strength
      dexterity
      constitution
      intelligence
      wisdom
      charisma
    }
  }
}
`;