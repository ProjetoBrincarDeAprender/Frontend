import { SkeletonTable } from "@/components/ui/skeleton-table";
import { DataTable } from "@/components/utils/DataTable/DataTable";
import api from "@/utils/api";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

export type UnlinkedStudents = {
  codigo_usuario: string;
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
  const [searchParams] = useSearchParams();
  const teacherId = searchParams.get("id");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!teacherId) {
          setLoading(false);
          return;
        }

        // Buscar informações do professor para obter a escola
        const teacherRes = await api.get(`/user/list/${teacherId}`);
        if (teacherRes.status !== 200 || !teacherRes.data?.escola) {
          console.log("Erro ao buscar informações do professor");
          setLoading(false);
          return;
        }

        const teacherSchool = teacherRes.data.escola;

        // Buscar alunos vinculados ao professor
        let linkedStudents: UnlinkedStudents[] = [];
        const linkedRes = await api.get(`/teacher/list/${teacherId}/students`);
        if (linkedRes.status === 200 && Array.isArray(linkedRes.data)) {
          // Filtrar apenas alunos da mesma escola
          linkedStudents = linkedRes.data.filter(
            (student: UnlinkedStudents) => student.escola === teacherSchool,
          );
        }

        // Buscar alunos sem professor
        const response = await api.get("/student/list?responsibleId=null", {});
        let unlinkedStudents: UnlinkedStudents[] = [];
        if (response.status === 200 && Array.isArray(response.data)) {
          // Filtrar apenas alunos da mesma escola
          unlinkedStudents = response.data.filter(
            (student: UnlinkedStudents) => student.escola === teacherSchool,
          );
        }

        setData([...linkedStudents, ...unlinkedStudents]);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [teacherId]);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const columns: ColumnDef<UnlinkedStudents>[] = [
    {
      accessorKey: "codigo_usuario",
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
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(Number(row.original.codigo_usuario))}
          onChange={() => toggleSelect(Number(row.original.codigo_usuario))}
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
        <DataTable
          columns={columns}
          data={
            data?.map((item) => ({
              ...item,
              id: String(item.codigo_usuario),
            })) ?? []
          }
        />
      )}
    </>
  );
}
