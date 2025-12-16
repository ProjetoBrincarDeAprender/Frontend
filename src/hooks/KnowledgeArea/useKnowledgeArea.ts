import type { FilterKnowledgeAreaOption } from "@/types/filter";
import type { KnowledgeArea } from "@/types/knowledgeArea";
import type { PaginationMeta } from "@/types/pagination";
import api from "@/utils/api";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

async function fetchKnowledgeAreaData(
  queryClient: QueryClient,
  knowledgeAreaId: number,
): Promise<KnowledgeArea> {
  const knowledgeAreasResponse = queryClient.getQueryData<{
    data: KnowledgeArea[];
    meta: PaginationMeta;
  }>([KNOWLEDGE_AREA_QUERY_KEY]);

  if (knowledgeAreasResponse?.data) {
    const knowledgeArea = knowledgeAreasResponse.data.find(
      (ka) => ka.id === knowledgeAreaId,
    );
    if (knowledgeArea) {
      return knowledgeArea;
    }
  }

  try {
    const response = await api.get(`/knowledge-area/list/${knowledgeAreaId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    toast.error("Erro ao buscar área de conhecimento!");
    throw error;
  }
}

async function fetchKnowledgeAreas(
  filters?: FilterKnowledgeAreaOption,
): Promise<{ data: KnowledgeArea[]; meta: PaginationMeta }> {
  try {
    const params = new URLSearchParams(
      filters as Record<string, string>,
    ).toString();

    const response = await api.get(`/knowledge-area/list?${params}`);
    return response.data;
  } catch (error) {
    console.log(error);
    toast.error("Erro ao buscar áreas de conhecimento!");
    throw error;
  }
}

export const KNOWLEDGE_AREA_QUERY_KEY = ["knowledge-area-data"];

export function useKnowledgeArea({
  knowledgeAreaId,
  filters,
}: {
  knowledgeAreaId?: number;
  filters?: FilterKnowledgeAreaOption;
} = {}) {
  const queryClient = useQueryClient();

  const knowledgeAreaQuery = useQuery({
    queryKey: [...KNOWLEDGE_AREA_QUERY_KEY, knowledgeAreaId],
    queryFn: () => fetchKnowledgeAreaData(queryClient, knowledgeAreaId!),
    enabled: !!knowledgeAreaId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const knowledgeAreasQuery = useQuery<{
    data: KnowledgeArea[];
    meta: PaginationMeta;
  }>({
    queryKey: [...KNOWLEDGE_AREA_QUERY_KEY, filters],
    queryFn: () => fetchKnowledgeAreas(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return { knowledgeAreaQuery, knowledgeAreasQuery };
}
