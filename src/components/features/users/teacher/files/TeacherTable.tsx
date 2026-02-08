import { useTable } from "@/hooks/Table/useTable";
import { useUser } from "@/hooks/User/useUser";
//import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import {
  DataTable,
  DataTableFilter,
  type FilterState,
} from "../../../../utils/DataTable/DataTable";
import { TeacherColumns } from "./TableData";

import { SkeletonTable } from "@/components/ui/skeleton-table";
import DeleteModal from "@/components/utils/DataTable/DeleteModal";
import {
  TEACHER_QUERY_KEY,
  usePrefetchTeachers,
  useTeacher,
} from "@/hooks/Teacher/useTeacher";
import { useDelete } from "@/hooks/useDelete";
import type { FilterTeacherOption } from "@/types/filter";
import { Share2 } from "lucide-react";
import { EditTeacherModal } from "../edit/TeacherEditModal";

export default function TeacherTable() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { multiDeleteMutation } = useDelete({
    route: "/teacher/remove",
    entity: "Professor",
    queryKey: TEACHER_QUERY_KEY,
  });
  const { mutateAsync: deleteTeachers } = multiDeleteMutation;

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;

    await deleteTeachers(selectedIds);

    setSelectedIds([]);
    setUpdating(true);
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const { setUpdating } = useTable();
  const { user } = useUser();

  // Get pagination and filter params from URL
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const search = searchParams.get("search") || "";
  const searchBy = searchParams.get("searchBy") || "";

  // Build filter state from URL params
  const filter: FilterState | null =
    search && searchBy ? { column: searchBy, value: search } : null;

  const filters: FilterTeacherOption = {
    page,
    limit: pageSize as 10 | 25 | 50 | 100 | 500,
  };
  if (user?.perfil != "Admin") {
    filters.escolaId = user?.escolaId as number;
  }

  // Apply server-side filter from URL params
  if (filter) {
    filters.search = filter.value;
    filters.searchBy = filter.column as FilterTeacherOption["searchBy"];
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

  const { teachersQuery } = useTeacher({
    filters,
  });
  const { data: teachersReturn, isLoading, isFetching } = teachersQuery;
  const teachersData = teachersReturn?.data;

  // Prefetch next page
  const { prefetchTeachers } = usePrefetchTeachers();
  useEffect(() => {
    const totalPages = teachersReturn?.meta?.totalPages ?? 0;
    if (page < totalPages) {
      const nextPageFilters: FilterTeacherOption = {
        ...filters,
        page: page + 1,
      };
      prefetchTeachers(nextPageFilters);
    }
  }, [page, teachersReturn?.meta?.totalPages, filters, prefetchTeachers]);

  // Only show skeleton on initial load, not on refetch
  const showSkeleton = isLoading && !teachersReturn;

  // Handle pagination change
  const handlePaginationChange = (pagination: {
    pageIndex: number;
    pageSize: number;
  }) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", String(pagination.pageIndex + 1)); // Convert from 0-based to 1-based
    newParams.set("pageSize", String(pagination.pageSize));
    setSearchParams(newParams);
    setSelectedIds([]); // Clear selections on page change
  };

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
                className={`rounded-sm px-4 py-2 shadow-sm transition ${selectedIds.length > 0 ? "cursor-not-allowed bg-blue-300 opacity-50" : "bg-blue-400 hover:bg-blue-500"}`}
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
                  entity="Professor"
                  queryKey={TEACHER_QUERY_KEY}
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
      {showSkeleton ? (
        <SkeletonTable rows={6} cols={columnsWithCheckbox.length} />
      ) : (
        <div className={isFetching ? "opacity-60 transition-opacity" : ""}>
          <DataTable
            columns={columnsWithCheckbox}
            data={teachersData!}
            manualPagination
            pageCount={teachersReturn!.meta.totalPages}
            pagination={{
              pageIndex: page - 1, // Convert from 1-based to 0-based
              pageSize,
            }}
            onPaginationChange={handlePaginationChange}
            renderExtra={() => (
              <>
                <DataTableFilter
                  filterableColumns={["nome_completo", "email"]}
                  filter={filter}
                  onFilterChange={handleFilterChange}
                />
                {selectedIds.length > 0 && !isLoading && (
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
                )}
              </>
            )}
          />
        </div>
      )}
    </>
  );
}
