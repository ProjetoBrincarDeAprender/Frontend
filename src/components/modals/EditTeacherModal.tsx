import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"; 
import { Button } from "@/components/ui/button";
import { TeacherEditForm } from "../EditForms/TeacherForm";
// interface EditSchoolModalProps {
//   schoolId: number;
// }

interface EditTeacherModalProps {
  id: number;
}
export function EditTeacherModal({id}: EditTeacherModalProps) {

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

          <TeacherEditForm  id={id} onSuccess={handleSuccess} />
        
      </DialogContent>
    </Dialog>
  );
}