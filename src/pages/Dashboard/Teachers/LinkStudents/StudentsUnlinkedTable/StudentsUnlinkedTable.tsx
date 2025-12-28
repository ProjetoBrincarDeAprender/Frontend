import { SkeletonTable } from "@/components/ui/skeleton-table";
import {
  DataTable,
  type FilterState,
} from "@/components/utils/DataTable/DataTable";
import {
  usePrefetchStudents,
  useStudentsRelations,
} from "@/hooks/Student/useStudent";
import {
  usePrefetchTeachers,
  useTeacherRelations,
} from "@/hooks/Teacher/useTeacher";
import type { FilterStudentRelationsOption } from "@/types/filter";
import type { Student } from "@/types/student";
import type { Teacher } from "@/types/teacher";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";

type Props = {
  selectedIds: number[];
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
  teacherData: Teacher;
};

export function StudentsUnlinkedTable({
  selectedIds,
  setSelectedIds,
  teacherData,
}: Props) {
  const [data, setData] = useState<Student[] | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const search = searchParams.get("search") || "";
  const searchBy = searchParams.get("searchBy") || "";

  const filter: FilterState | null = useMemo(
    () => (search && searchBy ? { column: searchBy, value: search } : null),
    [search, searchBy],
  );

  const baseFilters: FilterStudentRelationsOption = useMemo(() => {
    const filters: FilterStudentRelationsOption = {
      escolaId: Number(teacherData.escolaId),
      page,
      limit: pageSize as 10 | 25 | 50 | 100 | 500,
    };

    // Apply server-side filter from URL params
    if (filter) {
      filters.search = filter.value;
      filters.searchBy =
        filter.column as FilterStudentRelationsOption["searchBy"];
    }

    return filters;
  }, [teacherData.escolaId, page, pageSize, filter]);

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

  // Handle pagination change
  const handlePaginationChange = (pagination: {
    pageIndex: number;
    pageSize: number;
  }) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", String(pagination.pageIndex + 1));
    newParams.set("pageSize", String(pagination.pageSize));
    setSearchParams(newParams);
  };

  const { teacherRelationsQuery } = useTeacherRelations({
    teacherId: Number(teacherData.codigo_usuario),
    filters: { ...baseFilters },
  });
  const { data: linkedStudentsReturn, isLoading: isTeacherRelationsLoading } =
    teacherRelationsQuery;
  const linkedStudentsData = linkedStudentsReturn?.data;

  const { studentsByRelationQuery } = useStudentsRelations({
    type: "teacher",
    filters: { ...baseFilters, isNull: true },
  });
  const {
    data: unlinkedStudentsReturn,
    isLoading: isStudentsByRelationLoading,
  } = studentsByRelationQuery;
  const unlinkedStudentsData = unlinkedStudentsReturn?.data;

  // Calculate total pages from both queries
  const totalPages = Math.max(
    unlinkedStudentsReturn?.meta?.totalPages ?? 0,
    linkedStudentsReturn?.meta?.totalPages ?? 0,
  );

  // Prefetch next page
  const { prefetchStudentsRelations } = usePrefetchStudents();
  const { prefetchTeacherRelations } = usePrefetchTeachers();
  useEffect(() => {
    if (page < totalPages) {
      const nextPageFilters: FilterStudentRelationsOption = {
        ...baseFilters,
        page: page + 1,
      };
      // Prefetch unlinked students
      prefetchStudentsRelations("teacher", {
        ...nextPageFilters,
        isNull: true,
      });
      // Prefetch linked students
      prefetchTeacherRelations(
        Number(teacherData.codigo_usuario),
        nextPageFilters,
      );
    }
  }, [
    page,
    totalPages,
    baseFilters,
    prefetchStudentsRelations,
    prefetchTeacherRelations,
    teacherData.codigo_usuario,
  ]);

  useEffect(() => {
    if (!isTeacherRelationsLoading && !isStudentsByRelationLoading) {
      setData([...(linkedStudentsData ?? []), ...(unlinkedStudentsData ?? [])]);
    }
  }, [
    isTeacherRelationsLoading,
    isStudentsByRelationLoading,
    unlinkedStudentsData,
    linkedStudentsData,
  ]);

  useEffect(() => {
    if (linkedStudentsData && linkedStudentsData.length > 0) {
      const linkedIds = linkedStudentsData.map((student) =>
        Number(student.codigo_usuario),
      );
      setSelectedIds((prev) => {
        if (prev.length === 0) {
          return linkedIds;
        }
        return prev;
      });
    }
  }, [linkedStudentsData, setSelectedIds]);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: "codigo_usuario",
      header: ({ column }: { column: any }) => (
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 text-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "nome_completo",
      header: ({ column }: { column: any }) => (
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 text-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome Completo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "email",
      header: ({ column }: { column: any }) => (
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 text-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "escola",
      header: ({ column }: { column: any }) => (
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 text-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Escola
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      ),
      enableSorting: true,
    },
    {
      id: "vinculo",
      header: "Vínculo",
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(Number(row.original.codigo_usuario))}
          onChange={() => toggleSelect(Number(row.original.codigo_usuario))}
        />
      ),
      enableSorting: false,
      enableColumnFilter: false,
    },
  ];

  return (
    <>
      {isStudentsByRelationLoading || isTeacherRelationsLoading ? (
        <SkeletonTable rows={6} cols={columns.length} />
      ) : (
        <DataTable
          columns={columns}
          data={
            data?.map((item) => ({
              ...item,
              id: String(item.codigo_usuario),
            })) ?? []
          }
          manualPagination
          pageCount={totalPages}
          pagination={{
            pageIndex: page - 1,
            pageSize,
          }}
          onPaginationChange={handlePaginationChange}
          filterableColumns={["nome_completo", "email"]}
          filter={filter}
          onFilterChange={handleFilterChange}
          manualFiltering
        />
      )}
    </>
  );
}
