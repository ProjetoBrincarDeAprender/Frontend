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
    onMutate: async ({ studentId, updateData }) => {
      await queryClient.cancelQueries({ queryKey: STUDENTS_QUERY_KEY });

      const previousQueries = queryClient.getQueriesData<Student[]>({
        queryKey: STUDENTS_QUERY_KEY,
      });

      queryClient.setQueriesData<Student[]>(
        { queryKey: STUDENTS_QUERY_KEY },
        (old) => {
          if (!old || !Array.isArray(old)) return old;
          return old.map((student) =>
            student.codigo_usuario === studentId
              ? ({ ...student, ...updateData } as Student)
              : student,
          );
        },
      );

      return { previousQueries };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
    },
    mutationKey: ["update-student"],
  });

  return { update };
}
