import type { DifficultyLevel } from "@/types/difficultyLevels";
import type { FilterDifficultyLevelOption } from "@/types/filter";
import type { PaginationMeta } from "@/types/pagination";
import api from "@/utils/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

async function fetchDifficultyLevels(
  filters?: FilterDifficultyLevelOption,
): Promise<{ data: DifficultyLevel[]; meta: PaginationMeta }> {
  const params = new URLSearchParams(
    filters as Record<string, string>,
  ).toString();

  try {
    const response = await api.get(`/difficulty-level/list?${params}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function fetchDifficultyLevel(id: number): Promise<DifficultyLevel> {
  try {
    const response = await api.get(`/difficulty-level/list/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const DIFFICULTY_LEVEL_QUERY_KEY = ["difficultyLevels-data"];

export function useDifficultyLevel({
  id,
  filters,
}: {
  id?: number;
  filters?: FilterDifficultyLevelOption;
} = {}) {
  const difficultyLevelQuery = useQuery({
    queryKey: [...DIFFICULTY_LEVEL_QUERY_KEY, id],
    queryFn: () => fetchDifficultyLevel(id!),
    enabled: !!id,
  });

  const difficultyLevelsQuery = useQuery<{
    data: DifficultyLevel[];
    meta: PaginationMeta;
  }>({
    queryKey: [...DIFFICULTY_LEVEL_QUERY_KEY, filters],
    queryFn: () => fetchDifficultyLevels(filters),
  });

  return { difficultyLevelQuery, difficultyLevelsQuery };
}

export function usePrefetchDifficultyLevels() {
  const queryClient = useQueryClient();

  const prefetchDifficultyLevels = (filters: FilterDifficultyLevelOption) => {
    queryClient.prefetchQuery({
      queryKey: [...DIFFICULTY_LEVEL_QUERY_KEY, filters],
      queryFn: () => fetchDifficultyLevels(filters),
      staleTime: 60 * 1000,
    });
  };

  return { prefetchDifficultyLevels };
}
