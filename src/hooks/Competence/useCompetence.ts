import type { Competence } from "@/types/competence";
import type { FilterCompetenceOption } from "@/types/filter";
import api from "@/utils/api";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

async function fetchCompetenceData(
  queryClient: QueryClient,
  competenceId: number,
): Promise<Competence> {
  const competences: Competence[] | undefined = await queryClient.getQueryData([
    COMPETENCE_QUERY_KEY,
  ]);

  if (competences) {
    const competence = competences.find((c) => c.id === competenceId);
    if (competence) {
      return competence;
    }
  }

  try {
    const response = await api.get(`/competence/list/${competenceId}`);
    return {
      id: response.data.id,
      nome: response.data.nome,
      descricao: response.data.descricao,
      areaId: response.data.area_id,
      preRequisitos: response.data.pre_requisito_id,
      createdAt: response.data.created_At,
    };
  } catch (error) {
    console.log(error);
    toast.error("Erro ao buscar competência!");
    throw error;
  }
}

async function fetchCompetences(
  filters?: FilterCompetenceOption,
): Promise<Competence[]> {
  try {
    const params = new URLSearchParams(
      filters as Record<string, string>,
    ).toString();
    const response = await api.get(`/competence/list?${params}`);
    return response.data.map((item: any) => ({
      id: item.id,
      nome: item.nome,
      descricao: item.descricao,
      areaId: item.area_id,
      preRequisitos: item.pre_requisito_id,
      createdAt: item.created_At,
    }));
  } catch (error) {
    console.log(error);
    toast.error("Erro ao buscar competências!");
    throw error;
  }
}

async function fetchCompetencesByKnowledgeArea(
  knowledgeAreaId: number,
  filters?: FilterCompetenceOption,
): Promise<Competence[]> {
  try {
    const params = new URLSearchParams(
      filters as Record<string, string>,
    ).toString();

    const response = await api.get(
      `/knowledge-area/list/${knowledgeAreaId}/competences?${params}`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    toast.error("Erro ao buscar competências da área de conhecimento!");
    throw error;
  }
}

export const COMPETENCE_QUERY_KEY = ["competence-data"];
export const COMPETENCE_BY_KNOWLEDGE_AREA_QUERY_KEY = [
  "competence-by-knowledge-area",
];

export function useCompetence({
  competenceId,
  knowledgeAreaId,
  filters,
}: {
  competenceId?: number;
  knowledgeAreaId?: number;
  filters?: FilterCompetenceOption;
} = {}) {
  const queryClient = useQueryClient();

  const competenceQuery = useQuery({
    queryKey: [...COMPETENCE_QUERY_KEY, competenceId],
    queryFn: () => fetchCompetenceData(queryClient, competenceId!),
    enabled: !!competenceId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const competencesQuery = useQuery({
    queryKey: [...COMPETENCE_QUERY_KEY, filters],
    queryFn: () => fetchCompetences(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const competencesByKnowledgeAreaQuery = useQuery({
    queryKey: [
      ...COMPETENCE_BY_KNOWLEDGE_AREA_QUERY_KEY,
      knowledgeAreaId,
      filters,
    ],
    queryFn: () => fetchCompetencesByKnowledgeArea(knowledgeAreaId!, filters),
    enabled: !!knowledgeAreaId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return { competenceQuery, competencesQuery, competencesByKnowledgeAreaQuery };
}
