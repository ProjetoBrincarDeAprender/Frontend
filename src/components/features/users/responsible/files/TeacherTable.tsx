import { useTable } from "@/hooks/Table/useTable";
import { useUser } from "@/hooks/User/useUser";
import api from "@/utils/api";
//import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { DataTable } from "@/components/utils/DataTable/DataTable";
import { ResponsibleColumns, type Responsible } from "./TableData";

import { SkeletonTable } from "@/components/ui/skeleton-table";

export default function ResponsibleTable() {
  const [data, setData] = useState<Responsible[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchParams, _] = useSearchParams();
  const { updating, setUpdating } = useTable();
  const { user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          `/user/list?type=Responsavel${user?.perfil != "Admin" ? "&escolaId=" + user?.escola?.id : ""}`,
          {},
        );
        if (response.status === 200) {
          setData(response.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
        setUpdating(false);
      }
    };
    fetchData();
  }, [updating, setUpdating, user]);

  return (
    <>
      {loading ? (
        <SkeletonTable rows={6} cols={ResponsibleColumns.length} />
      ) : (
        <DataTable
          columns={ResponsibleColumns}
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
