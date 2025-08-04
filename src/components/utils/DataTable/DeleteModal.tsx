import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import api from "@/utils/api";
import { DialogClose } from "@radix-ui/react-dialog";
import { Trash2 } from "lucide-react";
import { useState } from "react";

type DeleteModalProps = {
  title?: string;
  id: number;
  route: string;
};

export default function DeleteModal({ id, route }: DeleteModalProps) {
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await api.delete(`${route}/${id}`);
      if (response.status === 200) {
        setOpen(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="cursor-pointer rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700">
        <Trash2 />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-az3">
            Tem certeza que deseja excluir?
          </DialogTitle>
          <DialogDescription className="text-az2">
            Isso excluirá esse item dos nossos servidores, para recuperá-lo será
            necessário entrar em contato com o suporte.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              onClick={() => setOpen(false)}
              variant={"default"}
              className="cursor-pointer"
            >
              Cancelar
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              onClick={handleDelete}
              variant={"destructive"}
              className="cursor-pointer"
            >
              <Trash2 />
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
