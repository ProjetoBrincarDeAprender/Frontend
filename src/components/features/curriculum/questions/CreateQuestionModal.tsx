import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreateQuestionForm } from "./CreateQuestionForm";
import { HelpCircle, Plus } from "lucide-react";

interface CreateQuestionModalProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function CreateQuestionModal({ trigger, onSuccess }: CreateQuestionModalProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };

  const defaultTrigger = (
    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
      <Plus className="h-4 w-4 mr-2" />
      Nova Questão
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)}>
        {trigger || defaultTrigger}
      </div>
      
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="flex items-center gap-3 text-xl font-semibold text-gray-800">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <HelpCircle className="h-5 w-5 text-indigo-600" />
            </div>
            Cadastrar Nova Questão
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <CreateQuestionForm onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}