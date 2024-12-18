import { useQuery } from "@apollo/client";
import { GETALLCHARACTERS } from "../graphql/queries";
import { Character } from "../utility/types";

export const useAllCharacters = (token: string | null) => {
  return useQuery<{ characters: Character[] }>(GETALLCHARACTERS, {
    context: { headers: { Authorization: token } }, 
    fetchPolicy: "network-only",
  });
};
