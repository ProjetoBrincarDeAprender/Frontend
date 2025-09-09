import { ResponsibleEditForm } from "./ResponsibleEditForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useTable } from "@/hooks/Table/useTable";
import { useState } from "react";
import { toast } from "sonner";

interface EditResponsabletModalProps {
  id: number;
  onSuccess?: () => void;
}

export function EditResponsableModal({ id }: EditResponsabletModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { setUpdating } = useTable();

  const handleSuccess = () => {
    setIsOpen(false);
    toast.success("Responsável atualizado com sucesso!");
    setUpdating(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="rounded bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600">
          Editar
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[70vh] overflow-y-auto sm:max-w-2xl">
        <ResponsibleEditForm id={id} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
