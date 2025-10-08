import { Edit } from "lucide-react";

interface EditCompetenceModalProps {
  id: number;
}

export function EditCompetenceModal({ id }: EditCompetenceModalProps) {
  const handleEdit = () => {
    // TODO: Implementar modal de edição
    console.log(`Editar competência com ID: ${id}`);    
  };

  return (
    <button
      onClick={handleEdit}
      className="rounded bg-green-500 px-4 py-2 shadow-sm transition hover:bg-green-600 cursor-pointer"
      title="Editar competência"
    >
      <Edit className="h-4 w-4 text-white" />
    </button>
  );
}