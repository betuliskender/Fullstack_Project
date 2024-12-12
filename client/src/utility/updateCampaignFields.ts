import { Campaign } from "./types";

export const updateCampaignField = <T>(
    field: keyof Campaign,
    newItem: T,
    setCampaign: React.Dispatch<React.SetStateAction<Campaign | null>>
  ) => {
    setCampaign((prevCampaign) => {
      if (prevCampaign) {
        return {
          ...prevCampaign,
          [field]: [...(prevCampaign[field] as T[]), newItem],
        };
      }
      return prevCampaign;
    });
  };
  