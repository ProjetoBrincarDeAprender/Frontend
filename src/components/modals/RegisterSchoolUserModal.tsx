import SchoolUserSignUpForm from "@/components/Forms/SignUpForms/schoolUserForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";

export function RegisterSchoolUserModal() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    setIsOpen(false);
    toast.success("Cadastro realizado com sucesso!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="font-1 text-purplish-blue bg-yellow hover:bg-purplish-blue hover:text-yellow flex min-h-[60px] justify-center gap-8 rounded-2xl px-8 py-4 text-center font-bold uppercase shadow-xl transition duration-200">
          Cadastrar Admin Escola
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[70vh] overflow-y-auto sm:max-w-2xl">
        <SchoolUserSignUpForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
