import type { ColumnDef } from "@tanstack/react-table";
import { Edit } from "lucide-react";
import DeleteModal from "../utils/DataTable/DeleteModal";
import { Link } from "../utils/Link/Link";

export type Student = {
  id: number;
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
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "avatar_url",
    header: "Avatar",
  },
  {
    accessorKey: "nome_completo",
    header: "Nome Completo",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "perfil",
    header: "Perfil",
  },
  {
    accessorKey: "escola",
    header: "Escola",
  },
  {
    accessorKey: "created_ad",
    header: "Criado em",
  },
  {
    accessorKey: "data_nascimento",
    header: "Data de Nascimento",
  },
  {
    accessorKey: "tema_preferido",
    header: "Tema Preferido",
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-2">
        <Link
          href={`/editar/aluno/${row.original.id}`}
          className="rounded bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
          variant="none"
        >
          <Edit />
        </Link>
        <DeleteModal route="/student/remove" id={row.original.id} />
      </div>
    ),
  },
];
