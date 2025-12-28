import { SkeletonTable } from "@/components/ui/skeleton-table";
import { usePrefetchSchools, useSchool } from "@/hooks/School/useSchool";
import { useUser } from "@/hooks/User/useUser";
import type { FilterSchoolOption } from "@/types/filter";
import { UserPerfilEnum } from "@/types/user";
import { useEffect } from "react";
import { useSearchParams } from "react-router";
import {
  DataTable,
  type FilterState,
} from "../../../../utils/DataTable/DataTable";
import { SchoolColumns } from "./TableData";

export default function SchoolTable() {
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

  const filters: FilterSchoolOption = {
    page,
    limit: pageSize as 10 | 25 | 50 | 100 | 500,
  };

  if (user?.perfil !== UserPerfilEnum.ADMIN) {
    filters.escolaId = Number(user?.escolaId);
  }

  // Apply server-side filter from URL params
  if (filter) {
    filters.search = filter.value;
    filters.searchBy = filter.column as FilterSchoolOption["searchBy"];
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

  const { schoolsQuery } = useSchool({ filters });
  const { data: schoolsReturn, isLoading: isSchoolLoading } = schoolsQuery;
  const schoolsData = schoolsReturn?.data;

  // Prefetch next page
  const { prefetchSchools } = usePrefetchSchools();
  useEffect(() => {
    const totalPages = schoolsReturn?.meta?.totalPages ?? 0;
    if (page < totalPages) {
      const nextPageFilters: FilterSchoolOption = {
        ...filters,
        page: page + 1,
      };
      prefetchSchools(nextPageFilters);
    }
  }, [page, schoolsReturn?.meta?.totalPages, filters, prefetchSchools]);

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
          filterableColumns={["nome", "email", "localizacao", "telefone"]}
          filter={filter}
          onFilterChange={handleFilterChange}
          manualFiltering
        />
      )}
    </>
  );
}
