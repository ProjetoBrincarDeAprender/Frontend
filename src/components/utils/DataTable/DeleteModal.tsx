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
import { useTable } from "@/hooks/Table/useTable";
import api from "@/utils/api";
import { DialogClose } from "@radix-ui/react-dialog";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";

type DeleteModalProps = {
  title?: string;
  id: number;
  route: string;
};

export default function DeleteModal({ id, route }: DeleteModalProps) {
  const [open, setOpen] = useState(false);
  const { setUpdating } = useTable();

  const handleDelete = async () => {
    try {
      const response = await api.delete(`${route}/${id}`);
      if (response.status === 200) {
        setOpen(false);
        setUpdating(true);
        toast.success("Item excluído com sucesso!");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      
      if (error instanceof AxiosError && error.response?.status === 400) {
        let errorMessage = "Não é possível excluir este item pois ele possui dependências vinculadas.";
        
        // Mensagens específicas baseadas na rota
        if (route.includes('/knowledge-area/')) {
          errorMessage = "Não é possível excluir esta área de conhecimento pois ela possui competências vinculadas.";
        } else if (route.includes('/competence/')) {
          errorMessage = "Não é possível excluir esta competência pois ela possui atividades vinculadas.";
        } else if (route.includes('/activity/')) {
          errorMessage = "Não é possível excluir esta atividade pois ela possui questões vinculadas.";
        } else if (route.includes('/difficulty-level/')) {
          errorMessage = "Não é possível excluir este nível de dificuldade pois ele possui atividades ou questões vinculadas.";
        } else if (route.includes('/question/')) {
          errorMessage = "Não é possível excluir esta questão. Verifique se não há dependências vinculadas.";
        }
        
        toast.error(errorMessage);
      } else {
        toast.error("Erro ao excluir o item. Tente novamente.");
      }
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
