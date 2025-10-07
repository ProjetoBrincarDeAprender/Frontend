import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreateActivityForm } from "./CreateActivityForm";
import {  Plus } from "lucide-react";

interface CreateActivityModalProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function CreateActivityModal({ trigger, onSuccess }: CreateActivityModalProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };

  const defaultTrigger = (
    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
      <Plus className="h-4 w-4 mr-2" />
      Nova Atividade
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)}>
        {trigger || defaultTrigger}
      </div>
      
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
 
        
        <div className="mt-4">
          <CreateActivityForm onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}