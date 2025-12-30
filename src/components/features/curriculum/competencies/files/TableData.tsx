import { ActionsCell } from "@/components/utils/DataTable/ActionsCell";
import {
  COMPETENCE_BY_KNOWLEDGE_AREA_QUERY_KEY,
  COMPETENCE_QUERY_KEY,
} from "@/hooks/Competence/useCompetence";
import type { Competence } from "@/types/competence";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../../../../ui/button";
import { EditCompetenceModal } from "../edit/CompetenceEditModal";

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export type CompetenceFormatted = Omit<Competence, "areaId"> & {
  area: {
    id: number;
    nome: string;
  };
};

export const CompetenceColumns: ColumnDef<CompetenceFormatted>[] = [
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
      const maxLength = 80;
      const description = row.original.descricao;
      return (
        <div className="max-w-100%">
          <span className="truncate" title={description || "Sem descrição"}>
            {truncateText(description || "Sem descrição", maxLength)}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "areaId.nome",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Área de Conhecimento
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const areaName = row.original.area.nome;
      return <span>{areaName || `Área ${row.original.area.id}`}</span>;
    },
  },
  // {
  //   accessorKey: "preRequisitos",
  //   header: "Pré-requisitos",
  //   cell: ({ row }) => {
  //     const prerequisites = row.original.preRequisitos;
  //     if (!prerequisites || prerequisites.length === 0) {
  //       return <span className="text-gray-500">Nenhum</span>;
  //     }
  //     return (
  //       <div className="max-w-xs">
  //         <span className="truncate" title={prerequisites.map(p => p.nome).join(", ")}>
  //           {prerequisites.length === 1
  //             ? prerequisites[0].nome
  //             : `${prerequisites[0].nome} (+${prerequisites.length - 1})`
  //           }
  //         </span>
  //       </div>
  //     );
  //   },
  //   enableSorting: false,
  // },
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
      <ActionsCell<CompetenceFormatted>
        row={row}
        route="/competence/remove"
        entity="Competência"
        queryKey={[
          ...COMPETENCE_QUERY_KEY,
          ...COMPETENCE_BY_KNOWLEDGE_AREA_QUERY_KEY,
        ]}
        editModal={<EditCompetenceModal id={row.original.id} />}
      />
    ),
    enableSorting: false,
  },
];
