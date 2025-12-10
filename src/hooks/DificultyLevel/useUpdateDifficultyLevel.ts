import type {
  DifficultyLevel,
  DifficultyLevelFormData,
} from "@/types/difficultyLevels";
import api from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DIFFICULTY_LEVEL_QUERY_KEY } from "./useDifficultyLevel";

async function updateDifficultyLevel(
  difficultyLevelId: number,
  data: Partial<DifficultyLevelFormData>,
): Promise<DifficultyLevel> {
  try {
    const response = await api.put(
      `/difficulty-level/update/${difficultyLevelId}`,
      data,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export function useUpdateDifficultyLevel() {
  const queryClient = useQueryClient();

  const update = useMutation({
    mutationFn: ({
      difficultyLevelId,
      data,
    }: {
      difficultyLevelId: number;
      data: Partial<DifficultyLevelFormData>;
    }) => updateDifficultyLevel(difficultyLevelId, data),
    onMutate: async ({ difficultyLevelId, data }) => {
      await queryClient.cancelQueries({ queryKey: DIFFICULTY_LEVEL_QUERY_KEY });

      const previousQueries = queryClient.getQueriesData<DifficultyLevel[]>({
        queryKey: DIFFICULTY_LEVEL_QUERY_KEY,
      });

      queryClient.setQueriesData<DifficultyLevel[]>(
        { queryKey: DIFFICULTY_LEVEL_QUERY_KEY },
        (oldData) => {
          if (!oldData || !Array.isArray(oldData)) return oldData;
          return oldData.map((difficultyLevel) =>
            difficultyLevel.id === difficultyLevelId
              ? ({ ...difficultyLevel, ...data } as DifficultyLevel)
              : difficultyLevel,
          );
        },
      );

      return { previousQueries };
    },
    onError: (_err, _variables, context) => {
      console.log(_err);

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

  return { update };
}
