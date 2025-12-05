import type { SchoolAdmin, SchoolAdminFormData } from "@/types/school";
import api from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SCHOOL_ADMIN_QUERY_KEY } from "./useSchoolAdmin";

async function createSchoolAdmin(data: SchoolAdminFormData) {
  try {
    const response = await api.post("/school-admin/register", data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export function useCreateSchoolAdmin() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: ({ ...data }: SchoolAdminFormData) => createSchoolAdmin(data),
    onMutate: async (newSchoolAdmin) => {
      await queryClient.cancelQueries({ queryKey: SCHOOL_ADMIN_QUERY_KEY });

      const previousSchoolAdmins = queryClient.getQueryData<SchoolAdmin[]>(
        SCHOOL_ADMIN_QUERY_KEY,
      );

      queryClient.setQueryData(
        SCHOOL_ADMIN_QUERY_KEY,
        (oldData: SchoolAdmin[]) => [...oldData, newSchoolAdmin],
      );

      return { previousSchoolAdmins };
    },
    onError: (_err, _newSchoolAdmin, context) => {
      if (context?.previousSchoolAdmins) {
        queryClient.setQueryData(
          SCHOOL_ADMIN_QUERY_KEY,
          context.previousSchoolAdmins,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SCHOOL_ADMIN_QUERY_KEY });
    },
  });

  return { create };
}
