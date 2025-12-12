import type { Activity, ActivityFormData } from "@/types/activity";
import api from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ACTIVITY_QUERY_KEY } from "./useActivity";

async function createActivity(data: ActivityFormData) {
  try {
    const response = await api.post("/activity/register", data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export function useCreateActivity() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (data: ActivityFormData) => createActivity(data),
    onSuccess: async (_, newActivity) => {
      await queryClient.cancelQueries({ queryKey: ACTIVITY_QUERY_KEY });

      queryClient.setQueriesData(
        { queryKey: ACTIVITY_QUERY_KEY },
        (oldData: Activity[] | undefined) => {
          if (!oldData || !Array.isArray(oldData)) return;

          return [...oldData, newActivity];
        },
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITY_QUERY_KEY });
    },
  });

  return { create };
}
