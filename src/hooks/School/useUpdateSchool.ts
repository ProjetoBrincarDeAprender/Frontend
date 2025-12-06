import type { School, SchoolFormData } from "@/types/school";
import api from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SCHOOL_QUERY_KEY } from "./useSchool";

async function updateSchool(
  schoolId: string | number,
  data: Partial<SchoolFormData>,
) {
  try {
    const response = await api.put(`/school/update/${schoolId}`, data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export function useUpdateSchool() {
  const queryClient = useQueryClient();

  const update = useMutation({
    mutationFn: ({
      schoolId,
      data,
    }: {
      schoolId: number;
      data: Partial<SchoolFormData>;
    }) => updateSchool(schoolId, data),
    onMutate: async ({ schoolId, data }) => {
      await queryClient.cancelQueries({ queryKey: SCHOOL_QUERY_KEY });

      const previousQueries = queryClient.getQueriesData<School[]>({
        queryKey: SCHOOL_QUERY_KEY,
      });

      queryClient.setQueriesData<School[]>(
        { queryKey: SCHOOL_QUERY_KEY },
        (oldData) => {
          if (!oldData || !Array.isArray(oldData)) return oldData;
          return oldData.map((school) =>
            school.id === schoolId
              ? ({ ...school, ...data } as School)
              : school,
          );
        },
      );

      return { previousQueries };
    },
    onError: (_err, _variables, context) => {
      console.log(_err);

      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SCHOOL_QUERY_KEY });
    },
  });

  return { update };
}
