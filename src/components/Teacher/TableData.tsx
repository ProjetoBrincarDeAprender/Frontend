import type { ColumnDef } from "@tanstack/react-table";
import { Edit } from "lucide-react";
import DeleteModal from "../utils/DataTable/DeleteModal";
import { Link } from "../utils/Link/Link";

export type Teacher = {
  id: number;
  nome_completo: string;
  email: string;
  escola: string;
};

export const TeacherColumns: ColumnDef<Teacher>[] = [
  {
    accessorKey: "id",
    header: "ID",
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
    accessorKey: "escola",
    header: "Escola",
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-2">
        <Link
          href={`/editar/professor/${row.original.id}`}
          className="rounded bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
          variant="none"
        >
          <Edit />
        </Link>
        <DeleteModal route="/user/remove" id={row.original.id} />
      </div>
    ),
  },
];
