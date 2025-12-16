import { SkeletonTable } from "@/components/ui/skeleton-table";
import { useSchool } from "@/hooks/School/useSchool";
import { useUser } from "@/hooks/User/useUser";
import type { FilterSchoolOption } from "@/types/filter";
import { UserPerfilEnum } from "@/types/user";
import { useSearchParams } from "react-router";
import { DataTable } from "../../../../utils/DataTable/DataTable";
import { SchoolColumns } from "./TableData";

export default function SchoolTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useUser();

  // Get pagination params from URL
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;

  const filters: FilterSchoolOption = {
    page,
    limit: pageSize as 10 | 25 | 50 | 100 | 500,
  };

  if (user?.perfil !== UserPerfilEnum.ADMIN) {
    filters.escolaId = Number(user?.escolaId);
  }

  const { schoolsQuery } = useSchool({ filters });
  const { data: schoolsReturn, isLoading: isSchoolLoading } = schoolsQuery;
  const schoolsData = schoolsReturn?.data;

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
      {isSchoolLoading ? (
        <SkeletonTable rows={6} cols={SchoolColumns.length} />
      ) : (
        <DataTable
          columns={SchoolColumns}
          data={schoolsData?.map((item) => ({ ...item, id: item.id })) ?? []}
          manualPagination
          pageCount={schoolsReturn?.meta.totalPages}
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
