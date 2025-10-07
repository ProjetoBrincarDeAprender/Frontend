import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreateDifficultyLevelForm } from "./CreateDifficultyLevelForm";
import { BarChart3, Plus } from "lucide-react";

interface CreateDifficultyLevelModalProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function CreateDifficultyLevelModal({ trigger, onSuccess }: CreateDifficultyLevelModalProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };

  const defaultTrigger = (
    <Button className="bg-orange-600 hover:bg-orange-700 text-white">
      <Plus className="h-4 w-4 mr-2" />
      Novo Nível de Dificuldade
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)}>
        {trigger || defaultTrigger}
      </div>
      
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="flex items-center gap-3 text-xl font-semibold text-gray-800">
            <div className="p-2 bg-orange-100 rounded-lg">
              <BarChart3 className="h-5 w-5 text-orange-600" />
            </div>
            Cadastrar Novo Nível de Dificuldade
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <CreateDifficultyLevelForm onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}