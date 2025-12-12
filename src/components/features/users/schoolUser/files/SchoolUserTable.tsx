import { SkeletonTable } from "@/components/ui/skeleton-table";
import { useSchoolAdmin } from "@/hooks/SchoolAdmin/useSchoolAdmin";
import { useUser } from "@/hooks/User/useUser";
import type { FilterSchoolAdminOption } from "@/types/filter";
import { UserPerfilEnum } from "@/types/user";
import { useSearchParams } from "react-router";
import { DataTable } from "../../../../utils/DataTable/DataTable";
import { SchoolUserColumns } from "./TableData";

export default function SchoolUserTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useUser();

  // Get pagination params from URL
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;

  const filters: FilterSchoolAdminOption = {
    page,
    limit: pageSize as 10 | 25 | 50 | 100 | 500,
  };

  if (user?.perfil !== UserPerfilEnum.ADMIN) {
    filters.escolaId = Number(user?.escolaId);
  }

  const { schoolAdminsQuery } = useSchoolAdmin({ filters });
  const { data: schoolAdminsData, isLoading: isSchoolAdminsLoading } =
    schoolAdminsQuery;

  // Handle pagination change
  const handlePaginationChange = (pagination: {
    pageIndex: number;
    pageSize: number;
  }) => {
    setSearchParams({
      page: String(pagination.pageIndex + 1), // Convert from 0-based to 1-based
      pageSize: String(pagination.pageSize),
    });
  };

  return (
    <>
      {isSchoolAdminsLoading ? (
        <SkeletonTable rows={6} cols={SchoolUserColumns.length} />
      ) : (
        <DataTable
          columns={SchoolUserColumns}
          data={schoolAdminsData?.data ?? []}
          manualPagination
          pageCount={schoolAdminsData?.meta.totalPages}
          pagination={{
            pageIndex: page - 1, // Convert from 1-based to 0-based
            pageSize,
          }}
          onPaginationChange={handlePaginationChange}
        />
      )}
    </>
  );
}
