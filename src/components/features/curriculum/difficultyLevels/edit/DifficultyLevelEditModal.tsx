import { useState } from "react";
import { Edit } from "lucide-react";
import { Dialog, DialogContent,  DialogTrigger } from "@/components/ui/dialog";
import { EditDifficultyLevelForm } from "./EditDifficultyLevelForm";

interface EditDifficultyLevelModalProps {
  id: number;
}

export function EditDifficultyLevelModal({ id }: EditDifficultyLevelModalProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          className="rounded bg-green-400 px-4 py-2 shadow-sm transition hover:bg-green-500 cursor-pointer"
          title="Editar nível de dificuldade"
        >
          <Edit className="h-4 w-4 text-white" />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="mt-4">
          <EditDifficultyLevelForm id={id} onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}