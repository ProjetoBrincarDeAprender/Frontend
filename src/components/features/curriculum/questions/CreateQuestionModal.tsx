import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreateQuestionForm } from "./CreateQuestionForm";
import { Plus } from "lucide-react";

interface CreateQuestionModalProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function CreateQuestionModal({
  trigger,
  onSuccess,
}: CreateQuestionModalProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };

  const defaultTrigger = (
    <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
      <Plus className="mr-2 h-4 w-4" />
      Nova Questão
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)}>{trigger || defaultTrigger}</div>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
        <div className="mt-4">
          <CreateQuestionForm onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
