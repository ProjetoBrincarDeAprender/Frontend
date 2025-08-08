import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"; 
import { Button } from "@/components/ui/button";
import {StudentEditForm} from "@/components/Forms/EditForms/StudentForm";

// interface EditSchoolModalProps {
//   schoolId: number;
// }
interface EditStudentModalProps {
  id: number;
}

export function EditStudentModal({id}: EditStudentModalProps) {

  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    console.log("Aluno editado com sucesso!");
    setIsOpen(false);
  };

  return (

    <Dialog open={isOpen} onOpenChange={setIsOpen}>
    
      <DialogTrigger asChild>
            <Button className="rounded bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600">Editar</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl max-h-[70vh] overflow-y-auto">

          <StudentEditForm id={id} onSuccess={handleSuccess} />
        
      </DialogContent>
    </Dialog>
  );
}