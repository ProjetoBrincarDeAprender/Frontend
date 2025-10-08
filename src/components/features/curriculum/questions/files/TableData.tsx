import type { ColumnDef } from "@tanstack/react-table";
import DeleteModal from "../../../../utils/DataTable/DeleteModal";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../../../../ui/button";
import { EditQuestionModal } from "../edit/QuestionEditModal";

export type Question = {
  id: number;
  content: string;
  ordem: number;
  activityId: number;
  activity?: {
    id: number;
    titulo: string;
  };
  createdAt: string;
  updatedAt: string;
};

export const QuestionColumns: ColumnDef<Question>[] = [
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
    accessorKey: "content",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Conteúdo
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      let content = row.original.content;
      
      // Verificar se content existe e é string
      if (!content) {
        return (
          <div className="max-w-xs">
            <span className="text-gray-500">Sem conteúdo</span>
          </div>
        );
      }

      // Tentar fazer parse do JSON se for string
      try {
        if (typeof content === 'string') {
          const parsed = JSON.parse(content);
          if (parsed && typeof parsed === 'object') {
            content = parsed.texto || parsed.pergunta || parsed.question || parsed.content || content;
          }
        }
      } catch {
        // Se não for JSON válido, usa o conteúdo original
      }
      
      return (
        <div className="max-w-xs">
          <span className="truncate" title={String(content)}>
            {String(content)}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "ordem",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Ordem
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const ordem = row.original.ordem;
      return (
        <div className="text-center">
          <span>
            {ordem}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "activity.titulo",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Atividade
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const activityTitle = row.original.activity?.titulo;
      return (
        <div className="max-w-xs">
          <span className="truncate" title={activityTitle || `Atividade ${row.original.activityId}`}>
            {activityTitle || `Atividade ${row.original.activityId}`}
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
        <EditQuestionModal id={row.original.id} />
        <DeleteModal
          route="/question/remove"
          id={row.original.id}
        />
      </div>
    ),
    enableSorting: false,
  },
];