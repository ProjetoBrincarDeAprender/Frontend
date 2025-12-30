import { ActionsCell } from "@/components/utils/DataTable/ActionsCell";
import { QUESTION_QUERY_KEY } from "@/hooks/Question/useQuestion";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../../../../ui/button";
import { QuestionViewModal } from "../view/QuestionViewModal";

export type QuestionFormatted = {
  id: number;
  content: string;
  ordem: number;
  activityId: number;
  usuarioCriadorId?: number | string;
  activity?: {
    id: number;
    titulo: string;
  };
  createdAt: string;
};

export const QuestionColumns: ColumnDef<QuestionFormatted>[] = [
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
  // {
  //   accessorKey: "content",
  //   header: ({ column }) => (
  //     <Button
  //       variant="ghost"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //     >
  //       Conteúdo
  //       <ArrowUpDown className="ml-2 h-4 w-4" />
  //     </Button>
  //   ),
  //   cell: ({ row }) => {
  //     const content = row.original.content;

  //     if (!content) {
  //       return (
  //         <div className="max-w-100%">
  //           <span className="text-gray-500">Sem conteúdo</span>
  //         </div>
  //       );
  //     }

  //     return (
  //       <div className="max-w-100%">
  //         <span className="block truncate" title={content}>
  //           {content}
  //         </span>
  //       </div>
  //     );
  //   },
  // },
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
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
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
        <div className="max-w-100%">
          <span
            className="block truncate"
            title={activityTitle || `Atividade ${row.original.activityId}`}
          >
            {activityTitle || `Atividade ${row.original.activityId}`}
          </span>
        </div>
      );
    },
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
      <ActionsCell<QuestionFormatted>
        row={row}
        route="/question/remove"
        entity="Questão"
        queryKey={QUESTION_QUERY_KEY}
        editModal={<QuestionViewModal id={row.original.id} />}
      />
    ),
    enableSorting: false,
  },
];
