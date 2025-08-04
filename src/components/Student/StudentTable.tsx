import api from "@/utils/api";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { DataTable } from "../utils/DataTable/DataTable";
import { StudentColumns, type Student } from "./TableData";

export default function StudentTable() {
  const [data, setData] = useState<Student[] | null>(null);
  const [searchParams, _] = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/student/list", {});

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
          columns={StudentColumns}
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
