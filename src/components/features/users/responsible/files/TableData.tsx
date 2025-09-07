import type { ColumnDef } from "@tanstack/react-table";
// import { Edit } from "lucide-react";
import DeleteModal from "@/components/utils/DataTable/DeleteModal";
// import { Link } from "../utils/Link/Link";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { EditResponsableModal } from "../edit/ResponsibleEditModal";

export type Responsible = {
  id: string;
  nome_completo: string;
  email: string;
  escola: string;
};

export const ResponsibleColumns: ColumnDef<Responsible>[] = [
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
    accessorKey: "nome_completo",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Nome Completo
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "escola",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Escola
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-2">
        <EditResponsableModal id={+row.original.id} />
        <DeleteModal route="/user/remove" id={+row.original.id} />
      </div>
    ),
  },
];
