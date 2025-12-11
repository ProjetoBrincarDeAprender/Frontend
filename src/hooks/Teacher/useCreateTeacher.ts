import type { TeacherFormData } from "@/types/teacher";
import api from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TEACHER_QUERY_KEY } from "./useTeacher";

async function createTeacher(data: TeacherFormData): Promise<void> {
  try {
    const response = await api.post("/teacher/register", data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function createTeacherRelations(data: {
  teacherId: number;
  studentsIds: number[];
}): Promise<void> {
  try {
    const response = await api.post("/teacher/register/relation", data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export function useCreateTeacher() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: async (data: TeacherFormData) => createTeacher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEACHER_QUERY_KEY });
    },
  });

  const createRelations = useMutation({
    mutationFn: async (data: { teacherId: number; studentsIds: number[] }) =>
      createTeacherRelations(data),
  });

  return { create, createRelations };
}
