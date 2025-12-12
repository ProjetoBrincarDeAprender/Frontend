import type { FilterSchoolOption } from "@/types/filter";
import type { School } from "@/types/school";
import type { User } from "@/types/user";
import api from "@/utils/api";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";

async function fetchSchoolData(
  queryClient: QueryClient,
  schoolId: number | string,
): Promise<School> {
  const schools: School[] | undefined =
    await queryClient.getQueryData(SCHOOL_QUERY_KEY);

  if (schools) {
    const school = schools.find((s) => s.id === schoolId);
    if (school) {
      return school;
    }
  }

  try {
    const response = await api.get(`/school/list/${schoolId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching school data:", error);
    throw error;
  }
}

async function fetchAllSchools(
  filters?: FilterSchoolOption,
): Promise<School[]> {
  try {
    const params = new URLSearchParams(filters as Record<string, string>);

    const response = await api.get(`/school/list?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all schools:", error);
    throw error;
  }
}

async function fetchSchoolUsers(
  schoolId: number | string,
  filters?: FilterSchoolOption,
): Promise<User[]> {
  try {
    const params = new URLSearchParams(filters as Record<string, string>);

    const response = await api.get(
      `/school/list/${schoolId}/users?${params.toString()}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching school users:", error);
    throw error;
  }
}

export const SCHOOL_QUERY_KEY = ["schools-data"];
export const SCHOOL_USERS_QUERY_KEY = ["school-users-data"];

export function useSchool({
  schoolId,
  filters,
}: {
  schoolId?: number | string;
  filters?: FilterSchoolOption;
}) {
  const queryClient = useQueryClient();

  const schoolQuery = useQuery({
    queryKey: [...SCHOOL_QUERY_KEY, schoolId],
    queryFn: () => fetchSchoolData(queryClient, schoolId!),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!schoolId,
  });

  const schoolsQuery = useQuery({
    queryKey: [...SCHOOL_QUERY_KEY, filters],
    queryFn: () => fetchAllSchools(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const schoolUsersQuery = useQuery({
    queryKey: [...SCHOOL_USERS_QUERY_KEY, schoolId, filters],
    queryFn: () => fetchSchoolUsers(schoolId!, filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!schoolId,
  });

  return { schoolQuery, schoolsQuery, schoolUsersQuery };
}
