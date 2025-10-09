import { useState } from "react";
import { Edit } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { EditKnowledgeAreaForm } from "./EditKnowledgeAreaForm";


interface EditKnowledgeAreaModalProps {
  id: number;
}

export function EditKnowledgeAreaModal({ id }: EditKnowledgeAreaModalProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="rounded bg-green-400 px-4 py-2 shadow-sm transition hover:bg-green-500"
          title="Editar área de conhecimento"
        >
          <Edit className="h-4 w-4 text-white" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">

        <div className="mt-4">
          <EditKnowledgeAreaForm id={id} onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}