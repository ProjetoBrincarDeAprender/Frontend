import type { ColumnDef } from "@tanstack/react-table";
import { Edit } from "lucide-react";
import DeleteModal from "../utils/DataTable/DeleteModal";
import { Link } from "../utils/Link/Link";

export type School = {
  id: number;
  nome: string;
  descricao?: string;
  endereco?: string;
  telefone?: string;
  email?: string;
};

export const SchoolColumns: ColumnDef<School>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "nome",
    header: "Nome",
  },
  {
    accessorKey: "descricao",
    header: "Descrição",
  },
  {
    accessorKey: "localizacao",
    header: "Localização",
  },
  {
    accessorKey: "telefone",
    header: "Telefone",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-2">
        <Link
          href={`/edit/student/${row.original.id}`}
          className="rounded bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
          variant="none"
        >
          <Edit />
        </Link>
        <DeleteModal route="/school/remove" id={row.original.id} />
      </div>
    ),
  },
];
