import { useQuery } from "@apollo/client";
import { GET_CAMPAIGNS_WITH_CHARACTERS } from "../graphql/queries";
import { Campaign } from "../utility/types";

export const useCampaigns = (token: string) => {
  return useQuery<{ campaigns: Campaign[] }>(GET_CAMPAIGNS_WITH_CHARACTERS, {
    context: { headers: { Authorization: token } },
    fetchPolicy: "network-only",
  });
};
