import { useTable } from "@/hooks/Table/useTable";
import { useUser } from "@/hooks/User/useUser";
import api from "@/utils/api";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { DataTable } from "../../../../utils/DataTable/DataTable";
import { CompetenceColumns, type Competence } from "./TableData";
import type { ColumnDef } from "@tanstack/react-table";

import { SkeletonTable } from "@/components/ui/skeleton-table";
import DeleteModal from "@/components/utils/DataTable/DeleteModal";
import { EditCompetenceModal } from "../edit/CompetenceEditModal";

interface CellContext {
  row: {
    original: Competence;
  };
}

export default function CompetenceTable() {
  const [data, setData] = useState<Competence[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    for (const id of selectedIds) {
      try {
        await api.delete(`/competence/remove/${id}`);
      } catch (error) {
        console.error(`Erro ao deletar competência ${id}:`, error);
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
        const knowledgeAreasResponse = await api.get("/knowledge-area/list");
        
        if (knowledgeAreasResponse.status === 200) {
          const allCompetences: Competence[] = [];
          
          for (const area of knowledgeAreasResponse.data) {
            try {
              const competencesResponse = await api.get(`/knowledge-area/list/${area.id}/competences`);
              if (competencesResponse.status === 200) {
                const competencesWithAreaName = competencesResponse.data.map((competence: Competence) => ({
                  ...competence,
                  areaId: {
                    ...competence.areaId,
                    nome: area.nome
                  }
                }));
                allCompetences.push(...competencesWithAreaName);
              }
            } catch (error) {
              console.error(`Erro ao buscar competências da área ${area.id}:`, error);
            }
          }
          
          setData(allCompetences);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData().then(() => setUpdating(false));
  }, [updating, setUpdating, user]);

  const columnsWithCheckbox: ColumnDef<Competence>[] = [
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
              checked ? "Desmarcar competência" : "Selecionar competência"
            }
          />
        );
      },
      enableSorting: false,
    },
    ...CompetenceColumns.map((col) => {
      if ((col as ColumnDef<Competence>).id === "actions") {
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
                <EditCompetenceModal id={row.original.id} />
              </button>
              <button
                disabled={selectedIds.length > 0}
                className={
                  selectedIds.length > 0 ? "cursor-not-allowed opacity-50" : ""
                }
              >
                <DeleteModal
                  route="/competence/remove"
                  id={row.original.id}
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
                title="Excluir competências selecionadas"
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