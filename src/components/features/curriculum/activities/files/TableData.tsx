import type { ColumnDef } from "@tanstack/react-table";
import DeleteModal from "../../../../utils/DataTable/DeleteModal";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../../../../ui/button";
import { EditActivityModal } from "../edit/ActivityEditModal";

export type Activity = {
  id: number;
  titulo: string;
  tipo: string;
  // competenceId: {
  //   id: number;
  // };
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
  // competencia_id?: number;
  // nivel_dificuldade_inicial: number;
  deleted: boolean;
  deletedBy?: number;
  deleted_At?: string;
  // competencia?: {
  //   id: number;
  //   nome: string;
  // };
  // nivelDificuldade?: {
  //   id: number;
  //   nome: string;
  // };
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
  // {
  //   accessorKey: "competenceId.nome",
  //   header: ({ column }) => (
  //     <Button
  //       variant="ghost"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //     >
  //       Competência
  //       <ArrowUpDown className="ml-2 h-4 w-4" />
  //     </Button>
  //   ),
  //   cell: ({ row }) => {
  //     const competencia = row.original.competenciaId;
  //     const competenceName = competencia?.nome || competencia?.nome || "Sem competência";

  // return <span>{competenceName}</span>;
  //   },
  // },
  // {
  //   accessorKey: "initialDifficulty.nome",
  //   header: ({ column }) => (
  //     <Button
  //       variant="ghost"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //     >
  //       Nível de Dificuldade
  //       <ArrowUpDown className="ml-2 h-4 w-4" />
  //     </Button>
  //   ),
  //   cell: ({ row }) => {
  //     const nivel = row.original.nivel_dificuldadeId;
  //     const nivelName = nivel?.nome || nivel?.nome || "Sem nível definido";

  //     return <span>{nivelName}</span>;
  //   },
  // },
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