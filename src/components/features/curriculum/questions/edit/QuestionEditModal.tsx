import { Edit } from "lucide-react";

interface EditQuestionModalProps {
  id: number;
}

export function EditQuestionModal({ id }: EditQuestionModalProps) {
  const handleEdit = () => {
    console.log("Editar questão:", id);
  };

  return (
    <button
      onClick={handleEdit}
      className="rounded bg-green-400 px-4 py-2 shadow-sm transition hover:bg-green-500"
      title="Editar questão"
    >
      <Edit className="h-4 w-4 text-white" />
    </button>
  );
}