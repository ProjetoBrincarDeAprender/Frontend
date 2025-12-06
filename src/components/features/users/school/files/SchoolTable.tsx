import { SkeletonTable } from "@/components/ui/skeleton-table";
import { useSchool } from "@/hooks/School/useSchool";
import { useUser } from "@/hooks/User/useUser";
import type { FilterSchoolOption } from "@/types/filter";
import { UserPerfilEnum } from "@/types/user";
import { useSearchParams } from "react-router";
import { DataTable } from "../../../../utils/DataTable/DataTable";
import { SchoolColumns } from "./TableData";

export default function SchoolTable() {
  const [searchParams, _] = useSearchParams();
  const { user } = useUser();

  const filters: FilterSchoolOption = {};

  if (user?.perfil !== UserPerfilEnum.ADMIN) {
    filters.escolaId = Number(user?.escolaId);
  }

  const { schoolsQuery } = useSchool({ filters });
  const { data: schoolsData, isLoading: isSchoolLoading } = schoolsQuery;

  return (
    <>
      {isSchoolLoading ? (
        <SkeletonTable rows={6} cols={SchoolColumns.length} />
      ) : (
        <DataTable
          columns={SchoolColumns}
          data={
            schoolsData?.map((item) => ({ ...item, id: String(item.id) })) ?? []
          }
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
