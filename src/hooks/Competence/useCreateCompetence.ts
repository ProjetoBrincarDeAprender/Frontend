import type { Competence, CompetenceFormData } from "@/types/competence";
import api from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  COMPETENCE_BY_KNOWLEDGE_AREA_QUERY_KEY,
  COMPETENCE_QUERY_KEY,
} from "./useCompetence";

async function createCompetence(
  knowledgeAreaId: number,
  data: CompetenceFormData,
): Promise<Competence> {
  try {
    const response = await api.post(
      `/knowledge-area/${knowledgeAreaId}/competence/register`,
      data,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export function useCreateCompetence() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: ({
      knowledgeAreaId,
      data,
    }: {
      knowledgeAreaId: number;
      data: CompetenceFormData;
    }) => createCompetence(knowledgeAreaId, data),
    onSuccess: async (newCompetence) => {
      await queryClient.cancelQueries({ queryKey: COMPETENCE_QUERY_KEY });
      await queryClient.cancelQueries({
        queryKey: COMPETENCE_BY_KNOWLEDGE_AREA_QUERY_KEY,
      });

      queryClient.setQueriesData(
        { queryKey: COMPETENCE_QUERY_KEY },
        (oldData: Competence[] | undefined) => {
          if (!oldData || !Array.isArray(oldData)) return oldData;

          return [...oldData, newCompetence];
        },
      );

      toast.success("Competência criada com sucesso!");
    },
    onError: (error) => {
      console.error("Error creating competence:", error);
      toast.error("Erro ao criar competência!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: COMPETENCE_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: COMPETENCE_BY_KNOWLEDGE_AREA_QUERY_KEY,
      });
    },
  });

  return { create };
}
