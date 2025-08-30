import type { ColumnDef } from "@tanstack/react-table";
// import { Edit } from "lucide-react";
import DeleteModal from "../../../../utils/DataTable/DeleteModal";
// import { Link } from "../utils/Link/Link";
import { ArrowUpDown, Share2 } from "lucide-react";
import { EditTeacherModal } from "../edit/TeacherEditModal";
import { Button } from "../../../../ui/button";

export type Teacher = {
  id: number;
  nome_completo: string;
  email: string;
  escola: string;
};

export const TeacherColumns: ColumnDef<Teacher>[] = [
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
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-2">
        <EditTeacherModal id={row.original.id} />
        <a className="bg-blue-400 px-3 py-2 shadow-sm rounded-sm transition hover:bg-blue-500" href={`/dashboard/teachers/link-students?id=${row.original.id}`}><Share2 className="text-slate-100" /></a>
        <DeleteModal route="/user/remove" id={row.original.id} />
      </div>
    ),
  },
];
