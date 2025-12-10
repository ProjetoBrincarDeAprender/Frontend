import type { Question, QuestionFormData } from "@/types/question";
import api from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUESTION_QUERY_KEY } from "./useQuestion";

async function updateQuestion(
  questionId: number,
  data: Partial<QuestionFormData>,
): Promise<Question> {
  try {
    const response = await api.put(`/question/update/${questionId}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating question:", error);
    throw error;
  }
}

export function useUpdateQuestion() {
  const queryClient = useQueryClient();

  const update = useMutation({
    mutationFn: ({
      questionId,
      data,
    }: {
      questionId: number;
      data: Partial<QuestionFormData>;
    }) => updateQuestion(questionId, data),
    onMutate: async (updatedQuestion) => {
      await queryClient.cancelQueries({ queryKey: QUESTION_QUERY_KEY });

      const previousQueries = queryClient.getQueriesData<Question[]>({
        queryKey: QUESTION_QUERY_KEY,
      });

      queryClient.setQueriesData<Question[]>(
        { queryKey: QUESTION_QUERY_KEY },
        (old) => {
          if (!old || !Array.isArray(old)) return old;
          return old.map((question) =>
            question.id === updatedQuestion.questionId
              ? { ...question, ...updatedQuestion.data }
              : question,
          );
        },
      );

      return { previousQueries };
    },
    onSuccess: () => {
      toast.success("Questão atualizada com sucesso!");
    },
    onError: (_err, _updatedQuestion, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error("Erro ao atualizar questão!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUESTION_QUERY_KEY });
    },
  });

  return { update };
}
