import * as React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; 
import { Button } from "@/components/ui/button";
import  TeacherSignUpForm  from '@/components/SignUpForms/TeacherForm'; 

export function RegisterTeacherModal() {

  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    console.log("Cadastro realizado com sucesso!");
    setIsOpen(false);
  };

  return (

    <Dialog open={isOpen} onOpenChange={setIsOpen}>
    
      <DialogTrigger asChild>
            <Button className="min-h-[60px] flex justify-center font-1 font-bold gap-8 mt-8 text-purplish-blue uppercase bg-yellow shadow-xl py-4 px-8 rounded-2xl  text-center hover:bg-purplish-blue hover:text-yellow transition duration-200">Cadastrar Professor(a)</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl max-h-[70vh] overflow-y-auto">

          <TeacherSignUpForm onSuccess={handleSuccess} />
        
      </DialogContent>
    </Dialog>
  );
}