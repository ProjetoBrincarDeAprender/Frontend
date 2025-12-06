import { Button } from "@/components/ui/button";
import DeleteModal from "@/components/utils/DataTable/DeleteModal";
import { RESPONSIBLE_QUERY_KEY } from "@/hooks/Responsible/useResponsible";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { EditResponsableModal } from "../edit/ResponsibleEditModal";

export type Responsible = {
  codigo_usuario: string;
  nome_completo: string;
  email: string;
  escola: string;
  parentesco: string;
};

export const ResponsibleColumns: ColumnDef<Responsible>[] = [
  {
    accessorKey: "codigo_usuario",
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
    accessorKey: "parentesco",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Parentesco
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-2">
        <EditResponsableModal id={+row.original.codigo_usuario} />
        <DeleteModal
          route="/responsible/remove"
          id={+row.original.codigo_usuario}
          entity="Responsável"
          queryKey={RESPONSIBLE_QUERY_KEY}
        />
      </div>
    ),
  },
];
