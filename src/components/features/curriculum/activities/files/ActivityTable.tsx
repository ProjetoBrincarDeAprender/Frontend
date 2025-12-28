import useActivity, { ACTIVITY_QUERY_KEY } from "@/hooks/Activity/useActivity";
import { useTable } from "@/hooks/Table/useTable";
import { useUser } from "@/hooks/User/useUser";
import { useDelete } from "@/hooks/useDelete";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import {
  DataTable,
  type FilterState,
} from "../../../../utils/DataTable/DataTable";
import { ActivityColumns } from "./TableData";

import { SkeletonTable } from "@/components/ui/skeleton-table";
import DeleteModal from "@/components/utils/DataTable/DeleteModal";
import type { Activity } from "@/types/activity";
import type { FilterActivityOption } from "@/types/filter";
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

  const filters: FilterActivityOption = {
    page,
    limit: pageSize as 10 | 25 | 50 | 100 | 500,
    escolaId: user?.perfil === "Professor" ? user.escolaId! : undefined,
  };

  // Apply server-side filter from URL params
  if (filter) {
    filters.search = filter.value;
    filters.searchBy = filter.column as FilterActivityOption["searchBy"];
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

  const { activitiesQuery } = useActivity({ filters });
  const { data: allActivities, isLoading: loading } = activitiesQuery;

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

  const filteredData = useMemo(() => {
    if (!allActivities?.data) return [];

    if (user?.perfil === "Professor") {
      const userEscolaId = user?.escolaId;

      return allActivities.data.filter((activity) => {
        // Mostrar apenas atividades da mesma escola
        if (userEscolaId && activity.escolaId === userEscolaId) {
          return true;
        }

        return false;
      });
    }

    return allActivities.data;
  }, [allActivities, user]);

  const columnsWithCheckbox = [
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
          cell: ({ row }: CellContext) => {
            const isOwner =
              user?.perfil === "Admin" ||
              String(row.original.usuarioCriadorId) === user?.codigo_usuario;
            const isDisabled = selectedIds.length > 0 || !isOwner;

            return (
              <div className="flex items-center justify-center gap-2">
                <button
                  disabled={isDisabled}
                  className={isDisabled ? "cursor-not-allowed opacity-50" : ""}
                  title={
                    !isOwner
                      ? "Você não pode editar atividades de outros usuários"
                      : ""
                  }
                >
                  <EditActivityModal id={row.original.id} />
                </button>
                <button
                  disabled={isDisabled}
                  className={isDisabled ? "cursor-not-allowed opacity-50" : ""}
                  title={
                    !isOwner
                      ? "Você não pode excluir atividades de outros usuários"
                      : ""
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
            );
          },
        };
      }
      return col;
    }),
  ] as ColumnDef<Activity>[];

  return (
    <>
      {loading ? (
        <SkeletonTable rows={6} cols={columnsWithCheckbox.length} />
      ) : (
        <DataTable
          columns={columnsWithCheckbox}
          data={filteredData ?? []}
          manualPagination
          pageCount={allActivities?.meta.totalPages}
          pagination={{
            pageIndex: page - 1,
            pageSize,
          }}
          onPaginationChange={handlePaginationChange}
          filterableColumns={["titulo", "tipo"]}
          filter={filter}
          onFilterChange={handleFilterChange}
          manualFiltering
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
