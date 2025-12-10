import useActivity, { ACTIVITY_QUERY_KEY } from "@/hooks/Activity/useActivity";
import { useTable } from "@/hooks/Table/useTable";
import { useDelete } from "@/hooks/useDelete";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useSearchParams } from "react-router";
import { DataTable } from "../../../../utils/DataTable/DataTable";
import { ActivityColumns } from "./TableData";

import { SkeletonTable } from "@/components/ui/skeleton-table";
import DeleteModal from "@/components/utils/DataTable/DeleteModal";
import type { Activity } from "@/types/activity";
import { EditActivityModal } from "../edit/ActivityEditModal";

interface CellContext {
  row: {
    original: Activity;
  };
}

export default function ActivityTable() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { multiDeleteMutation } = useDelete({
    route: "/activity/remove",
    entity: "Atividade",
    queryKey: ACTIVITY_QUERY_KEY,
  });
  const { mutateAsync: deleteActivities } = multiDeleteMutation;

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    await deleteActivities(selectedIds);
    setSelectedIds([]);
    setUpdating(true);
  };

  const [searchParams, _] = useSearchParams();
  const { setUpdating } = useTable();

  const { activitiesQuery } = useActivity({});
  const { data, isLoading: loading } = activitiesQuery;

  const columnsWithCheckbox: ColumnDef<Activity>[] = [
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
            aria-label={
              checked ? "Desmarcar atividade" : "Selecionar atividade"
            }
          />
        );
      },
      enableSorting: false,
    },
    ...ActivityColumns.map((col) => {
      if ((col as ColumnDef<Activity>).id === "actions") {
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
                <EditActivityModal id={row.original.id} />
              </button>
              <button
                disabled={selectedIds.length > 0}
                className={
                  selectedIds.length > 0 ? "cursor-not-allowed opacity-50" : ""
                }
              >
                <DeleteModal
                  route="/activity/remove"
                  id={row.original.id}
                  entity="Atividade"
                  queryKey={ACTIVITY_QUERY_KEY}
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
                title="Excluir atividades selecionadas"
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
                Excluir Selecionadas ({selectedIds.length})
              </button>
            ) : null
          }
        />
      )}
    </>
  );
}
