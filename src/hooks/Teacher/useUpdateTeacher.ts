import type { Teacher, TeacherFormData } from "@/types/teacher";
import api from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TEACHER_QUERY_KEY } from "./useTeacher";

async function updateTeacherData(
  teacherId: number | string,
  data: Partial<TeacherFormData> & { disabled?: boolean },
): Promise<Teacher> {
  try {
    const response = await api.put(`/teacher/update/${teacherId}`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function updateTeacherRelations(
  teacherId: number | string,
  studentsIds: number[],
): Promise<void> {
  try {
    const response = await api.put(`/teacher/update/${teacherId}/relation`, {
      usersIds: studentsIds,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export function useUpdateTeacher() {
  const queryClient = useQueryClient();

  const update = useMutation({
    mutationFn: async ({
      teacherId,
      data,
    }: {
      teacherId: number | string;
      data: Partial<TeacherFormData> & { disabled?: boolean };
    }) => updateTeacherData(teacherId, data),
    onMutate: async (updatedTeacher) => {
      await queryClient.cancelQueries({ queryKey: TEACHER_QUERY_KEY });

      const previousTeachers =
        queryClient.getQueryData<Teacher[]>(TEACHER_QUERY_KEY);

      queryClient.setQueryData(TEACHER_QUERY_KEY, (old: Teacher[]) => {
        return old.map((teacher) =>
          teacher.codigo_usuario === updatedTeacher.teacherId
            ? { ...teacher, ...updatedTeacher.data }
            : teacher,
        );
      });

      return { previousTeachers };
    },
    onError: (_err, _updatedTeacher, context) => {
      if (context?.previousTeachers) {
        queryClient.setQueryData(TEACHER_QUERY_KEY, context.previousTeachers);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TEACHER_QUERY_KEY });
    },
  });

  const updateRelation = useMutation({
    mutationFn: async (data: { teacherId: number; studentsIds: number[] }) =>
      updateTeacherRelations(data.teacherId, data.studentsIds),
  });

  return { update, updateRelation };
}
