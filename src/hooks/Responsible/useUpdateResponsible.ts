import type { Responsible, ResponsibleFormData } from "@/types/responsible";
import api from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  RESPONSIBLE_QUERY_KEY,
  RESPONSIBLE_STUDENTS_QUERY_KEY,
} from "./useResponsible";

async function updateResponsibleData(
  responsibleId: number | string,
  data: Partial<ResponsibleFormData> & { disabled?: boolean },
): Promise<Responsible> {
  try {
    const response = await api.put(
      `/responsible/update/${responsibleId}`,
      data,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function updateResponsibleRelations(
  responsibleId: number | string,
  studentsIds: number[],
  parentesco: string,
): Promise<void> {
  try {
    const response = await api.put(
      `/responsible/update/${responsibleId}/relation`,
      {
        usersIds: studentsIds,
        parentesco,
      },
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export function useUpdateResponsible() {
  const queryClient = useQueryClient();

  const update = useMutation({
    mutationFn: async ({
      responsibleId,
      data,
    }: {
      responsibleId: number | string;
      data: Partial<ResponsibleFormData> & { disabled?: boolean };
    }) => updateResponsibleData(responsibleId, data),
    onMutate: async (updatedResponsible) => {
      await queryClient.cancelQueries({ queryKey: RESPONSIBLE_QUERY_KEY });

      const previousResponsibles = queryClient.getQueryData<Responsible[]>(
        RESPONSIBLE_QUERY_KEY,
      );

      queryClient.setQueryData(RESPONSIBLE_QUERY_KEY, (old: Responsible[]) => {
        return old.map((responsible) =>
          responsible.codigo_usuario === updatedResponsible.responsibleId
            ? { ...responsible, ...updatedResponsible.data }
            : responsible,
        );
      });

      return { previousResponsibles };
    },
    onError: (_err, _updatedResponsible, context) => {
      if (context?.previousResponsibles) {
        queryClient.setQueryData(
          RESPONSIBLE_QUERY_KEY,
          context.previousResponsibles,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: RESPONSIBLE_QUERY_KEY });
    },
  });

  const updateRelation = useMutation({
    mutationFn: async ({
      parentesco,
      responsibleId,
      studentsIds,
    }: {
      responsibleId: number;
      studentsIds: number[];
      parentesco: string;
    }) => updateResponsibleRelations(responsibleId, studentsIds, parentesco),
    onSuccess: () => {
      toast.success("Relações atualizadas com sucesso!");

      queryClient.invalidateQueries({
        queryKey: RESPONSIBLE_STUDENTS_QUERY_KEY,
      });
    },
    onError(_err, _variables, _onMutateResult, _context) {
      toast.error("Erro ao atualizar relações.");
    },
  });

  return { update, updateRelation };
}
