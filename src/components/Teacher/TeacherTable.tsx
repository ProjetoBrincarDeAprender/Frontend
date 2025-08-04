import api from "@/utils/api";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { DataTable } from "../utils/DataTable/DataTable";
import { TeacherColumns, type Teacher } from "./TableData";

export default function TeacherTable() {
  const [data, setData] = useState<Teacher[] | null>(null);
  const [searchParams, _] = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/user/list?type=professor", {});

        if (response.status == 200) {
          setData(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {data ? (
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
        <div>Loading...</div>
      )}
    </>
  );
}
