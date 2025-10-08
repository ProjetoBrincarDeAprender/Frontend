import { Edit } from "lucide-react";

interface EditDifficultyLevelModalProps {
  id: number;
}

export function EditDifficultyLevelModal({ id }: EditDifficultyLevelModalProps) {
  const handleEdit = () => {
    console.log("Editar nível de dificuldade:", id);
  };

  return (
    <button
      onClick={handleEdit}
      className="rounded bg-green-400 px-4 py-2 shadow-sm transition hover:bg-green-500"
      title="Editar nível de dificuldade"
    >
      <Edit className="h-4 w-4 text-white" />
    </button>
  );
}