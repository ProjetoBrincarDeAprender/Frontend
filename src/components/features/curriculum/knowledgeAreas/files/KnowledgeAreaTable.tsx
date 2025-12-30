import { SkeletonTable } from "@/components/ui/skeleton-table";
import {
  KNOWLEDGE_AREA_QUERY_KEY,
  useKnowledgeArea,
  usePrefetchKnowledgeAreas,
} from "@/hooks/KnowledgeArea/useKnowledgeArea";
import { useTable } from "@/hooks/Table/useTable";
import { useDelete } from "@/hooks/useDelete";
import type { FilterKnowledgeAreaOption } from "@/types/filter";
import type { KnowledgeArea } from "@/types/knowledgeArea";
import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import {
  DataTable,
  DataTableFilter,
  type FilterState,
} from "../../../../utils/DataTable/DataTable";
import { KnowledgeAreaColumns } from "./TableData";

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

  const [searchParams, setSearchParams] = useSearchParams();
  const { setUpdating } = useTable();

  // Get pagination and filter params from URL
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const search = searchParams.get("search") || "";
  const searchBy = searchParams.get("searchBy") || "";

  // Build filter state from URL params
  const filter: FilterState | null =
    search && searchBy ? { column: searchBy, value: search } : null;

  const filters: FilterKnowledgeAreaOption = useMemo(() => {
    const baseFilters: FilterKnowledgeAreaOption = {
      page,
      limit: pageSize as 10 | 25 | 50 | 100 | 500,
    };

    // Apply server-side filter from URL params
    if (filter) {
      baseFilters.search = filter.value;
      baseFilters.searchBy =
        filter.column as FilterKnowledgeAreaOption["searchBy"];
    }

    return baseFilters;
  }, [page, pageSize, filter]);

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

  const { knowledgeAreasQuery } = useKnowledgeArea({ filters });
  const { data: knowledgeAreasReturn, isLoading: loading } =
    knowledgeAreasQuery;
  const knowledgeAreasData = knowledgeAreasReturn?.data;

  // Prefetch next page
  const { prefetchKnowledgeAreas } = usePrefetchKnowledgeAreas();
  useEffect(() => {
    const totalPages = knowledgeAreasReturn?.meta?.totalPages ?? 0;
    if (page < totalPages) {
      const nextPageFilters: FilterKnowledgeAreaOption = {
        ...filters,
        page: page + 1,
      };
      prefetchKnowledgeAreas(nextPageFilters);
    }
  }, [
    page,
    knowledgeAreasReturn?.meta?.totalPages,
    filters,
    prefetchKnowledgeAreas,
  ]);

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
    ...KnowledgeAreaColumns,
  ];

  return (
    <>
      {loading ? (
        <SkeletonTable rows={6} cols={columnsWithCheckbox.length} />
      ) : (
        <DataTable
          columns={columnsWithCheckbox}
          data={knowledgeAreasData ?? []}
          manualPagination
          pageCount={knowledgeAreasReturn?.meta.totalPages}
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
              )}
            </>
          )}
        />
      )}
    </>
  );
}
