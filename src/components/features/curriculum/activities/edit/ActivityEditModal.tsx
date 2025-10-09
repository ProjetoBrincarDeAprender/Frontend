import { useState } from "react";
import { Edit } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { EditActivityForm } from "./EditActivityForm";

interface EditActivityModalProps {
  id: number;
}

export function EditActivityModal({ id }: EditActivityModalProps) {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="rounded bg-green-400 px-4 py-2 shadow-sm transition hover:bg-green-500"
          title="Editar atividade"
        >
          <Edit className="h-4 w-4 text-white" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
    
        <div className="mt-4">
          <EditActivityForm id={id} onSuccess={handleClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
}