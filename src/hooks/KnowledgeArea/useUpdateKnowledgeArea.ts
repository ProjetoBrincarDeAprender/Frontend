import type {
  KnowledgeArea,
  KnowledgeAreaFormData,
} from "@/types/knowledgeArea";
import api from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { KNOWLEDGE_AREA_QUERY_KEY } from "./useKnowledgeArea";

async function updateKnowledgeArea(
  knowledgeAreaId: number,
  data: Partial<KnowledgeAreaFormData>,
): Promise<KnowledgeArea> {
  try {
    const response = await api.put(
      `/knowledge-area/update/${knowledgeAreaId}`,
      data,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export function useUpdateKnowledgeArea() {
  const queryClient = useQueryClient();

  const update = useMutation({
    mutationFn: ({
      knowledgeAreaId,
      data,
    }: {
      knowledgeAreaId: number;
      data: Partial<KnowledgeAreaFormData>;
    }) => updateKnowledgeArea(knowledgeAreaId, data),
    onMutate: async (updatedKnowledgeArea) => {
      await queryClient.cancelQueries({ queryKey: KNOWLEDGE_AREA_QUERY_KEY });

      const previousQueries = queryClient.getQueriesData<KnowledgeArea[]>({
        queryKey: KNOWLEDGE_AREA_QUERY_KEY,
      });

      queryClient.setQueriesData<KnowledgeArea[]>(
        { queryKey: KNOWLEDGE_AREA_QUERY_KEY },
        (old) => {
          if (!old || !Array.isArray(old)) return old;
          return old.map((knowledgeArea) =>
            knowledgeArea.id === updatedKnowledgeArea.knowledgeAreaId
              ? { ...knowledgeArea, ...updatedKnowledgeArea.data }
              : knowledgeArea,
          );
        },
      );

      return { previousQueries };
    },
    onSuccess: () => {
      toast.success("Área de conhecimento atualizada com sucesso!");
    },
    onError: (_err, _updatedKnowledgeArea, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error("Erro ao atualizar área de conhecimento!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: KNOWLEDGE_AREA_QUERY_KEY });
    },
  });

  return { update };
}
