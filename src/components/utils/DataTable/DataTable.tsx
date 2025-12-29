import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { DataTablePagination } from "./DataTablePagination";

export { DataTableFilter, type FilterState } from "./DataTableFilter";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  renderExtra?: () => React.ReactNode;
  pageCount?: number;
  pagination?: PaginationState;
  onPaginationChange?: (pagination: PaginationState) => void;
  manualPagination?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  renderExtra,
  pageCount,
  pagination: controlledPagination,
  onPaginationChange,
  manualPagination = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const [localPagination, setLocalPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const pagination = controlledPagination || localPagination;

  const table = useReactTable({
    data,
    pageCount: manualPagination ? pageCount : undefined,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      pagination,
    },
    manualPagination,
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

  return (
    <div>
      {renderExtra && (
        <div className="flex items-center gap-2 py-4">{renderExtra()}</div>
      )}
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
