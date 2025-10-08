import { Edit } from "lucide-react";

interface EditActivityModalProps {
  id: number;
}

export function EditActivityModal({ id }: EditActivityModalProps) {
  const handleEdit = () => {
    console.log("Editar atividade:", id);
  };

  return (
    <button
      onClick={handleEdit}
      className="rounded bg-green-400 px-4 py-2 shadow-sm transition hover:bg-green-500"
      title="Editar atividade"
    >
      <Edit className="h-4 w-4 text-white" />
    </button>
  );
}