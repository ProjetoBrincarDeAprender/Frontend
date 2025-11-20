import api from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import type { User } from "./../types/user";

async function deleteStudent(
  id: string | number,
  route: string,
  entity: string,
): Promise<void> {
  try {
    await api.delete(`${route}/${id}`);
    toast.success(`${entity} deletado com sucesso!`);
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(`Erro ao deletar ${entity}!`);
    }
    throw error;
  }
}

export function useDelete({
  route,
  entity,
  queryKey,
}: {
  route: string;
  entity: string;
  queryKey: string[];
}) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => deleteStudent(id, route, entity),
    onSuccess: (_, id) => {
      queryClient.setQueryData(queryKey, (data: unknown[]) => {
        if (
          Array.isArray(data) &&
          data.length > 0 &&
          typeof data[0] === "object" &&
          data[0] !== null &&
          "codigo_usuario" in data[0]
        ) {
          return (data as User[]).filter(
            (user: User) => String(user.codigo_usuario) !== String(id),
          );
        }

        return data.filter(
          (item: unknown) => (item as { id: string | number }).id !== id,
        );
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const multiDeleteMutation = useMutation({
    mutationFn: (ids: (string | number)[]) =>
      Promise.all(
        ids.map((singleId) => deleteStudent(singleId, route, entity)),
      ),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(queryKey, (data: unknown[]) => {
        if (
          Array.isArray(data) &&
          data.length > 0 &&
          typeof data[0] === "object" &&
          data[0] !== null &&
          "codigo_usuario" in data[0]
        ) {
          return (data as User[]).filter(
            (user: User) => !variables.includes(user.codigo_usuario),
          );
        }

        return data.filter(
          (item: unknown) =>
            !variables.includes((item as { id: string | number }).id),
        );
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return { deleteMutation, multiDeleteMutation };
}
