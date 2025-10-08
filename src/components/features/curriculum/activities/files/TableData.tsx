import type { ColumnDef } from "@tanstack/react-table";
import DeleteModal from "../../../../utils/DataTable/DeleteModal";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../../../../ui/button";
import { EditActivityModal } from "../edit/ActivityEditModal";

export type Activity = {
  id: number;
  titulo: string;
  descricao: string;
  tipo: string;
  competenceId: number;
  competence: {
    id: number;
    nome?: string;
  };
  createdAt: string;
  updatedAt: string;
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
    accessorKey: "descricao",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Descrição
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const description = row.original.descricao;
      return (
        <div className="max-w-xs">
          <span className="truncate" title={description}>
            {description || "Sem descrição"}
          </span>
        </div>
      );
    },
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
    accessorKey: "competencie.nome",
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
      const competenceName = row.original.competence?.nome;
      return (
        <span>
          {competenceName || ` Sem registro `}
         {/* {competenceName || ` Sem registro {${row.original.competenceId}}`} */}

        </span>
      );
    },
  },
//   {
//     accessorKey: "createdAt",
//     header: ({ column }) => (
//       <Button
//         variant="ghost"
//         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//       >
//         Criado em
//         <ArrowUpDown className="ml-2 h-4 w-4" />
//       </Button>
//     ),
//     cell: ({ row }) => {
//       const date = new Date(row.original.createdAt);
//       return <span>{date.toLocaleDateString("pt-BR")}</span>;
//     },
//   },
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