import type { FilterSchoolAdminOption } from "@/types/filter";
import type { SchoolAdmin } from "@/types/school";
import api from "@/utils/api";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";

async function fetchSchoolAdminData(
  queryClient: QueryClient,
  schoolAdminId: string | number,
) {
  const schoolAdmins: SchoolAdmin[] | undefined = queryClient.getQueryData(
    SCHOOL_ADMIN_QUERY_KEY,
  );

  if (schoolAdmins) {
    const schoolAdmin = schoolAdmins.find(
      (admin) => admin.codigo_usuario === schoolAdminId,
    );
    if (schoolAdmin) {
      return schoolAdmin;
    }
  }

  try {
    const response = await api.get(`/school-admin/list/${schoolAdminId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function fetchSchoolAdminsData(filters: FilterSchoolAdminOption) {
  try {
    const params = new URLSearchParams(filters as Record<string, string>);
    const response = await api.get(`/school-admin/list?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const SCHOOL_ADMIN_QUERY_KEY = ["schoolAdmin"];

export function useSchoolAdmin({
  schoolAdminId,
  filters,
}: {
  schoolAdminId?: string | number;
  filters?: FilterSchoolAdminOption;
}) {
  const queryClient = useQueryClient();

  const schoolAdminQuery = useQuery({
    queryKey: [...SCHOOL_ADMIN_QUERY_KEY, schoolAdminId!],
    queryFn: () => fetchSchoolAdminData(queryClient, schoolAdminId!),
    enabled: !!schoolAdminId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const schoolAdminsQuery = useQuery({
    queryKey: [...SCHOOL_ADMIN_QUERY_KEY, "list", filters],
    queryFn: () => fetchSchoolAdminsData(filters!),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return { schoolAdminQuery, schoolAdminsQuery };
}
