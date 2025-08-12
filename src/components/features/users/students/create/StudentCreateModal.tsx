import { StudentSignUpForm } from "@/components/features/users/students/create/StudentCreateForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useTable } from "@/hooks/Table/useTable";
import { useState } from "react";
import { toast } from "sonner";
import type { RegisterModalProps } from "../../common/registerModalProps";

export function RegisterStudentModal({ isOnTable = true }: RegisterModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { setUpdating } = isOnTable ? useTable() : { setUpdating: () => {} };

  const handleSuccess = () => {
    setIsOpen(false);
    toast.success("Cadastro realizado com sucesso!");
    if (isOnTable) setUpdating(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="font-1 text-purplish-blue bg-yellow hover:bg-purplish-blue hover:text-yellow flex min-h-[60px] justify-center gap-8 rounded-2xl px-8 py-4 text-center font-bold uppercase shadow-xl transition duration-200">
          Cadastrar Aluno(a)
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[70vh] overflow-y-auto sm:max-w-2xl">
        <StudentSignUpForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
