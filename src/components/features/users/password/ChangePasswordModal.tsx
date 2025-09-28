import { Form } from "@/components/forms/Root";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import api from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  senhaAntiga: z
    .string("A senha antiga é obrigatória")
    .min(8, "Senha antiga tem no mínimo 8 caracteres"),
  novaSenha: z
    .string("A nova senha é obrigatória")
    .min(8, "A nova senha deve ter no mínimo 8 caracteres"),
});

type FormData = z.infer<typeof formSchema>;

export function ChangePasswordModal() {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState<{
    old: boolean;
    new: boolean;
  }>({ old: false, new: false });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) form.reset();
  };

  const onSubmit = async (data: FormData) => {
    try {
      await api.post("/auth/change-password", {
        senhaAntiga: data.senhaAntiga,
        novaSenha: data.novaSenha,
      });

      toast.success("Senha alterada com sucesso!");
      form.reset();
      setOpen(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        form.setError("root", {
          message: error.response?.data.message || "Erro ao alterar senha",
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-az1 hover:bg-az2 mt-4 w-full rounded-lg px-6 py-2 text-center font-semibold text-white shadow-md transition">
          Alterar Senha
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-am2 text-az0 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Alterar Senha</DialogTitle>
        </DialogHeader>

        <Form.Wrapper className="bg-transparent p-0">
          <Form.Main form={form} onSubmit={onSubmit} className="space-y-4">
            <Form.Field
              form={form}
              name="senhaAntiga"
              render={({ field }) => (
                <div className="relative mt-4 w-full">
                  <Form.Input
                    {...field}
                    label="Senha Antiga"
                    placeholder="Digite sua senha antiga"
                    type={showPassword.old ? "text" : "password"}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => {
                        return { ...prev, old: !prev.old };
                      })
                    }
                    className="absolute top-9 right-3 text-gray-500 hover:text-gray-700"
                    aria-label={
                      showPassword.old ? "Ocultar senha" : "Mostrar senha"
                    }
                  >
                    {showPassword.old ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              )}
            />
            <Form.Field
              form={form}
              name="novaSenha"
              render={({ field }) => (
                <div className="relative mt-4 w-full">
                  <Form.Input
                    {...field}
                    label="Nova senha"
                    placeholder="Digite sua nova senha"
                    type={showPassword.new ? "text" : "password"}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => {
                        return { ...prev, new: !prev.new };
                      })
                    }
                    className="absolute top-9 right-3 text-gray-500 hover:text-gray-700"
                    aria-label={
                      showPassword.new ? "Ocultar senha" : "Mostrar senha"
                    }
                  >
                    {showPassword.new ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              )}
            />
            <Form.Submit>Alterar Senha</Form.Submit>
          </Form.Main>
        </Form.Wrapper>
      </DialogContent>
    </Dialog>
  );
}
