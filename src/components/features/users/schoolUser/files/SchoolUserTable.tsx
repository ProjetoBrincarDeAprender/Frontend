import { useTable } from "@/hooks/Table/useTable";
import { useUser } from "@/hooks/User/useUser";
import api from "@/utils/api";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { DataTable } from "../../../../utils/DataTable/DataTable";
import { SchoolUserColumns, type SchoolUser } from "./TableData";

export default function SchoolUserTable() {
  const [data, setData] = useState<SchoolUser[] | null>(null);
  const [searchParams, _] = useSearchParams();
  const { updating, setUpdating } = useTable();
  const { user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          `/user/list?type=Escola${user?.perfil != "Admin" ? "?escolaId=" + user?.escola?.id : ""}`,
          {},
        );

        if (response.status == 200) {
          setData(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData().then(() => setUpdating(false));
  }, [updating, setUpdating, user]);

  return (
    <>
      {updating ? (
        <Loader2 className="animate-spin" />
      ) : data ? (
        <DataTable
          columns={SchoolUserColumns}
          data={data}
          {...{
            page: searchParams.get("page")
              ? parseInt(searchParams.get("page")!)
              : 0,
          }}
        />
      ) : (
        <Loader2 className="animate-spin" />
      )}
    </>
  );
}
