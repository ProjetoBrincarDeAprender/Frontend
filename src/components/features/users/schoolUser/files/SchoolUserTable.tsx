import { SkeletonTable } from "@/components/ui/skeleton-table";
import { useSchoolAdmin } from "@/hooks/SchoolAdmin/useSchoolAdmin";
import { useTable } from "@/hooks/Table/useTable";
import { useUser } from "@/hooks/User/useUser";
import type { FilterSchoolAdminOption } from "@/types/filter";
import { UserPerfilEnum } from "@/types/user";
import { useSearchParams } from "react-router";
import { DataTable } from "../../../../utils/DataTable/DataTable";
import { SchoolUserColumns } from "./TableData";

export default function SchoolUserTable() {
  const [searchParams, _] = useSearchParams();
  useTable();
  const { user } = useUser();

  const filters: FilterSchoolAdminOption = {};

  if (user?.perfil !== UserPerfilEnum.ADMIN) {
    filters.escolaId = Number(user?.escolaId);
  }

  const { schoolAdminsQuery } = useSchoolAdmin({ filters });
  const { data: schoolAdminsData, isLoading: isSchoolAdminsLoading } =
    schoolAdminsQuery;

  return (
    <>
      {isSchoolAdminsLoading ? (
        <SkeletonTable rows={6} cols={SchoolUserColumns.length} />
      ) : (
        <DataTable
          columns={SchoolUserColumns}
          data={schoolAdminsData ?? []}
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
