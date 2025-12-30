import { ActionsCell } from "@/components/utils/DataTable/ActionsCell";
import { ACTIVITY_QUERY_KEY } from "@/hooks/Activity/useActivity";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../../../../ui/button";
import { EditActivityModal } from "../edit/ActivityEditModal";

export type Activity = {
  id: number;
  titulo: string;
  tipo: string;
  usuarioCriadorId?: number | string;
  escolaId?: number | null;
  nivel_dificuldadeId: {
    id: number;
    nome: string;
  };
  created_At: string;
  updated_At: string;
  competenciaId: {
    id: number;
    nome: string;
  };
  deleted: boolean;
  deletedBy?: number;
  deleted_At?: string;
};

export const ActivityColumns: ColumnDef<Activity>[] = [
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
    accessorKey: "titulo",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Título
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "tipo",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Tipo
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "usuarioCriadorId",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Criador (ID)
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const criadorId = row.original.usuarioCriadorId;
      return <span>{criadorId ?? "N/A"}</span>;
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => (
      <ActionsCell<Activity>
        row={row}
        route="/activity/remove"
        entity="Atividade"
        queryKey={ACTIVITY_QUERY_KEY}
        editModal={<EditActivityModal id={row.original.id} />}
      />
    ),
    enableSorting: false,
  },
];
