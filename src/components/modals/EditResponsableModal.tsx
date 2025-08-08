import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"; 
import { Button } from "@/components/ui/button";
import ResponsableEditForm from "@/components/School/EditForm";

// interface EditSchoolModalProps {
//   schoolId: number;
// }

interface EditResponsabletModalProps {
  id: number;
}
export function EditResponsableModal({id}: EditResponsabletModalProps) {

  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    console.log("Escola editada com sucesso!");
    setIsOpen(false);
  };

  return (

    <Dialog open={isOpen} onOpenChange={setIsOpen}>
    
      <DialogTrigger asChild>
            <Button className="rounded bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600">Editar</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl max-h-[70vh] overflow-y-auto">

          <ResponsableEditForm  id={id} onSuccess={handleSuccess} />
        
      </DialogContent>
    </Dialog>
  );
}