import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_CAMPAIGN_BY_ID } from "../graphql/queries";
import { Campaign } from "../utility/types";

export const useCampaignDetails = (id: string, token: string | null) => {
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  const { loading, error, data, refetch } = useQuery(GET_CAMPAIGN_BY_ID, {
    variables: { id },
    context: { headers: { Authorization: token || "" } },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (data?.campaign) setCampaign(data.campaign);
  }, [data]);

  return { campaign, setCampaign, loading, error, refetch };
};
