import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DataTablePagination } from "./DataTablePagination";

const columnDisplayNames: Record<string, string> = {
  id: "ID",
  titulo: "Título",
  nome: "Nome",
  nome_completo: "Nome Completo",
  email: "Email",
  tipo: "Tipo",
  descricao: "Descrição",
  content: "Conteúdo",
  ordem: "Ordem",
  "activity.titulo": "Atividade",
  "competencia.nome": "Competência",
  "nivelDificuldade.nome": "Nível",
  "areaId.nome": "Área",
  "area.nome": "Área",
  created_At: "Criado em",
  createdAt: "Criado em",
  data_nascimento: "Data de Nascimento",
  perfil: "Perfil",
  escolaId: "Escola",
  codigo_usuario: "Código",
};

const getColumnDisplayName = (columnId: string) => {
  return (
    columnDisplayNames[columnId] ||
    columnId.charAt(0).toUpperCase() + columnId.slice(1).replace(/[._]/g, " ")
  );
};

const customFilterFn = (row: any, columnId: string, filterValue: string) => {
  const cellValue = row.getValue(columnId);

  if (!filterValue) return true;

  if (columnId === "id" || columnId.toLowerCase().includes("id")) {
    const idString = String(cellValue || "");
    const searchString = String(filterValue);
    return idString.includes(searchString);
  }

  const stringValue = String(cellValue || "").toLowerCase();
  const searchValue = filterValue.toLowerCase();
  return stringValue.includes(searchValue);
};

export type FilterState = {
  column: string;
  value: string;
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  renderExtra?: () => React.ReactNode;
  pageCount?: number;
  pagination?: PaginationState;
  onPaginationChange?: (pagination: PaginationState) => void;
  manualPagination?: boolean;
  filterableColumns?: string[];
  filter?: FilterState | null;
  onFilterChange?: (filter: FilterState | null) => void;
  manualFiltering?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  renderExtra,
  pageCount,
  pagination: controlledPagination,
  onPaginationChange,
  manualPagination = false,
  filterableColumns,
  filter: controlledFilter,
  onFilterChange,
  manualFiltering = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [filterInputValue, setFilterInputValue] = useState(
    controlledFilter?.value ?? "",
  );
  const [selectedColumn, setSelectedColumn] = useState<string>(
    controlledFilter?.column ?? "",
  );

  useEffect(() => {
    setFilterInputValue(controlledFilter?.value ?? "");
    if (controlledFilter?.column) {
      setSelectedColumn(controlledFilter.column);
    }
  }, [controlledFilter]);

  const [localPagination, setLocalPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const pagination = controlledPagination || localPagination;

  const availableColumns = useMemo(() => {
    if (filterableColumns && filterableColumns.length > 0) {
      return filterableColumns;
    }

    const cols = columns
      .map((col) => {
        const colDef = col as ColumnDef<TData, TValue> & {
          accessorKey?: string;
          id?: string;
        };
        return colDef.accessorKey || colDef.id;
      })
      .filter(
        (id): id is string =>
          Boolean(id) && id !== "actions" && id !== "select",
      );

    return cols;
  }, [columns, filterableColumns]);

  const effectiveSelectedColumn = selectedColumn || availableColumns[0] || "id";

  const columnsWithCustomFilter = useMemo(() => {
    return columns.map((col) => {
      const colDef = col as ColumnDef<TData, TValue> & {
        accessorKey?: string;
        id?: string;
      };

      const columnId = colDef.accessorKey || colDef.id;

      if (
        columnId === "id" ||
        (columnId && columnId.toLowerCase().includes("id"))
      ) {
        return {
          ...col,
          filterFn: customFilterFn,
        };
      }

      return col;
    });
  }, [columns]);

  const table = useReactTable({
    data,
    pageCount: manualPagination ? pageCount : undefined,
    columns: columnsWithCustomFilter,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: manualFiltering ? undefined : getFilteredRowModel(),
    // Pagination configuration
    filterFns: {
      customFilter: customFilterFn,
    },
    state: {
      sorting,
      columnFilters: manualFiltering ? [] : columnFilters,
      pagination,
    },
    manualPagination,
    manualFiltering,
    onPaginationChange: (updaterOrValue) => {
      const newPagination =
        typeof updaterOrValue === "function"
          ? updaterOrValue(pagination)
          : updaterOrValue;

      if (onPaginationChange) {
        onPaginationChange(newPagination);
      } else {
        setLocalPagination(newPagination);
      }
    },
  });

  const handleApplyFilter = () => {
    if (manualFiltering && onFilterChange) {
      if (filterInputValue.trim()) {
        const newFilter = {
          column: effectiveSelectedColumn,
          value: filterInputValue.trim(),
        };
        onFilterChange(newFilter);
      }
    }
  };

  const handleClearFilter = () => {
    setFilterInputValue("");
    if (manualFiltering && onFilterChange) {
      onFilterChange(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && manualFiltering) {
      handleApplyFilter();
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 py-4">
        <Input
          placeholder={`Filtrar por ${getColumnDisplayName(effectiveSelectedColumn)}`}
          value={
            manualFiltering
              ? filterInputValue
              : ((table
                  .getColumn(effectiveSelectedColumn)
                  ?.getFilterValue() as string) ?? "")
          }
          onChange={(event) => {
            const newValue = event.target.value;
            if (manualFiltering) {
              setFilterInputValue(newValue);
            } else {
              // Client-side filtering
              if (effectiveSelectedColumn) {
                table.setColumnFilters([
                  {
                    id: effectiveSelectedColumn,
                    value: newValue,
                  },
                ]);
              }
            }
          }}
          onKeyDown={handleKeyDown}
          className="max-h-10 max-w-64"
        />
        <Select
          onValueChange={(value) => {
            setSelectedColumn(value);
            if (!manualFiltering) {
              table.resetColumnFilters();
            }
          }}
          value={effectiveSelectedColumn}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Selecione uma coluna" />
          </SelectTrigger>
          <SelectContent>
            {availableColumns.map((columnId) => (
              <SelectItem key={columnId} value={columnId}>
                {getColumnDisplayName(columnId)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {manualFiltering && (
          <>
            <Button
              variant="default"
              size="lg"
              onClick={handleApplyFilter}
              disabled={!filterInputValue.trim()}
            >
              <Search className="h-4 w-4" />
              Filtrar
            </Button>
            {(controlledFilter || filterInputValue) && (
              <Button variant="outline" size="lg" onClick={handleClearFilter}>
                <X className="h-4 w-4" />
                Limpar
              </Button>
            )}
          </>
        )}
        {renderExtra && renderExtra()}
      </div>
      <div className="w-full overflow-hidden overflow-x-auto rounded-md border">
        <Table className="custom-table bg-blue-50">
          <TableHeader className="bg-blue-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="table-header text-center"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="table-row"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="table-cell text-center">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum dado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
