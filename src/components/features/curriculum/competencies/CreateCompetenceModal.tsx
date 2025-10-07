import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreateCompetenceForm } from "./CreateCompetenceForm";
import { Target, Plus } from "lucide-react";

interface CreateCompetenceModalProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function CreateCompetenceModal({ trigger, onSuccess }: CreateCompetenceModalProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };

  const defaultTrigger = (
    <Button className="bg-green-600 hover:bg-green-700 text-white">
      <Plus className="h-4 w-4 mr-2" />
      Nova Competência
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)}>
        {trigger || defaultTrigger}
      </div>
      
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="flex items-center gap-3 text-xl font-semibold text-gray-800">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="h-5 w-5 text-green-600" />
            </div>
            Cadastrar Nova Competência
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <CreateCompetenceForm onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}