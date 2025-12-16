import { useState } from "react";
import { Edit } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { EditCompetenceForm } from "./EditCompetenceForm";

interface EditCompetenceModalProps {
  id: number;
}

export function EditCompetenceModal({ id }: EditCompetenceModalProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          className="cursor-pointer rounded bg-green-500 px-4 py-2 shadow-sm transition hover:bg-green-600"
          title="Editar competência"
        >
          <Edit className="h-4 w-4 text-white" />
        </div>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <div className="mt-4">
          <EditCompetenceForm id={id} onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
