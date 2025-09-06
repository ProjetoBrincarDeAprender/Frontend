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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          `/user/list?type=Escola${user?.perfil != "Admin" ? "?escolaId=" + user?.escola?.id : ""}`,
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

    fetchData();
  }, [user]);

  return (
    <>
      {loading ? (
        <SkeletonTable rows={6} cols={SchoolUserColumns.length} />
      ) : (
        <DataTable
          columns={SchoolUserColumns}
          data={data?.map((item) => ({ ...item, id: String(item.id) })) ?? []}
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
