import type { Question, QuestionFormData } from "@/types/question";
import api from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUESTION_QUERY_KEY } from "./useQuestion";

async function createQuestion(
  activityId: number,
  data: QuestionFormData,
): Promise<Question> {
  try {
    const response = await api.post(
      `/activity/${activityId}/question/register`,
      data,
    );
    return response.data;
  } catch (error) {
    console.error("Error creating question:", error);
    throw error;
  }
}

export function useCreateQuestion() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: ({
      activityId,
      data,
    }: {
      activityId: number;
      data: QuestionFormData;
    }) => createQuestion(activityId, data),
    onSuccess: async (newQuestion) => {
      await queryClient.cancelQueries({ queryKey: QUESTION_QUERY_KEY });

      queryClient.setQueriesData(
        { queryKey: QUESTION_QUERY_KEY },
        (oldData: Question[] | undefined) => {
          if (!oldData || !Array.isArray(oldData)) return oldData;

          return [...oldData, newQuestion];
        },
      );

      toast.success("Questão criada com sucesso!");
    },
    onError: (error) => {
      console.error("Error creating question:", error);
      toast.error("Erro ao criar questão!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUESTION_QUERY_KEY });
    },
  });

  return { create };
}
