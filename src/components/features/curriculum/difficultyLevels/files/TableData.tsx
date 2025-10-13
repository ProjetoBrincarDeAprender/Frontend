import type { ColumnDef } from "@tanstack/react-table";
import DeleteModal from "../../../../utils/DataTable/DeleteModal";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../../../../ui/button";
import { EditDifficultyLevelModal } from "../edit/DifficultyLevelEditModal";

export type DifficultyLevel = {
  id: number;
  nome: string;
  descricao: string;
  nivel: number;
  createdAt: string;
  updatedAt: string;
};

export const DifficultyLevelColumns: ColumnDef<DifficultyLevel>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "nome",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Nome
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-2">
        <EditDifficultyLevelModal id={row.original.id} />
        <DeleteModal
          route="/difficulty-level/remove"
          id={row.original.id}
        />
      </div>
    ),
    enableSorting: false,
  },
];