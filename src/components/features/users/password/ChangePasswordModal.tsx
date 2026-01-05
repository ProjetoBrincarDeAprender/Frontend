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
import { useState, type ReactNode } from "react";
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

interface ChangePasswordModalProps {
  onTriggerClick?: () => void;
  customTrigger?: ReactNode;
  // Props para controle externo do modal
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ChangePasswordModal({
  onTriggerClick,
  customTrigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: ChangePasswordModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  // Usa estado controlado se fornecido, senão usa interno
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

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

  // Se controlado externamente, não renderiza trigger
  if (isControlled) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="bg-am2 text-az0 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Alterar Senha
            </DialogTitle>
          </DialogHeader>

          <Form.Wrapper className="bg-transparent p-0">
            <Form.Main form={form} onSubmit={onSubmit} className="space-y-4">
              <Form.Field
                form={form}
                name="senhaAntiga"
                render={({ field }) => (
                  <Form.PasswordInput
                    {...field}
                    label="Senha Antiga"
                    placeholder="Digite sua senha antiga"
                  />
                )}
              />
              <Form.Field
                form={form}
                name="novaSenha"
                render={({ field }) => (
                  <Form.PasswordInput
                    {...field}
                    label="Nova Senha"
                    placeholder="Digite sua nova senha"
                  />
                )}
              />
              <Form.Submit>Alterar Senha</Form.Submit>
            </Form.Main>
          </Form.Wrapper>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {customTrigger ? (
          <div onClick={() => onTriggerClick?.()}>{customTrigger}</div>
        ) : (
          <Button
            className="bg-az1 hover:bg-az2 mt-4 w-full rounded-lg px-6 py-2 text-center font-semibold text-white shadow-md transition"
            onClick={() => onTriggerClick?.()}
          >
            Alterar Senha
          </Button>
        )}
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
                <Form.PasswordInput
                  {...field}
                  label="Senha Antiga"
                  placeholder="Digite sua senha antiga"
                />
              )}
            />
            <Form.Field
              form={form}
              name="novaSenha"
              render={({ field }) => (
                <Form.PasswordInput
                  {...field}
                  label="Nova Senha"
                  placeholder="Digite sua nova senha"
                />
              )}
            />
            <Form.Submit>Alterar Senha</Form.Submit>
          </Form.Main>
        </Form.Wrapper>
      </DialogContent>
    </Dialog>
  );
}
