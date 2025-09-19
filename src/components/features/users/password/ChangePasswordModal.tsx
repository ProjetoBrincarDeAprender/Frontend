import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PasswordInput } from "@/components/ui/password-input";
import api from "@/utils/api";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useState } from "react";

const formSchema = z.object({
  senhaAntiga: z.string().min(1, "Senha antiga é obrigatória"),
  novaSenha: z.string().min(6, "A nova senha deve ter no mínimo 6 caracteres"),
});

type FormData = z.infer<typeof formSchema>;

export function ChangePasswordModal() {
  const [open, setOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) form.reset();
  };

  const onSubmit = async (data: FormData) => {
    try {
      await api.put("/auth/change-password", {
        oldPassword: data.senhaAntiga,
        newPassword: data.novaSenha
      });
      
      toast.success("Senha alterada com sucesso!");
      form.reset();
      setOpen(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || "Erro ao alterar senha");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
          Alterar Senha
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Alterar Senha</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Senha Atual</label>
              <PasswordInput
                {...form.register("senhaAntiga")}
                className={`w-full bg-gray-700 border-gray-600 focus:border-purple-500 ${
                  form.formState.errors.senhaAntiga ? "border-red-500" : ""
                }`}
                placeholder="Digite sua senha atual"
              />
              {form.formState.errors.senhaAntiga && (
                <p className="mt-1 text-sm text-red-400">
                  {form.formState.errors.senhaAntiga.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Nova Senha</label>
              <PasswordInput
                {...form.register("novaSenha")}
                className={`w-full bg-gray-700 border-gray-600 focus:border-purple-500 ${
                  form.formState.errors.novaSenha ? "border-red-500" : ""
                }`}
                placeholder="Digite a nova senha"
              />
              {form.formState.errors.novaSenha && (
                <p className="mt-1 text-sm text-red-400">
                  {form.formState.errors.novaSenha.message}
                </p>
              )}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Alterando..." : "Salvar Nova Senha"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}