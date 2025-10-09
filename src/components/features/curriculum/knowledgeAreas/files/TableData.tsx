import type { ColumnDef } from "@tanstack/react-table";
import DeleteModal from "../../../../utils/DataTable/DeleteModal";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../../../../ui/button";
import { EditKnowledgeAreaModal } from "../edit/KnowledgeAreaEditModal";

export type KnowledgeArea = {
  id: number;
  nome: string;
  descricao?: string;
  createdAt: string;
  updatedAt: string;
};

export const KnowledgeAreaColumns: ColumnDef<KnowledgeArea>[] = [
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
        <EditKnowledgeAreaModal id={row.original.id} />
        <DeleteModal
          route="/knowledge-area/remove"
          id={row.original.id}
        />
      </div>
    ),
    enableSorting: false,
  },
];