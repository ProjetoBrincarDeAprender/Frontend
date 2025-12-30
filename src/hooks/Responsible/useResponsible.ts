import type { FilterResponsibleOption } from "@/types/filter";
import type { PaginationMeta } from "@/types/pagination";
import type { Responsible } from "@/types/responsible";
import type { Student } from "@/types/student";
import api from "@/utils/api";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";

async function fetchResponsibleData(
  queryClient: QueryClient,
  responsibleId: string | number,
): Promise<Responsible> {
  const responsiblesResponse = queryClient.getQueryData<{
    data: Responsible[];
    meta: PaginationMeta;
  }>(RESPONSIBLE_QUERY_KEY);

  if (responsiblesResponse?.data) {
    const responsible = responsiblesResponse.data.find(
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
): Promise<{ data: Responsible[]; meta: PaginationMeta }> {
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
): Promise<{ data: Student[]; meta: PaginationMeta }> {
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

  const responsiblesQuery = useQuery<{
    data: Responsible[];
    meta: PaginationMeta;
  }>({
    queryKey: [...RESPONSIBLE_QUERY_KEY, filters],
    queryFn: () => fetchResponsiblesData(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const responsibleStudentsQuery = useQuery<{
    data: Student[];
    meta: PaginationMeta;
  }>({
    queryKey: [...RESPONSIBLE_STUDENTS_QUERY_KEY, responsibleId],
    queryFn: () => fetchResponsibleStudents(responsibleId!),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!responsibleId,
  });

  return { responsibleQuery, responsiblesQuery, responsibleStudentsQuery };
}

export function usePrefetchResponsibles() {
  const queryClient = useQueryClient();

  const prefetchResponsibles = (filters: FilterResponsibleOption) => {
    queryClient.prefetchQuery({
      queryKey: [...RESPONSIBLE_QUERY_KEY, filters],
      queryFn: () => fetchResponsiblesData(filters),
      staleTime: 60 * 1000,
    });
  };

  return { prefetchResponsibles };
}
