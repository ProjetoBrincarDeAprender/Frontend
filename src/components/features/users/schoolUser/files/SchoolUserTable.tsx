import { SkeletonTable } from "@/components/ui/skeleton-table";
import { useTable } from "@/hooks/Table/useTable";
import { useUser } from "@/hooks/User/useUser";
import api from "@/utils/api";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { DataTable } from "../../../../utils/DataTable/DataTable";
import { SchoolUserColumns, type SchoolUser } from "./TableData";

export default function SchoolUserTable() {
  const [data, setData] = useState<SchoolUser[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchParams, _] = useSearchParams();
  useTable();
  const { user } = useUser();
  const { updating, setUpdating } = useTable();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          `/school-admin/list${user?.perfil != "Admin" ? "?escolaId=" + user?.escola?.id : ""}`,
          {},
        );

        if (response.status === 200) {
          setData(response.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData().then(() => setUpdating(false));
  }, [user, updating, setUpdating]);

  return (
    <>
      {loading ? (
        <SkeletonTable rows={6} cols={SchoolUserColumns.length} />
      ) : (
        <DataTable
          columns={SchoolUserColumns}
          data={data ?? []}
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
