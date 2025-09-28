import { useTable } from "@/hooks/Table/useTable";
import { useUser } from "@/hooks/User/useUser";
import api from "@/utils/api";
//import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { DataTable } from "../../../../utils/DataTable/DataTable";
import { TeacherColumns, type Teacher } from "./TableData";

import { SkeletonTable } from "@/components/ui/skeleton-table";
import DeleteModal from "@/components/utils/DataTable/DeleteModal";
import { Share2 } from "lucide-react";
import { EditTeacherModal } from "../edit/TeacherEditModal";

export default function TeacherTable() {
  const [data, setData] = useState<Teacher[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  // Função para deletar múltiplos professores
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    for (const id of selectedIds) {
      try {
        await api.delete(`/teacher/remove/${id}`);
      } catch (error) {
        console.error(`Erro ao deletar professor ${id}:`, error);
      }
    }
    setSelectedIds([]);
    setUpdating(true);
  };
  const [searchParams, _] = useSearchParams();
  const { updating, setUpdating } = useTable();
  const { user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          `/teacher/list${user?.perfil != "Admin" ? "?escolaId=" + user?.escola?.id : ""}`,
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

  const columnsWithCheckbox = [
    {
      id: "select",
      header: () => <span className="font-bold">Selecionar</span>,
      cell: ({ row }: any) => {
        const id = row.original.codigo_usuario;
        const checked = selectedIds.includes(id);
        return (
          <input
            type="checkbox"
            checked={checked}
            onChange={() => {
              setSelectedIds((prev) =>
                checked ? prev.filter((item) => item !== id) : [...prev, id],
              );
            }}
            className="h-4 w-4 cursor-pointer accent-blue-600"
            aria-label={
              checked ? "Desmarcar professor" : "Selecionar professor"
            }
          />
        );
      },
      enableSorting: false,
    },
    ...TeacherColumns.map((col) => {
      if ((col as any).accessorKey === "actions") {
        return {
          ...col,
          cell: ({ row }: any) => (
            <div className="flex items-center justify-center gap-2">
              <button
                disabled={selectedIds.length > 0}
                className={
                  selectedIds.length > 0 ? "cursor-not-allowed opacity-50" : ""
                }
              >
                <EditTeacherModal id={+row.original.codigo_usuario} />
              </button>
              <a
                className={`rounded-sm px-3 py-2 shadow-sm transition ${selectedIds.length > 0 ? "cursor-not-allowed bg-blue-300 opacity-50" : "bg-blue-400 hover:bg-blue-500"}`}
                href={
                  selectedIds.length > 0
                    ? undefined
                    : `/dashboard/link-students?id=${row.original.codigo_usuario}`
                }
                tabIndex={selectedIds.length > 0 ? -1 : 0}
                aria-disabled={selectedIds.length > 0}
              >
                <Share2 className="text-slate-100" />
              </a>
              <button
                disabled={selectedIds.length > 0}
                className={
                  selectedIds.length > 0 ? "cursor-not-allowed opacity-50" : ""
                }
              >
                <DeleteModal
                  route="/teacher/remove"
                  id={+row.original.codigo_usuario}
                />
              </button>
            </div>
          ),
        };
      }
      return col;
    }),
  ];

  return (
    <>
      {loading ? (
        <SkeletonTable rows={6} cols={columnsWithCheckbox.length} />
      ) : (
        <DataTable
          columns={columnsWithCheckbox}
          data={data ?? []}
          page={
            searchParams.get("page") ? parseInt(searchParams.get("page")!) : 0
          }
          renderExtra={() =>
            selectedIds.length > 0 && !loading ? (
              <button
                onClick={handleDeleteSelected}
                className="ml-2 flex items-center gap-2 rounded bg-red-500 px-4 py-2 font-bold text-white transition-all hover:bg-red-700"
                title="Excluir professores selecionados"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Excluir Selecionados ({selectedIds.length})
              </button>
            ) : null
          }
        />
      )}
    </>
  );
}
