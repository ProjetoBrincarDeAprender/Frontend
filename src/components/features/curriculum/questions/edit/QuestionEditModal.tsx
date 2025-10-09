import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import { useState } from "react";
import { EditQuestionForm } from "./EditQuestionForm";

interface EditQuestionModalProps {
  id: number;
}

export function EditQuestionModal({ id }: EditQuestionModalProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="rounded bg-green-400 px-4 py-2 shadow-sm transition hover:bg-green-500"
          title="Editar questão"
        >
          <Edit className="h-4 w-4 text-white" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <EditQuestionForm id={id} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}