import {
  COMPETENCE_BY_KNOWLEDGE_AREA_QUERY_KEY,
  COMPETENCE_QUERY_KEY,
  useCompetence,
  usePrefetchCompetences,
} from "@/hooks/Competence/useCompetence";
import { useDelete } from "@/hooks/useDelete";
import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import {
  DataTable,
  DataTableFilter,
  type FilterState,
} from "../../../../utils/DataTable/DataTable";
import { CompetenceColumns, type CompetenceFormatted } from "./TableData";

import { SkeletonTable } from "@/components/ui/skeleton-table";
import { useKnowledgeArea } from "@/hooks/KnowledgeArea/useKnowledgeArea";
import type { FilterCompetenceOption } from "@/types/filter";

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

  const [searchParams, setSearchParams] = useSearchParams();

  // Get pagination and filter params from URL
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const search = searchParams.get("search") || "";
  const searchBy = searchParams.get("searchBy") || "";

  // Build filter state from URL params
  const filter: FilterState | null =
    search && searchBy ? { column: searchBy, value: search } : null;

  const filters: FilterCompetenceOption = {
    page,
    limit: pageSize as 10 | 25 | 50 | 100 | 500,
  };

  // Apply server-side filter from URL params
  if (filter) {
    filters.search = filter.value;
    filters.searchBy = filter.column as FilterCompetenceOption["searchBy"];
  }

  // Handle filter change - update URL params
  const handleFilterChange = (newFilter: FilterState | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (newFilter) {
      newParams.set("search", newFilter.value);
      newParams.set("searchBy", newFilter.column);
      newParams.set("page", "1"); // Reset to first page on filter
    } else {
      newParams.delete("search");
      newParams.delete("searchBy");
    }
    setSearchParams(newParams);
  };

  const { competencesQuery } = useCompetence({ filters });
  const { data: competencesReturn, isLoading: loading } = competencesQuery;
  const competencesData = competencesReturn?.data;

  // Prefetch next page
  const { prefetchCompetences } = usePrefetchCompetences();
  useEffect(() => {
    const totalPages = competencesReturn?.meta?.totalPages ?? 0;
    if (page < totalPages) {
      const nextPageFilters: FilterCompetenceOption = {
        ...filters,
        page: page + 1,
      };
      prefetchCompetences(nextPageFilters);
    }
  }, [page, competencesReturn?.meta?.totalPages, filters, prefetchCompetences]);

  const { knowledgeAreasQuery } = useKnowledgeArea();
  const { data: knowledgeAreasReturn, isLoading: isKnowledgeAreasLoading } =
    knowledgeAreasQuery;
  const knowledgeAreasData = knowledgeAreasReturn?.data;

  // Handle pagination change
  const handlePaginationChange = (pagination: {
    pageIndex: number;
    pageSize: number;
  }) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", String(pagination.pageIndex + 1));
    newParams.set("pageSize", String(pagination.pageSize));
    setSearchParams(newParams);
    setSelectedIds([]);
  };

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
    ...CompetenceColumns,
  ];

  return (
    <>
      {loading || isKnowledgeAreasLoading ? (
        <SkeletonTable rows={6} cols={columnsWithCheckbox.length} />
      ) : (
        <DataTable
          columns={columnsWithCheckbox}
          data={formattedCompetences ?? []}
          manualPagination
          pageCount={competencesReturn?.meta.totalPages}
          pagination={{
            pageIndex: page - 1,
            pageSize,
          }}
          onPaginationChange={handlePaginationChange}
          renderExtra={() => (
            <>
              <DataTableFilter
                filterableColumns={["nome", "descricao"]}
                filter={filter}
                onFilterChange={handleFilterChange}
              />
              {selectedIds.length > 0 && !loading && (
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
              )}
            </>
          )}
        />
      )}
    </>
  );
}
