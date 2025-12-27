import type { FilterStudentOption } from "@/types/filter";
import type { PaginationMeta } from "@/types/pagination";
import type { Student } from "@/types/student";
import api from "@/utils/api";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

async function fetchStudentData(
  queryClient: QueryClient,
  studentId: string | number,
): Promise<Student> {
  const queriesData = queryClient.getQueriesData<{ data: Student[]; meta: PaginationMeta }>({
    queryKey: STUDENTS_QUERY_KEY,
  });

  for (const [, data] of queriesData) {
    if (data?.data) {
      const student = data.data.find(
        (s) => String(s.codigo_usuario) === String(studentId)
      );
      if (student) {
        return student;
      }
    }
  }

  try {
    const response = await api.get(`/student/list/${studentId}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error("Erro ao buscar dados do estudante!");
    }
    throw error;
  }
}

async function fetchStudentsData(
  filters?: FilterStudentOption,
): Promise<{ data: Student[]; meta: PaginationMeta }> {
  try {
    const filter =
      "?" + new URLSearchParams(filters as Record<string, string>).toString();

    const response = await api.get(`/student/list${filter}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error("Erro ao buscar dados dos estudantes!");
    }
    throw error;
  }
}

async function fetchStudentsByRelation(
  type: string,
  filter?: FilterStudentOption,
): Promise<{ data: Student[]; meta: PaginationMeta }> {
  try {
    const params = new URLSearchParams(
      filter as Record<string, string>,
    ).toString();

    const response = await api.get(`/student/list/relations/${type}?${params}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error("Erro ao buscar dados dos estudantes por relação!");
    }
    throw error;
  }
}

export const STUDENTS_QUERY_KEY = ["students-data"];

export function useStudent({
  studentId,
  filters,
}: {
  studentId?: string | number;
  filters?: FilterStudentOption;
} = {}) {
  const queryClient = useQueryClient();

  const studentQuery = useQuery({
    queryKey: STUDENTS_QUERY_KEY.concat(studentId ? [String(studentId)] : []),
    queryFn: () => fetchStudentData(queryClient, studentId!),
    enabled: !!studentId,
  });

  const studentsQuery = useQuery<{ data: Student[]; meta: PaginationMeta }>({
    queryKey: [...STUDENTS_QUERY_KEY, filters],
    queryFn: () => fetchStudentsData(filters),
  });

  return { studentQuery, studentsQuery };
}

export function useStudentsRelations(
  type: string,
  filters?: FilterStudentOption,
) {
  const studentsByRelationQuery = useQuery<{
    data: Student[];
    meta: PaginationMeta;
  }>({
    queryKey: [...STUDENTS_QUERY_KEY, "relations", type, filters],
    queryFn: () => fetchStudentsByRelation(type, filters),
    enabled: !!filters?.escolaId,
  });

  return { studentsByRelationQuery };
}
