import type {
  DifficultyLevel,
  DifficultyLevelFormData,
} from "@/types/difficultyLevels";
import api from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DIFFICULTY_LEVEL_QUERY_KEY } from "./useDifficultyLevel";

async function createDifficultyLevel(
  data: DifficultyLevelFormData,
): Promise<DifficultyLevel> {
  const response = await api.post(`/difficulty-level/register`, data);
  return response.data;
}

export function useCreateDifficultyLevel() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: ({ ...data }: DifficultyLevelFormData) =>
      createDifficultyLevel(data),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: DIFFICULTY_LEVEL_QUERY_KEY });

      const previousQueries = queryClient.getQueriesData<DifficultyLevel[]>({
        queryKey: DIFFICULTY_LEVEL_QUERY_KEY,
      });

      return { previousQueries };
    },
    onError: (_err, _newDifficultyLevel, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: DIFFICULTY_LEVEL_QUERY_KEY });
    },
  });

  return { create };
}
