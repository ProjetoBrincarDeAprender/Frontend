import type { FilterQuestionOption } from "@/types/filter";
import type { PaginationMeta } from "@/types/pagination";
import type { Question } from "@/types/question";
import api from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

async function fetchQuestions(
  filters?: FilterQuestionOption,
): Promise<{ data: Question[]; meta: PaginationMeta }> {
  try {
    const params = new URLSearchParams(filters as Record<string, string>);

    const response = await api.get(`/question/list?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
}

async function fetchQuestionById(id: number): Promise<Question> {
  try {
    const response = await api.get(`/question/list/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching question by ID:", error);
    throw error;
  }
}

export const QUESTION_QUERY_KEY = ["questions-data"];

export function useQuestion({
  questionId,
  filters,
}: {
  questionId?: number;
  filters?: FilterQuestionOption;
}) {
  const questionQuery = useQuery({
    queryKey: [...QUESTION_QUERY_KEY, questionId],
    queryFn: () => fetchQuestionById(questionId!),
    enabled: !!questionId,
  });

  const questionsQuery = useQuery<{ data: Question[]; meta: PaginationMeta }>({
    queryKey: [...QUESTION_QUERY_KEY, filters],
    queryFn: () => fetchQuestions(filters),
  });

  return { questionQuery, questionsQuery };
}
