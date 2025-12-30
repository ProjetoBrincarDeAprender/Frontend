import { useUser } from "@/hooks/User/useUser";
//import { Loader2 } from "lucide-react";
import {
  DataTable,
  DataTableFilter,
  type FilterState,
} from "@/components/utils/DataTable/DataTable";
import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { ResponsibleColumns } from "./TableData";

import { SkeletonTable } from "@/components/ui/skeleton-table";
import {
  usePrefetchResponsibles,
  useResponsible,
} from "@/hooks/Responsible/useResponsible";
import type { FilterResponsibleOption } from "@/types/filter";
import type { Responsible } from "@/types/responsible";
import { UserPerfilEnum } from "@/types/user";

export default function ResponsibleTable() {
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

  const filters: FilterResponsibleOption = {
    page,
    limit: pageSize as 10 | 25 | 50 | 100 | 500,
  };

  if (user?.perfil !== UserPerfilEnum.ADMIN) {
    filters.escolaId = Number(user?.escolaId);
  }

  // Apply server-side filter from URL params
  if (filter) {
    filters.search = filter.value;
    filters.searchBy = filter.column as FilterResponsibleOption["searchBy"];
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

  const { responsiblesQuery } = useResponsible({ filters });
  const { data: responsiblesReturn, isLoading: isResponsiblesLoading } =
    responsiblesQuery;
  const responsiblesData = responsiblesReturn?.data;

  // Prefetch next page
  const { prefetchResponsibles } = usePrefetchResponsibles();
  useEffect(() => {
    const totalPages = responsiblesReturn?.meta?.totalPages ?? 0;
    if (page < totalPages) {
      const nextPageFilters: FilterResponsibleOption = {
        ...filters,
        page: page + 1,
      };
      prefetchResponsibles(nextPageFilters);
    }
  }, [
    page,
    responsiblesReturn?.meta?.totalPages,
    filters,
    prefetchResponsibles,
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
      {isResponsiblesLoading ? (
        <SkeletonTable rows={6} cols={ResponsibleColumns.length} />
      ) : (
        <DataTable
          columns={ResponsibleColumns}
          data={(responsiblesData as Responsible[] | undefined) ?? []}
          manualPagination
          pageCount={responsiblesReturn?.meta.totalPages}
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
