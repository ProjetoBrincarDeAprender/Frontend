import {
  COMPETENCE_BY_KNOWLEDGE_AREA_QUERY_KEY,
  COMPETENCE_QUERY_KEY,
  useCompetence,
} from "@/hooks/Competence/useCompetence";
import { useDelete } from "@/hooks/useDelete";
import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { DataTable } from "../../../../utils/DataTable/DataTable";
import { CompetenceColumns, type CompetenceFormatted } from "./TableData";

import { SkeletonTable } from "@/components/ui/skeleton-table";
import DeleteModal from "@/components/utils/DataTable/DeleteModal";
import { useKnowledgeArea } from "@/hooks/KnowledgeArea/useKnowledgeArea";
import type { Competence } from "@/types/competence";
import { EditCompetenceModal } from "../edit/CompetenceEditModal";

interface CellContext {
  row: {
    original: CompetenceFormatted;
  };
}

export default function CompetenceTable() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { multiDeleteMutation } = useDelete({
    route: "/competence/remove",
    entity: "Competência",
    queryKey: [
      ...COMPETENCE_QUERY_KEY,
      ...COMPETENCE_BY_KNOWLEDGE_AREA_QUERY_KEY,
    ],
  });
  const { mutateAsync: deleteCompetences } = multiDeleteMutation;

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    await deleteCompetences(selectedIds);
    setSelectedIds([]);
  };

  const [searchParams, _] = useSearchParams();

  const { competencesQuery } = useCompetence({});
  const { data: competencesData, isLoading: loading } = competencesQuery;

  const { knowledgeAreasQuery } = useKnowledgeArea();
  const { data: knowledgeAreasData, isLoading: isKnowledgeAreasLoading } =
    knowledgeAreasQuery;

  const [formattedCompetences, setFormattedCompetences] = useState<
    CompetenceFormatted[]
  >([]);

  useEffect(() => {
    if (competencesData && knowledgeAreasData) {
      const knowledgeAreaMap = new Map<number, string>();
      knowledgeAreasData.forEach((area) => {
        knowledgeAreaMap.set(area.id, area.nome);
      });

      const formattedCompetences = competencesData.map((competence) => ({
        ...competence,
        area: {
          id: competence.areaId,
          nome: knowledgeAreaMap.get(competence.areaId) || "Desconhecida",
        },
      }));

      console.log(formattedCompetences);

      setFormattedCompetences(formattedCompetences);
    }
  }, [competencesData, knowledgeAreasData]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       const knowledgeAreasResponse = await api.get("/knowledge-area/list");

  //       if (knowledgeAreasResponse.status === 200) {
  //         const allCompetences: Competence[] = [];

  //         for (const area of knowledgeAreasResponse.data) {
  //           try {
  //             const competencesResponse = await api.get(
  //               `/knowledge-area/list/${area.id}/competences`,
  //             );
  //             if (competencesResponse.status === 200) {
  //               const competencesWithAreaName = competencesResponse.data.map(
  //                 (competence: Competence) => ({
  //                   ...competence,
  //                   areaId: {
  //                     ...competence.areaId,
  //                     nome: area.nome,
  //                   },
  //                 }),
  //               );
  //               allCompetences.push(...competencesWithAreaName);
  //             }
  //           } catch (error) {
  //             console.error(
  //               `Erro ao buscar competências da área ${area.id}:`,
  //               error,
  //             );
  //           }
  //         }

  //         setData(allCompetences);
  //       }
  //     } catch (error) {
  //       console.error("Erro ao buscar dados:", error);
  //       setData([]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData().then(() => setUpdating(false));
  // }, [updating, setUpdating, user]);

  const columnsWithCheckbox: ColumnDef<CompetenceFormatted>[] = [
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
                  entity="Competência"
                  queryKey={COMPETENCE_QUERY_KEY}
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
      {loading || isKnowledgeAreasLoading ? (
        <SkeletonTable rows={6} cols={columnsWithCheckbox.length} />
      ) : (
        <DataTable
          columns={columnsWithCheckbox}
          data={formattedCompetences ?? []}
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
