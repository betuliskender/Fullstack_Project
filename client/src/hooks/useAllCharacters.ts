import { useQuery } from "@apollo/client";
import { GETALLCHARACTERS } from "../graphql/queries";

export const useCharacters = (token: string | null) => {
  const { loading, data, error } = useQuery(GETALLCHARACTERS, {
    context: {
      headers: {
        Authorization: token ? `${token}` : "",
      },
    },
  });

  return { loading, characters: data?.characters || [], error };
};
