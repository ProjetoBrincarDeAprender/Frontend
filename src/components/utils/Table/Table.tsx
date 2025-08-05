import React from "react";
import { useNavigate } from "react-router";
import "./Table.css";

import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table as TableShadcn,
} from "../../ui/table";

interface Column<T> {
  header: string;
  accessor:
    | keyof T
    | ((item: T, handleDetailsClick?: (item: T) => void) => React.ReactNode);
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  onDetailsClick?: (item: T) => void;
}

export function Table<T>({
  data,
  columns,
  className,
  onDetailsClick,
}: TableProps<T>) {
  const navigate = useNavigate();

  const handleDetailsClick = (item: T) => {
    if (onDetailsClick) {
      onDetailsClick(item);
    } else {
      // Navegação padrão para /profile/{id}
      const itemWithId = item as any;
      if (itemWithId.id) {
        navigate(`/profile/${itemWithId.id}`);
      }
    }
  };

  return (
    <div className={`table-container ${className ?? ""}`}>
      <TableShadcn className="custom-table">
        <TableHeader>
          <TableRow>
            {columns.map((col, idx) => (
              <TableHead
                key={idx}
                className={`table-header ${col.className ?? ""}`}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex} className="table-row">
              {columns.map((col, colIndex) => {
                const value =
                  typeof col.accessor === "function"
                    ? col.accessor(row, handleDetailsClick)
                    : (row[col.accessor] as React.ReactNode);

                return (
                  <TableCell
                    key={colIndex}
                    className={`table-cell ${col.className ?? ""}`}
                  >
                    {value}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </TableShadcn>
    </div>
  );
}
