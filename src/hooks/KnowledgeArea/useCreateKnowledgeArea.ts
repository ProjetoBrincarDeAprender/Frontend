import type {
  KnowledgeArea,
  KnowledgeAreaFormData,
} from "@/types/knowledgeArea";
import api from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { KNOWLEDGE_AREA_QUERY_KEY } from "./useKnowledgeArea";

async function createKnowledgeArea(
  data: KnowledgeAreaFormData,
): Promise<KnowledgeArea> {
  try {
    const response = await api.post(`/knowledge-area/register`, {
      name: data.nome,
      description: data.description,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export function useCreateKnowledgeArea() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (data: KnowledgeAreaFormData) => createKnowledgeArea(data),
    onSuccess: async (newKnowledgeArea) => {
      await queryClient.cancelQueries({ queryKey: KNOWLEDGE_AREA_QUERY_KEY });

      queryClient.setQueriesData(
        { queryKey: KNOWLEDGE_AREA_QUERY_KEY },
        (oldData: KnowledgeArea[] | undefined) => {
          if (!oldData || !Array.isArray(oldData)) return oldData;

          return [...oldData, newKnowledgeArea];
        },
      );

      toast.success("Área de conhecimento criada com sucesso!");
    },
    onError: (error) => {
      console.error("Error creating knowledge area:", error);
      toast.error("Erro ao criar área de conhecimento!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: KNOWLEDGE_AREA_QUERY_KEY });
    },
  });

  return { create };
}
