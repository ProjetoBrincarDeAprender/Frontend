import { KNOWLEDGE_AREA_QUERY_KEY } from "@/hooks/KnowledgeArea/useKnowledgeArea";
import type { KnowledgeArea } from "@/types/knowledgeArea";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../../../../ui/button";
import DeleteModal from "../../../../utils/DataTable/DeleteModal";
import { EditKnowledgeAreaModal } from "../edit/KnowledgeAreaEditModal";

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
          entity="Área de Conhecimento"
          queryKey={KNOWLEDGE_AREA_QUERY_KEY}
        />
      </div>
    ),
    enableSorting: false,
  },
];
