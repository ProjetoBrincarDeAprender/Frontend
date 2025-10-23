import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Form } from "@/components/forms/Root";
import { useTable } from "@/hooks/Table/useTable";
import api from "@/utils/api";
import { AxiosError } from "axios";

const formSchema = z.object({
  name: z
    .string({ error: "Nome é obrigatório" })
    .min(2, { error: "Nome deve ter pelo menos 2 caracteres" })
    .max(50, { error: "Nome deve ter no máximo 50 caracteres" })
    .regex(/^[a-zA-Z0-9\s\-àáâãäéêëíîïóôõöúûüç]+$/i, { 
      error: "Nome deve conter apenas letras, números, espaços e hífens" 
    })
});

interface CreateDifficultyLevelFormProps {
  onSuccess: () => void;
}

export function CreateDifficultyLevelForm({ onSuccess }: CreateDifficultyLevelFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUpdating } = useTable();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ""
    }
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const payload = {
      name: data.name.trim()
    };

    try {
      setIsSubmitting(true);
      const response = await api.post("/difficulty-level/register", payload);

      if (response.status === 201) {
        toast.success("Nível de dificuldade criado com sucesso!");
        form.reset();
        setUpdating(true); // Trigger table refresh
        return onSuccess();
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const response = error.response;

        if (Array.isArray(response?.data?.message)) {
          response?.data?.message.map(
            (field: { field: string; message: string[] }) => {
              if (form.control._fields[field.field]) {
                form.setError(field.field as keyof z.infer<typeof formSchema>, {
                  message: field.message.join(", ")
                });
              }
              form.setError("root", {
                message: `Erro ao criar nível de dificuldade: ${field.message.join(", ")}`
              });
            }
          );
        } else {
          form.setError("root", {
            message: `${response?.data?.message}`
          });
        }
      }
      toast.error("Erro ao criar nível de dificuldade. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form.Wrapper>
      <Form.Title text="Cadastrar Novo Nível de Dificuldade" />
      <Form.Main
        form={{ ...form }}
        onSubmit={onSubmit}
        className="flex flex-col gap-4"
      >
        <Form.Field
          form={form}
          name="name"
          render={({ field }) => (
            <div className="space-y-2">
              <Form.Input
                {...field}
                label="Nome do Nível de Dificuldade"
                placeholder="Ex: Iniciante, Intermediário, Avançado..."
                disabled={isSubmitting}
              />
              <div className="text-xs text-gray-500">
                Sugestões: Fácil, Médio, Difícil, Extremo
              </div>
            </div>
          )}
        />

        <Form.Submit disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
          {isSubmitting ? "Criando..." : "Criar"}
        </Form.Submit>
      </Form.Main>
    </Form.Wrapper>
  );
}