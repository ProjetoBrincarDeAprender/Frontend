import TeacherSignUpForm from "@/components/Forms/SignUpForms/TeacherForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

export function RegisterTeacherModal() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    console.log("Cadastro realizado com sucesso!");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="font-1 text-purplish-blue bg-yellow hover:bg-purplish-blue hover:text-yellow mt-8 flex min-h-[60px] justify-center gap-8 rounded-2xl px-8 py-4 text-center font-bold uppercase shadow-xl transition duration-200">
          Cadastrar Professor(a)
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[70vh] overflow-y-auto sm:max-w-2xl">
        <TeacherSignUpForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
