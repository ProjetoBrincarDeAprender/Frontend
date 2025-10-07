import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreateCompetenceForm } from "./CreateCompetenceForm";
import {  Plus } from "lucide-react";

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
        <div className="mt-4">
          <CreateCompetenceForm onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}