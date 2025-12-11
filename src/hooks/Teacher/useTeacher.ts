import type { FilterStudentOption, FilterTeacherOption } from "@/types/filter";
import type { Student } from "@/types/student";
import type { Teacher } from "@/types/teacher";
import api from "@/utils/api";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";

async function fetchTeacherData(
  queryClient: QueryClient,
  teacherId: string | number,
): Promise<Teacher> {
  const teachers: Teacher[] | undefined =
    await queryClient.getQueryData(TEACHER_QUERY_KEY);

  if (teachers) {
    const teacher = teachers.find((s) => s.codigo_usuario === teacherId);
    if (teacher) {
      return teacher;
    }
  }

  try {
    const response = await api.get(`/teacher/list/${teacherId}`);

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function fetchTeachersData(
  filters?: FilterTeacherOption,
): Promise<Teacher[]> {
  try {
    const filter =
      "?" + new URLSearchParams(filters as Record<string, string>).toString();

    const response = await api.get(`/teacher/list${filter}`);

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function fetchTeacherRelations(
  teacherId: string | number,
  filters: FilterStudentOption,
): Promise<Student[]> {
  try {
    const params = new URLSearchParams(
      filters as Record<string, string>,
    ).toString();

    const response = await api.get(
      `/teacher/list/${teacherId}/students?${params}`,
    );
    return response.data as Student[];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const TEACHER_QUERY_KEY = ["teachers-data"];

export const TEACHER_RELATIONS_QUERY_KEY = ["teacher-students"];

export function useTeacher({
  teacherId,
  filters,
}: {
  teacherId?: string | number;
  filters?: FilterTeacherOption;
} = {}) {
  const queryClient = useQueryClient();

  const teacherQuery = useQuery<Teacher>({
    queryKey: [...TEACHER_QUERY_KEY, teacherId],
    queryFn: () => fetchTeacherData(queryClient, teacherId!),
    enabled: !!teacherId,
  });

  const teachersQuery = useQuery<Teacher[]>({
    queryKey: [...TEACHER_QUERY_KEY, filters],
    queryFn: () => fetchTeachersData(filters),
  });

  return { teacherQuery, teachersQuery };
}

export function useTeacherRelations({
  teacherId,
  filters,
}: {
  teacherId: string | number;
  filters: FilterStudentOption;
}) {
  const teacherRelationsQuery = useQuery<Student[]>({
    queryKey: [...TEACHER_RELATIONS_QUERY_KEY, teacherId, filters],
    queryFn: () => fetchTeacherRelations(teacherId!, filters || {}),
  });

  return { teacherRelationsQuery };
}
