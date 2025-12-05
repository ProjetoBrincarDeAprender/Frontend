import type { SchoolAdmin } from "@/types/school";
import api from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SCHOOL_ADMIN_QUERY_KEY } from "./useSchoolAdmin";

async function updateSchoolAdmin(
  schoolAdminId: number | string,
  updateData: Partial<SchoolAdmin>,
) {
  try {
    const response = await api.put(
      `/school-admin/update/${schoolAdminId}`,
      updateData,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export function useUpdateSchoolAdmin() {
  const queryClient = useQueryClient();

  const update = useMutation({
    mutationFn: ({
      schoolAdminId,
      updateData,
    }: {
      schoolAdminId: number | string;
      updateData: Partial<SchoolAdmin>;
    }) => updateSchoolAdmin(schoolAdminId, updateData),
    onMutate: async ({ schoolAdminId, updateData }) => {
      await queryClient.cancelQueries({ queryKey: SCHOOL_ADMIN_QUERY_KEY });

      const previousData = queryClient.getQueryData<SchoolAdmin[]>(
        SCHOOL_ADMIN_QUERY_KEY,
      );

      queryClient.setQueryData<SchoolAdmin[] | undefined>(
        SCHOOL_ADMIN_QUERY_KEY,
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.map((admin) =>
            admin.codigo_usuario === schoolAdminId
              ? { ...admin, ...updateData }
              : admin,
          );
        },
      );

      return { previousData };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData<SchoolAdmin[]>(
          SCHOOL_ADMIN_QUERY_KEY,
          context.previousData,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SCHOOL_ADMIN_QUERY_KEY });
    },
  });

  return { update };
}
