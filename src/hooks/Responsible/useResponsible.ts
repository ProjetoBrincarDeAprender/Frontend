import type { FilterResponsibleOption } from "@/types/filter";
import type { Responsible } from "@/types/responsible";
import api from "@/utils/api";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";

async function fetchResponsibleData(
  queryClient: QueryClient,
  responsibleId: string | number,
): Promise<Responsible> {
  const responsibles: Responsible[] | undefined =
    await queryClient.getQueryData(RESPONSIBLE_QUERY_KEY);

  if (responsibles) {
    const responsible = responsibles.find(
      (s) => s.codigo_usuario === responsibleId,
    );
    if (responsible) {
      return responsible;
    }
  }

  try {
    const response = await api.get(`/responsible/list/${responsibleId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function fetchResponsiblesData(
  filters?: FilterResponsibleOption,
): Promise<Responsible[]> {
  try {
    const filter =
      "?" + new URLSearchParams(filters as Record<string, string>).toString();

    const response = await api.get(`/responsible/list${filter}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function fetchResponsibleStudents(
  responsibleId: string | number,
): Promise<Responsible[]> {
  try {
    const response = await api.get(
      `/responsible/list/${responsibleId}/students`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const RESPONSIBLE_QUERY_KEY = ["responsible-data"];
export const RESPONSIBLE_STUDENTS_QUERY_KEY = ["responsible-students"];

export function useResponsible({
  responsibleId,
  filters,
}: {
  responsibleId?: string | number;
  filters?: FilterResponsibleOption;
}) {
  const queryClient = useQueryClient();

  const responsibleQuery = useQuery({
    queryKey: [...RESPONSIBLE_QUERY_KEY, responsibleId],
    queryFn: () => fetchResponsibleData(queryClient, responsibleId!),
    enabled: !!responsibleId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const responsiblesQuery = useQuery({
    queryKey: [...RESPONSIBLE_QUERY_KEY, filters],
    queryFn: () => fetchResponsiblesData(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const responsibleStudentsQuery = useQuery({
    queryKey: [...RESPONSIBLE_STUDENTS_QUERY_KEY, responsibleId],
    queryFn: () => fetchResponsibleStudents(responsibleId!),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!responsibleId,
  });

  return { responsibleQuery, responsiblesQuery, responsibleStudentsQuery };
}
