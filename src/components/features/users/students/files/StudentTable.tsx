import { useTable } from "@/hooks/Table/useTable";
import { useUser } from "@/hooks/User/useUser";
//import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router";
import { DataTable } from "../../../../utils/DataTable/DataTable";
import DeleteModal from "../../../../utils/DataTable/DeleteModal";
import { EditStudentModal } from "../edit/StudentEditModal";
import { StudentColumns } from "./TableData";

import { SkeletonTable } from "@/components/ui/skeleton-table";
import { STUDENTS_QUERY_KEY, useStudent } from "@/hooks/Student/useStudent";
import { useDelete } from "@/hooks/useDelete";
import type { FilterStudentOption } from "@/types/filter";

export default function StudentTable() {
  const { multiDeleteMutation } = useDelete({
    route: "/student/remove",
    entity: "Aluno",
    queryKey: STUDENTS_QUERY_KEY,
  });
  const { mutateAsync: deleteUsers } = multiDeleteMutation;

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const { setUpdating } = useTable();
  const { user } = useUser();

  // Get pagination params from URL
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;

  const filters: FilterStudentOption = {
    page,
    limit: pageSize as 10 | 25 | 50 | 100 | 500,
  };

  if (user?.perfil !== "Admin") {
    filters.escolaId = Number(user?.escolaId);
  }

  const { studentsQuery } = useStudent({ filters });
  const { data, isLoading } = studentsQuery;

  // Função para deletar múltiplos alunos
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;

    await deleteUsers(selectedIds);

    setSelectedIds([]);
    setUpdating(true);
  };

  // Handle pagination change
  const handlePaginationChange = (pagination: {
    pageIndex: number;
    pageSize: number;
  }) => {
    setSearchParams({
      page: String(pagination.pageIndex + 1), // Convert from 0-based to 1-based
      pageSize: String(pagination.pageSize),
    });
    setSelectedIds([]); // Clear selections on page change
  };

  // Adiciona coluna de checkbox dinamicamente
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
            aria-label={checked ? "Desmarcar aluno" : "Selecionar aluno"}
          />
        );
      },
      enableSorting: false,
    },
    ...StudentColumns.map((col) => {
      if (col.id === "actions") {
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
                <EditStudentModal id={+row.original.codigo_usuario} />
              </button>
              <button
                disabled={selectedIds.length > 0}
                className={
                  selectedIds.length > 0 ? "cursor-not-allowed opacity-50" : ""
                }
              >
                <DeleteModal
                  route="/student/remove"
                  id={+row.original.codigo_usuario}
                  entity="Aluno"
                  queryKey={STUDENTS_QUERY_KEY}
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
      {isLoading ? (
        <SkeletonTable rows={6} cols={columnsWithCheckbox.length} />
      ) : (
        <DataTable
          columns={columnsWithCheckbox}
          data={data?.data ?? []}
          manualPagination
          pageCount={data?.meta.totalPages}
          pagination={{
            pageIndex: page - 1, // Convert from 1-based to 0-based
            pageSize,
          }}
          onPaginationChange={handlePaginationChange}
          renderExtra={() =>
            selectedIds.length > 0 && !isLoading ? (
              <button
                onClick={handleDeleteSelected}
                className="ml-2 flex items-center gap-2 rounded bg-red-500 px-4 py-2 font-bold text-white transition-all hover:bg-red-700"
                title="Excluir alunos selecionados"
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
