import type { Activity, ActivityFormData } from "@/types/activity";
import api from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ACTIVITY_QUERY_KEY } from "./useActivity";

async function updateActivity(
  activityId: number,
  data: Partial<ActivityFormData>,
): Promise<Activity> {
  try {
    const response = await api.put(`/activity/update/${activityId}`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export function useUpdateActivity() {
  const queryClient = useQueryClient();

  const update = useMutation({
    mutationFn: ({
      activityId,
      data,
    }: {
      activityId: number;
      data: Partial<ActivityFormData>;
    }) => updateActivity(activityId, data),
    onMutate: async ({ activityId, data: newData }) => {
      await queryClient.cancelQueries({ queryKey: ACTIVITY_QUERY_KEY });

      const previousActivity = queryClient.getQueriesData({
        queryKey: ACTIVITY_QUERY_KEY,
      });

      queryClient.setQueriesData(
        { queryKey: ACTIVITY_QUERY_KEY },
        (oldData: Activity[] | undefined) => {
          if (!oldData || !Array.isArray(oldData)) return oldData;
          return oldData.map((activity) =>
            activity.id === activityId ? { ...activity, ...newData } : activity,
          );
        },
      );

      return { previousActivity };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousActivity) {
        context.previousActivity.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITY_QUERY_KEY });
    },
  });

  return { update };
}
