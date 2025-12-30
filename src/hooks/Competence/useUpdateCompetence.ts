import type { Competence, CompetenceFormData } from "@/types/competence";
import api from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  COMPETENCE_BY_KNOWLEDGE_AREA_QUERY_KEY,
  COMPETENCE_QUERY_KEY,
} from "./useCompetence";

async function updateCompetence(
  competenceId: number,
  data: Partial<CompetenceFormData>,
): Promise<Competence> {
  try {
    const response = await api.put(`/competence/update/${competenceId}`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export function useUpdateCompetence() {
  const queryClient = useQueryClient();

  const update = useMutation({
    mutationFn: ({
      competenceId,
      data,
    }: {
      competenceId: number;
      data: Partial<CompetenceFormData>;
    }) => updateCompetence(competenceId, data),
    onMutate: async (updatedCompetence) => {
      await queryClient.cancelQueries({ queryKey: COMPETENCE_QUERY_KEY });
      await queryClient.cancelQueries({
        queryKey: COMPETENCE_BY_KNOWLEDGE_AREA_QUERY_KEY,
      });

      const previousQueries = queryClient.getQueriesData<Competence[]>({
        queryKey: COMPETENCE_QUERY_KEY,
      });
      const previousKAQueries = queryClient.getQueriesData<Competence[]>({
        queryKey: COMPETENCE_BY_KNOWLEDGE_AREA_QUERY_KEY,
      });

      queryClient.setQueriesData<Competence[]>(
        { queryKey: COMPETENCE_QUERY_KEY },
        (old) => {
          if (!old || !Array.isArray(old)) return old;
          return old.map((competence) =>
            competence.id === updatedCompetence.competenceId
              ? { ...competence, ...updatedCompetence.data }
              : competence,
          );
        },
      );

      queryClient.setQueriesData<Competence[]>(
        { queryKey: COMPETENCE_BY_KNOWLEDGE_AREA_QUERY_KEY },
        (old) => {
          if (!old || !Array.isArray(old)) return old;
          return old.map((competence) =>
            competence.id === updatedCompetence.competenceId
              ? { ...competence, ...updatedCompetence.data }
              : competence,
          );
        },
      );

      return { previousQueries, previousKAQueries };
    },
    onSuccess: (_data, variables) => {
      queryClient.removeQueries({ 
        queryKey: [...COMPETENCE_QUERY_KEY, variables.competenceId] 
      });
      queryClient.invalidateQueries({ queryKey: COMPETENCE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: COMPETENCE_BY_KNOWLEDGE_AREA_QUERY_KEY });
      toast.success("Competência atualizada com sucesso!");
    },
    onError: (_err, _updatedCompetence, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousKAQueries) {
        context.previousKAQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error("Erro ao atualizar competência!");
    },
    onSettled: (_data, _error, variables) => {
      // Invalidate only specific queries to avoid unnecessary refetches
      queryClient.invalidateQueries({
        queryKey: [...COMPETENCE_QUERY_KEY, variables.competenceId],
      });
      queryClient.invalidateQueries({
        queryKey: [...COMPETENCE_QUERY_KEY, undefined],
      });
      queryClient.invalidateQueries({
        queryKey: COMPETENCE_BY_KNOWLEDGE_AREA_QUERY_KEY,
      });
    },
  });

  return { update };
}
