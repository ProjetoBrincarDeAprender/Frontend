import type { Responsible, ResponsibleFormData } from "@/types/responsible";
import api from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  RESPONSIBLE_QUERY_KEY,
  RESPONSIBLE_STUDENTS_QUERY_KEY,
} from "./useResponsible";

async function createResponsible(
  data: ResponsibleFormData,
): Promise<Responsible> {
  try {
    const response = await api.post("/responsible/register", data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function createResponsibleRelations({
  parentesco,
  studentsIds,
  responsibleId,
}: {
  responsibleId: number;
  studentsIds: number[];
  parentesco: string;
}): Promise<string> {
  try {
    const response = await api.post("/responsible/register/relation", {
      parentesco,
      userId: responsibleId,
      educandosIds: studentsIds,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export function useCreateResponsible() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: async (data: ResponsibleFormData) => createResponsible(data),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: RESPONSIBLE_QUERY_KEY });

      const previousQueries = queryClient.getQueriesData<Responsible[]>({
        queryKey: RESPONSIBLE_QUERY_KEY,
      });

      return { previousQueries };
    },
    onError: (_err, _newResponsible, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: RESPONSIBLE_QUERY_KEY });
    },
  });

  const createRelations = useMutation({
    mutationFn: async (data: {
      responsibleId: number;
      studentsIds: number[];
      parentesco: string;
    }) => createResponsibleRelations(data),
    onSuccess: async () => {
      toast.success("Relações criadas com sucesso!");
      queryClient.invalidateQueries({
        queryKey: RESPONSIBLE_STUDENTS_QUERY_KEY,
      });
    },
    onError: () => {
      toast.error("Erro ao criar relações.");
    },
  });

  return { create, createRelations };
}
