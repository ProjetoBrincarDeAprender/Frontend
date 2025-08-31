import { useEffect, useState } from "react";
import api from "@/utils/api";
import { DataTable } from "@/components/utils/DataTable/DataTable";
import { SkeletonTable } from "@/components/ui/skeleton-table";
import { ArrowUpDown } from "lucide-react";

export type UnlinkedStudents = {
  id: number;
  nome_completo: string;
  email: string;
  escola: string;
};

export function StudentsUnlinkedTable({
  selectedIds,
  setSelectedIds,
}: {
  selectedIds: number[];
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
}) {
  const [data, setData] = useState<UnlinkedStudents[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/student/list", {});
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
  }, []);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const columns = [
    {
      accessorKey: "id",
      header: ({ column }: { column: any }) => (
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 text-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "nome_completo",
      header: ({ column }: { column: any }) => (
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 text-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome Completo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "email",
      header: ({ column }: { column: any }) => (
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 text-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "escola",
      header: ({ column }: { column: any }) => (
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 text-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Escola
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      ),
      enableSorting: true,
    },
    {
      id: "vinculo",
      header: "Vínculo",
      cell: ({ row }: { row: any }) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row.original.id)}
          onChange={() => toggleSelect(row.original.id)}
        />
      ),
      enableSorting: false,
      enableColumnFilter: false,
    },
  ];

  return (
    <>
      {loading ? (
        <SkeletonTable rows={6} cols={columns.length} />
      ) : (
        <DataTable columns={columns} data={data ?? []} />
      )}
    </>
  );
}
