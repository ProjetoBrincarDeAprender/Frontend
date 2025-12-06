import { useUser } from "@/hooks/User/useUser";
//import { Loader2 } from "lucide-react";
import { DataTable } from "@/components/utils/DataTable/DataTable";
import { useSearchParams } from "react-router";
import { ResponsibleColumns, type Responsible } from "./TableData";

import { SkeletonTable } from "@/components/ui/skeleton-table";
import { useResponsible } from "@/hooks/Responsible/useResponsible";
import type { FilterResponsibleOption } from "@/types/filter";
import { UserPerfilEnum } from "@/types/user";

export default function ResponsibleTable() {
  const [searchParams, _] = useSearchParams();
  const { user } = useUser();

  const filters: FilterResponsibleOption = {};

  if (user?.perfil !== UserPerfilEnum.ADMIN) {
    filters.escolaId = Number(user?.escolaId);
  }

  const { responsiblesQuery } = useResponsible({ filters });
  const { data: responsiblesData, isLoading: isResponsiblesLoading } =
    responsiblesQuery;

  return (
    <>
      {isResponsiblesLoading ? (
        <SkeletonTable rows={6} cols={ResponsibleColumns.length} />
      ) : (
        <DataTable
          columns={ResponsibleColumns}
          data={(responsiblesData as Responsible[] | undefined) ?? []}
          {...{
            page: searchParams.get("page")
              ? parseInt(searchParams.get("page")!)
              : 0,
          }}
        />
      )}
    </>
  );
}
