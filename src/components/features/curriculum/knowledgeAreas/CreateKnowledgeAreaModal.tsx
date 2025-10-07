import { useState } from "react";
import { Dialog, DialogContent} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreateKnowledgeAreaForm } from "./CreateKnowledgeAreaForm";
import {  Plus } from "lucide-react";

interface CreateKnowledgeAreaModalProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function CreateKnowledgeAreaModal({ trigger, onSuccess }: CreateKnowledgeAreaModalProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };

  const defaultTrigger = (
    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
      <Plus className="h-4 w-4 mr-2" />
      Nova Área de Conhecimento
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)}>
        {trigger || defaultTrigger}
      </div>
      
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <div className="mt-4">
          <CreateKnowledgeAreaForm onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}