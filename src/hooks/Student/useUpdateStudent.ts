import type { Student, StudentFormData } from "@/types/student";
import api from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { STUDENTS_QUERY_KEY } from "./useStudent";

async function updateStudent(
  studentId: string | number,
  data: Partial<StudentFormData & { disabled?: boolean }>,
): Promise<Student> {
  try {
    const response = await api.put(`/student/update/${studentId}`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error("Erro ao atualizar estudante!");
    }
    throw error;
  }
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();

  const update = useMutation({
    mutationFn: ({
      studentId,
      updateData,
    }: {
      studentId: string | number;
      updateData: Partial<StudentFormData & { disabled?: boolean }>;
    }) => updateStudent(studentId, updateData),
    onSuccess: (updatedStudent, { studentId }) => {
      toast.success("Estudante atualizado com sucesso!");

      queryClient.setQueryData(
        STUDENTS_QUERY_KEY,
        (oldData: Student[] | undefined) => {
          if (!oldData) return oldData;
          const newData = oldData.map((student) =>
            student.codigo_usuario === studentId
              ? {
                  ...student,
                  ...updatedStudent,
                }
              : student,
          );
          return newData;
        },
      );
      queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
    },
    mutationKey: ["update-student"],
  });

  return { update };
}
