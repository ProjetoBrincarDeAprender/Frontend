import type { Activity } from "@/types/activity";
import type { FilterActivityOption } from "@/types/filter";
import api from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

async function fetchActivities(
  filters?: FilterActivityOption,
): Promise<Activity[]> {
  try {
    const queryParams = new URLSearchParams(
      filters as Record<string, string>,
    ).toString();

    const response = await api.get(`/activity/list?${queryParams}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function fetchActivity(activityId: number): Promise<Activity> {
  try {
    const response = await api.get(`/activity/list/${activityId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function fetchActivityByWhoMade(
  userId: number,
  filters?: FilterActivityOption,
) {
  try {
    const queryParams = new URLSearchParams(
      filters as Record<string, string>,
    ).toString();

    const response = await api.get(
      `/activity/list/user/${userId}?${queryParams}`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const ACTIVITY_QUERY_KEY = ["activities-data"];

export default function useActivity({
  activityId,
  filters,
  userId,
}: {
  activityId?: number;
  filters?: FilterActivityOption;
  userId?: number;
} = {}) {
  const activityQuery = useQuery({
    queryKey: [...ACTIVITY_QUERY_KEY, activityId],
    queryFn: () => fetchActivity(activityId!),
    enabled: !!activityId,
  });

  const activitiesQuery = useQuery({
    queryKey: [...ACTIVITY_QUERY_KEY, filters],
    queryFn: () => fetchActivities(filters),
  });

  const activitiesByWhoMadeQuery = useQuery({
    queryKey: [...ACTIVITY_QUERY_KEY, userId, filters],
    queryFn: () => fetchActivityByWhoMade(userId!, filters),
    enabled: !!userId,
  });

  return {
    activityQuery,
    activitiesQuery,
    activitiesByWhoMadeQuery,
  };
}
