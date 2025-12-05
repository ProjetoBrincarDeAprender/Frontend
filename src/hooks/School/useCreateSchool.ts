import type { School, SchoolFormData } from "@/types/school";
import api from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SCHOOL_QUERY_KEY } from "./useSchool";

async function createSchool(data: SchoolFormData): Promise<School> {
  try {
    const response = await api.post("/school/register", data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export function useCreateSchool() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: ({ ...data }: SchoolFormData) => createSchool(data),
    onMutate: async (newSchool) => {
      await queryClient.cancelQueries({ queryKey: SCHOOL_QUERY_KEY });

      const previousSchools =
        queryClient.getQueryData<School[]>(SCHOOL_QUERY_KEY);

      queryClient.setQueryData(
        SCHOOL_QUERY_KEY,
        (oldSchools: School[] | undefined) => [
          ...(oldSchools ?? []),
          newSchool,
        ],
      );

      return { previousSchools };
    },
    onError: (_err, _newSchool, context) => {
      if (context?.previousSchools) {
        queryClient.setQueryData(SCHOOL_QUERY_KEY, context.previousSchools);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SCHOOL_QUERY_KEY });
    },
  });

  return { create };
}
