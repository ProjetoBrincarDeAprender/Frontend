import { useTable } from "@/hooks/Table/useTable";
import { useUser } from "@/hooks/User/useUser";
import api from "@/utils/api";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { DataTable } from "../../../../utils/DataTable/DataTable";
import { TeacherColumns, type Teacher } from "./TableData";

export default function TeacherTable() {
  const [data, setData] = useState<Teacher[] | null>(null);
  const [searchParams, _] = useSearchParams();
  const { updating, setUpdating } = useTable();
  const { user } = useUser();

  console.log(user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          `/user/list?type=Professor${user?.perfil != "Admin" ? "&escolaId=" + user?.escola?.id : ""}`,
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
          columns={TeacherColumns}
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
