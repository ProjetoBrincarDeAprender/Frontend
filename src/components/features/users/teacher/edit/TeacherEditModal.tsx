import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useTable } from "@/hooks/Table/useTable";
import { useState } from "react";
import { TeacherEditForm } from "./TeacherEditForm";
import { Edit } from "lucide-react";
// interface EditSchoolModalProps {
//   schoolId: number;
// }

interface EditTeacherModalProps {
  id: number;
  onSuccess?: () => void;
}
export function EditTeacherModal({ id }: EditTeacherModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { setUpdating } = useTable();

  const handleSuccess = () => {
    setIsOpen(false);
    setUpdating(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="cursor-pointer rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700">
        <Edit />
      </DialogTrigger>

      <DialogContent className="max-h-[70vh] overflow-y-auto sm:max-w-2xl">
        <TeacherEditForm id={id} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
