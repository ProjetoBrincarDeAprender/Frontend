import type { Student, StudentFormData } from "@/types/student";
import api from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { STUDENTS_QUERY_KEY } from "./useStudent";

async function createStudent(data: StudentFormData): Promise<Student> {
  try {
    const response = await api.post("/student/register", data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error("Erro ao criar estudante!");
    }
    throw error;
  }
}

export function useCreateStudent() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (createData: StudentFormData) => createStudent(createData),
    onSuccess: (_, newData) => {
      toast.success("Estudante criado com sucesso!");

      queryClient.setQueryData(STUDENTS_QUERY_KEY, (oldData: Student[]) => {
        return [...oldData, newData];
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
    },
    mutationKey: ["create-student"],
  });

  return { create };
}
