import api from "@/utils/api";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { DataTable } from "../utils/DataTable/DataTable";
import { SchoolColumns, type School } from "./TableData";

export default function SchoolTable() {
  const [data, setData] = useState<School[] | null>(null);
  const [searchParams, _] = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/school/list", {});

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
          columns={SchoolColumns}
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
