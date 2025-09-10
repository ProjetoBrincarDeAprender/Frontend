import type { ColumnDef } from "@tanstack/react-table";
// import { Edit, Import } from "lucide-react";
import DeleteModal from "../../../../utils/DataTable/DeleteModal";
// import { Link } from "../utils/Link/Link";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../../../../ui/button";
import { EditStudentModal } from "../edit/StudentEditModal";

export type Student = {
  codigo_usuario: string;
  nome_completo: string;
  email: string;
  perfil: string;
  escola: string | null;
  created_ad: string;
  data_nascimento: string | null;
  avatar_url: string | null;
  tema_preferido: string | null;
};

export const StudentColumns: ColumnDef<Student>[] = [
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
    accessorKey: "data_nascimento",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Data de Nascimento
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const actualDate = row.getValue<string>("data_nascimento");
      if (!actualDate) return "-";

      const match = actualDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (!match) return actualDate;

      const [, year, month, day] = match.map(Number);

      const date = new Date(year, month - 1, day);

      return date.toLocaleDateString("pt-BR");

      // const formattedDate = new Date(actualDate).toLocaleDateString("pt-BR");
      // return formattedDate;
    },
  },
  {
    accessorKey: "tema_preferido",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Tema Preferido
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-2">
        <EditStudentModal id={+row.original.codigo_usuario} />
        <DeleteModal
          route="/student/remove"
          id={+row.original.codigo_usuario}
        />
      </div>
    ),
  },
];
