import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import EditSchoolForm from "@/components/School/EditForm";

interface EditSchoolModalProps {
  schoolId: number;
}
export function EditSchoolModal({ schoolId }: EditSchoolModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    console.log("Escola editada com sucesso!");
    setIsOpen(false);
    window.location.reload();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="rounded bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600">
          Editar
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[70vh] overflow-y-auto sm:max-w-2xl">
        <EditSchoolForm id={schoolId} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
