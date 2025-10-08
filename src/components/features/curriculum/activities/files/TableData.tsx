import type { ColumnDef } from "@tanstack/react-table";
import DeleteModal from "../../../../utils/DataTable/DeleteModal";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../../../../ui/button";
import { EditActivityModal } from "../edit/ActivityEditModal";

export type Activity = {
  id: number;
  titulo: string;
  tipo: string;
  competenciaId: {
    id: number;
  };
  nivel_dificuldadeId: {
    id: number;
  };
  created_At: string;
  updated_At: string;
  competencia_id: number;
  nivel_dificuldade_inicial: number;
  deleted: boolean;
  deletedBy?: number;
  deleted_At?: string;
  competencia: {
    id: number;
    name: string;
  };
  nivelDificuldade?: {
    id: number;
    name: string;
  };
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
    accessorKey: "competencia.nome",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Competência
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const competenceName = row.original.competencia?.name;
      const competenciaId = row.original.competenciaId?.id || row.original.competencia_id;
      
      return (
        <div className="max-w-xs">
          <span className="truncate" title={competenceName || `Competência ${competenciaId}`}>
            {competenceName || `Competência ${competenciaId}`}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "nivelDificuldade.name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Nível de Dificuldade
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const nivelName = row.original.nivelDificuldade?.name;
      const nivelId = row.original.nivel_dificuldadeId?.id || row.original.nivel_dificuldade_inicial;
      
      return (
        <div className="max-w-xs">
          <span className="truncate" title={nivelName || `Nível ${nivelId}`}>
            {nivelName || `Nível ${nivelId}`}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-2">
        <EditActivityModal id={row.original.id} />
        <DeleteModal
          route="/activity/remove"
          id={row.original.id}
        />
      </div>
    ),
    enableSorting: false,
  },
];