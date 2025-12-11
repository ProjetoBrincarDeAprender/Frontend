import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useSearchParams } from "react-router";
import { DataTable } from "../../../../utils/DataTable/DataTable";
import { DifficultyLevelColumns } from "./TableData";

import { SkeletonTable } from "@/components/ui/skeleton-table";
import DeleteModal from "@/components/utils/DataTable/DeleteModal";
import {
  DIFFICULTY_LEVEL_QUERY_KEY,
  useDifficultyLevel,
} from "@/hooks/DificultyLevel/useDifficultyLevel";
import { useDelete } from "@/hooks/useDelete";
import type { DifficultyLevel } from "@/types/difficultyLevels";
import { EditDifficultyLevelModal } from "../edit/DifficultyLevelEditModal";

interface CellContext {
  row: {
    original: DifficultyLevel;
  };
}

export default function DifficultyLevelTable() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { multiDeleteMutation } = useDelete({
    route: "/difficulty-level/remove",
    entity: "Nível de Dificuldade",
    queryKey: DIFFICULTY_LEVEL_QUERY_KEY,
  });
  const { mutateAsync: multiDelete } = multiDeleteMutation;

  const { difficultyLevelsQuery } = useDifficultyLevel();
  const { data: difficultyLevelsData, isLoading: isDifficultyLoading } =
    difficultyLevelsQuery;

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    await multiDelete(selectedIds);
    setSelectedIds([]);
  };

  const [searchParams, _] = useSearchParams();

  const columnsWithCheckbox: ColumnDef<DifficultyLevel>[] = [
    {
      id: "select",
      header: () => <span className="font-bold">Selecionar</span>,
      cell: ({ row }: CellContext) => {
        const id = row.original.id;
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
            aria-label={checked ? "Desmarcar nível" : "Selecionar nível"}
          />
        );
      },
      enableSorting: false,
    },
    ...DifficultyLevelColumns.map((col) => {
      if ((col as ColumnDef<DifficultyLevel>).id === "actions") {
        return {
          ...col,
          cell: ({ row }: CellContext) => (
            <div className="flex items-center justify-center gap-2">
              <button
                disabled={selectedIds.length > 0}
                className={
                  selectedIds.length > 0 ? "cursor-not-allowed opacity-50" : ""
                }
              >
                <EditDifficultyLevelModal id={row.original.id} />
              </button>
              <button
                disabled={selectedIds.length > 0}
                className={
                  selectedIds.length > 0 ? "cursor-not-allowed opacity-50" : ""
                }
              >
                <DeleteModal
                  route="/difficulty-level/remove"
                  id={row.original.id}
                  entity="Níveis de Dificuldade"
                  queryKey={DIFFICULTY_LEVEL_QUERY_KEY}
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
      {isDifficultyLoading ? (
        <SkeletonTable rows={6} cols={columnsWithCheckbox.length} />
      ) : (
        <DataTable
          columns={columnsWithCheckbox}
          data={difficultyLevelsData ?? []}
          page={
            searchParams.get("page") ? parseInt(searchParams.get("page")!) : 0
          }
          renderExtra={() =>
            selectedIds.length > 0 && !isDifficultyLoading ? (
              <button
                onClick={handleDeleteSelected}
                className="ml-2 flex items-center gap-2 rounded bg-red-500 px-4 py-2 font-bold text-white transition-all hover:bg-red-700"
                title="Excluir níveis selecionados"
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
