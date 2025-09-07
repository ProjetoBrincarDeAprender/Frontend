import { useTable } from "@/hooks/Table/useTable";
import { useUser } from "@/hooks/User/useUser";
import api from "@/utils/api";
//import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { DataTable } from "../../../../utils/DataTable/DataTable";
import { StudentColumns, type Student } from "./TableData";

import { SkeletonTable } from "@/components/ui/skeleton-table";

export default function StudentTable() {
  const [data, setData] = useState<Student[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchParams, _] = useSearchParams();
  const { updating, setUpdating } = useTable();
  const { user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          `/student/list${user?.perfil != "Admin" ? "?escolaId=" + user?.escola?.id : ""}`,
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
  }, [updating, setUpdating, user]);

  return (
    <>
      {loading ? (
        <SkeletonTable rows={6} cols={StudentColumns.length} />
      ) : (
        <DataTable
          columns={StudentColumns}
          data={
            data?.map((student) => ({ ...student, id: String(student.id) })) ??
            []
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
