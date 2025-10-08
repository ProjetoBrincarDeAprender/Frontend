import { Edit } from "lucide-react";

interface EditKnowledgeAreaModalProps {
  id: number;
}

export function EditKnowledgeAreaModal({ id }: EditKnowledgeAreaModalProps) {
  const handleEdit = () => {
    console.log("Editar área de conhecimento:", id);
  };

  return (
    <button
      onClick={handleEdit}
      className="rounded bg-green-400 px-4 py-2 shadow-sm transition hover:bg-green-500"
      title="Editar área de conhecimento"
    >
      <Edit className="h-4 w-4 text-white" />
    </button>
  );
}