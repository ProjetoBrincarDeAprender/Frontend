import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import { useState } from "react";
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
      <DialogTrigger
        className="rounded bg-green-400 px-4 py-2 shadow-sm transition hover:bg-green-500"
        title="Editar área de conhecimento"
      >
        <Edit className="h-4 w-4 text-white" />
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <div className="mt-4">
          <EditKnowledgeAreaForm id={id} onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
