import { useMutation, useQueryClient } from "react-query";
import { Campaign } from "../utility/types";

export const useDeleteCampaign = (token: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (id: string) => {
      const response = await fetch(`/api/campaigns/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error("Failed to delete campaign");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("campaigns");
      },
    }
  );
};

export const useEditCampaign = (token: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (updatedCampaign: Campaign) => {
      const response = await fetch(`/api/campaigns/${updatedCampaign._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(updatedCampaign),
      });
      if (!response.ok) {
        throw new Error("Failed to edit campaign");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("campaigns");
      },
    }
  );
};