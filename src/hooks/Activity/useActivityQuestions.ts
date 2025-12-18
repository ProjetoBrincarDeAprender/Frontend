import type { FilterQuestionOption } from "@/types/filter";
import type { PaginationMeta } from "@/types/pagination";
import type { Question } from "@/types/question";
import api from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

async function fetchActivityQuestions(
  activityId: number,
  filters?: FilterQuestionOption,
): Promise<{ data: Question[]; meta: PaginationMeta }> {
  try {
    const params = new URLSearchParams(filters as Record<string, string>);
    const response = await api.get(
      `/activity/list/${activityId}/questions?${params.toString()}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching activity questions:", error);
    throw error;
  }
}

export const ACTIVITY_QUESTIONS_QUERY_KEY = ["activity-questions"];

export function useActivityQuestions({
  activityId,
  filters,
}: {
  activityId?: number;
  filters?: FilterQuestionOption;
}) {
  const activityQuestionsQuery = useQuery({
    queryKey: [...ACTIVITY_QUESTIONS_QUERY_KEY, activityId, filters],
    queryFn: () => fetchActivityQuestions(activityId!, filters),
    enabled: !!activityId,
  });

  return { activityQuestionsQuery };
}
