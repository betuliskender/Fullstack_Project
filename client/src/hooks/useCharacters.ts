import { useQuery } from "@apollo/client";
import { GETALLCHARACTERS } from "../graphql/queries";
import { Character } from "../utility/types";

export const useCharacters = (token: string | null) => {
  const { loading, error, data } = useQuery(GETALLCHARACTERS, {
    context: {
      headers: {
        Authorization: token ? `${token}` : "",
      },
    },
  });

  return {
    characters: (data?.characters || []) as Character[],
    loading,
    error,
  };
};
