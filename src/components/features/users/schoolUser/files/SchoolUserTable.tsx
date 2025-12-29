import { SkeletonTable } from "@/components/ui/skeleton-table";
import {
  usePrefetchSchoolAdmins,
  useSchoolAdmin,
} from "@/hooks/SchoolAdmin/useSchoolAdmin";
import { useUser } from "@/hooks/User/useUser";
import type { FilterSchoolAdminOption } from "@/types/filter";
import { UserPerfilEnum } from "@/types/user";
import { useEffect } from "react";
import { useSearchParams } from "react-router";
import {
  DataTable,
  DataTableFilter,
  type FilterState,
} from "../../../../utils/DataTable/DataTable";
import { SchoolUserColumns } from "./TableData";

export default function SchoolUserTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useUser();

  // Get pagination and filter params from URL
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const search = searchParams.get("search") || "";
  const searchBy = searchParams.get("searchBy") || "";

  // Build filter state from URL params
  const filter: FilterState | null =
    search && searchBy ? { column: searchBy, value: search } : null;

  const filters: FilterSchoolAdminOption = {
    page,
    limit: pageSize as 10 | 25 | 50 | 100 | 500,
  };

  if (user?.perfil !== UserPerfilEnum.ADMIN) {
    filters.escolaId = Number(user?.escolaId);
  }

  // Apply server-side filter from URL params
  if (filter) {
    filters.search = filter.value;
    filters.searchBy = filter.column as FilterSchoolAdminOption["searchBy"];
  }

  // Handle filter change - update URL params
  const handleFilterChange = (newFilter: FilterState | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (newFilter) {
      newParams.set("search", newFilter.value);
      newParams.set("searchBy", newFilter.column);
      newParams.set("page", "1"); // Reset to first page on filter
    } else {
      newParams.delete("search");
      newParams.delete("searchBy");
    }
    setSearchParams(newParams);
  };

  const { schoolAdminsQuery } = useSchoolAdmin({ filters });
  const { data: schoolAdminsReturn, isLoading: isSchoolAdminsLoading } =
    schoolAdminsQuery;
  const schoolAdminsData = schoolAdminsReturn?.data;

  // Prefetch next page
  const { prefetchSchoolAdmins } = usePrefetchSchoolAdmins();
  useEffect(() => {
    const totalPages = schoolAdminsReturn?.meta?.totalPages ?? 0;
    if (page < totalPages) {
      const nextPageFilters: FilterSchoolAdminOption = {
        ...filters,
        page: page + 1,
      };
      prefetchSchoolAdmins(nextPageFilters);
    }
  }, [
    page,
    schoolAdminsReturn?.meta?.totalPages,
    filters,
    prefetchSchoolAdmins,
  ]);

  // Handle pagination change
  const handlePaginationChange = (pagination: {
    pageIndex: number;
    pageSize: number;
  }) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", String(pagination.pageIndex + 1)); // Convert from 0-based to 1-based
    newParams.set("pageSize", String(pagination.pageSize));
    setSearchParams(newParams);
  };

  return (
    <>
      {isSchoolAdminsLoading ? (
        <SkeletonTable rows={6} cols={SchoolUserColumns.length} />
      ) : (
        <DataTable
          columns={SchoolUserColumns}
          data={schoolAdminsData ?? []}
          manualPagination
          pageCount={schoolAdminsReturn?.meta.totalPages}
          pagination={{
            pageIndex: page - 1, // Convert from 1-based to 0-based
            pageSize,
          }}
          onPaginationChange={handlePaginationChange}
          renderExtra={() => (
            <DataTableFilter
              filterableColumns={["nome_completo", "email"]}
              filter={filter}
              onFilterChange={handleFilterChange}
            />
          )}
        />
      )}
    </>
  );
}
