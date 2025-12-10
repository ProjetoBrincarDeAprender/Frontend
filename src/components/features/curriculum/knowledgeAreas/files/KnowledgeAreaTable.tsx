import {
  KNOWLEDGE_AREA_QUERY_KEY,
  useKnowledgeArea,
} from "@/hooks/KnowledgeArea/useKnowledgeArea";
import { useTable } from "@/hooks/Table/useTable";
import { useDelete } from "@/hooks/useDelete";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useSearchParams } from "react-router";
import { DataTable } from "../../../../utils/DataTable/DataTable";
import { KnowledgeAreaColumns } from "./TableData";

import { SkeletonTable } from "@/components/ui/skeleton-table";
import DeleteModal from "@/components/utils/DataTable/DeleteModal";
import type { KnowledgeArea } from "@/types/knowledgeArea";
import { EditKnowledgeAreaModal } from "../edit/KnowledgeAreaEditModal";

interface CellContext {
  row: {
    original: KnowledgeArea;
  };
}

export default function KnowledgeAreaTable() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { multiDeleteMutation } = useDelete({
    route: "/knowledge-area/remove",
    entity: "Área de Conhecimento",
    queryKey: KNOWLEDGE_AREA_QUERY_KEY,
  });
  const { mutateAsync: deleteAreas } = multiDeleteMutation;

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    await deleteAreas(selectedIds);
    setSelectedIds([]);
    setUpdating(true);
  };

  const [searchParams, _] = useSearchParams();
  const { setUpdating } = useTable();

  const { knowledgeAreasQuery } = useKnowledgeArea({});
  const { data, isLoading: loading } = knowledgeAreasQuery;

  const columnsWithCheckbox: ColumnDef<KnowledgeArea>[] = [
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
            aria-label={checked ? "Desmarcar área" : "Selecionar área"}
          />
        );
      },
      enableSorting: false,
    },
    ...KnowledgeAreaColumns.map((col) => {
      if ((col as ColumnDef<KnowledgeArea>).id === "actions") {
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
                <EditKnowledgeAreaModal id={row.original.id} />
              </button>
              <button
                disabled={selectedIds.length > 0}
                className={
                  selectedIds.length > 0 ? "cursor-not-allowed opacity-50" : ""
                }
              >
                <DeleteModal
                  route="/knowledge-area/remove"
                  id={row.original.id}
                  entity="Área de Conhecimento"
                  queryKey={KNOWLEDGE_AREA_QUERY_KEY}
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
                title="Excluir áreas selecionadas"
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
