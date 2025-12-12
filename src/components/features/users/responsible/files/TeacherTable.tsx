import { useUser } from "@/hooks/User/useUser";
//import { Loader2 } from "lucide-react";
import { DataTable } from "@/components/utils/DataTable/DataTable";
import { useSearchParams } from "react-router";
import { ResponsibleColumns } from "./TableData";

import { SkeletonTable } from "@/components/ui/skeleton-table";
import { useResponsible } from "@/hooks/Responsible/useResponsible";
import type { FilterResponsibleOption } from "@/types/filter";
import type { Responsible } from "@/types/responsible";
import { UserPerfilEnum } from "@/types/user";

export default function ResponsibleTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useUser();

  // Get pagination params from URL
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;

  const filters: FilterResponsibleOption = {
    page,
    limit: pageSize as 10 | 25 | 50 | 100 | 500,
  };

  if (user?.perfil !== UserPerfilEnum.ADMIN) {
    filters.escolaId = Number(user?.escolaId);
  }

  const { responsiblesQuery } = useResponsible({ filters });
  const { data: responsiblesData, isLoading: isResponsiblesLoading } =
    responsiblesQuery;

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
      {isResponsiblesLoading ? (
        <SkeletonTable rows={6} cols={ResponsibleColumns.length} />
      ) : (
        <DataTable
          columns={ResponsibleColumns}
          data={(responsiblesData?.data as Responsible[] | undefined) ?? []}
          manualPagination
          pageCount={responsiblesData?.meta.totalPages}
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
