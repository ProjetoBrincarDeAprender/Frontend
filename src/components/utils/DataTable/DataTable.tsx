import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";

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
import { useState, useMemo } from "react";
import { DataTablePagination } from "./DataTablePagination";

// Função para filtro customizado que trata IDs de forma diferente
const customFilterFn = (row: any, columnId: string, filterValue: string) => {
  const cellValue = row.getValue(columnId);

  // Se não há valor de filtro, mostrar tudo
  if (!filterValue) return true;

  // Para colunas de ID, fazer busca "começa com"
  if (columnId === "id" || columnId.toLowerCase().includes("id")) {
    const idString = String(cellValue || "");
    const searchString = String(filterValue);
    return idString.includes(searchString);
  }

  // Para outras colunas, fazer busca case-insensitive "contém"
  const stringValue = String(cellValue || "").toLowerCase();
  const searchValue = filterValue.toLowerCase();
  return stringValue.includes(searchValue);
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  page?: number;
  renderExtra?: () => React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  renderExtra,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Detectar colunas disponíveis automaticamente
  const availableColumns = useMemo(() => {
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
  }, [columns]);

  const [selectedColumn, setSelectedColumn] = useState<string>(
    availableColumns[0] || "id",
  );

  // Modificar colunas para usar filtro customizado
  const columnsWithCustomFilter = useMemo(() => {
    return columns.map((col) => {
      const colDef = col as ColumnDef<TData, TValue> & {
        accessorKey?: string;
        id?: string;
      };

      const columnId = colDef.accessorKey || colDef.id;

      // Para colunas de ID, aplicar filtro customizado
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
    columns: columnsWithCustomFilter,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    filterFns: {
      customFilter: customFilterFn,
    },
    state: {
      sorting,
      columnFilters,
    },
  });
  const columnExists = table.getColumn(selectedColumn);
  const effectiveSelectedColumn = columnExists
    ? selectedColumn
    : availableColumns[0];
  const getColumnDisplayName = (columnId: string) => {
    const columnMap: Record<string, string> = {
      id: "ID",
      titulo: "Título",
      nome: "Nome",
      email: "Email",
      tipo: "Tipo",
      descricao: "Descrição",
      content: "Conteúdo",
      ordem: "Ordem",
      "activity.titulo": "Atividade",
      "competencia.nome": "Competência",
      "nivelDificuldade.nome": "Nível",
      "areaId.nome": "Área",
      created_At: "Criado em",
      createdAt: "Criado em",
    };

    return (
      columnMap[columnId] ||
      columnId.charAt(0).toUpperCase() + columnId.slice(1).replace(/[._]/g, " ")
    );
  };

  return (
    <div>
      <div className="flex items-center gap-2 py-4">
        <Input
          placeholder={`Filtrar por ${getColumnDisplayName(effectiveSelectedColumn)}`}
          value={
            (table
              .getColumn(effectiveSelectedColumn)
              ?.getFilterValue() as string) ?? ""
          }
          onChange={(event) => {
            if (effectiveSelectedColumn) {
              const filterValue = event.target.value;

              table.setColumnFilters([
                {
                  id: effectiveSelectedColumn,
                  value: filterValue,
                },
              ]);
            }
          }}
          className="max-h-10 max-w-64"
        />
        <Select
          onValueChange={(value) => {
            setSelectedColumn(value);
            table.resetColumnFilters();
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
