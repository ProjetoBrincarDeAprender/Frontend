import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Form } from "@/components/forms/Root";
import api from "@/utils/api";
import { AxiosError } from "axios";

const formSchema = z.object({
  name: z
    .string({ error: "Nome é obrigatório" })
    .min(3, { error: "Nome deve ter pelo menos 3 caracteres" })
    .max(100, { error: "Nome deve ter no máximo 100 caracteres" }),
  description: z
    .string()
    .max(500, { error: "Descrição deve ter no máximo 500 caracteres" })
    .optional()
    .or(z.literal(""))
});

interface CreateKnowledgeAreaFormProps {
  onSuccess: () => void;
}

export function CreateKnowledgeAreaForm({ onSuccess }: CreateKnowledgeAreaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: ""
    }
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const payload = {
      name: data.name,
      description: data.description || ""
    };

    try {
      setIsSubmitting(true);
      const response = await api.post("/knowledge-area/register", payload);

      if (response.status === 201) {
        toast.success("Área de conhecimento criada com sucesso!");
        form.reset();
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
                message: `Erro ao criar área de conhecimento: ${field.message.join(", ")}`
              });
            }
          );
        } else {
          form.setError("root", {
            message: `${response?.data?.message}`
          });
        }
      }
      toast.error("Erro ao criar área de conhecimento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form.Wrapper>
      <Form.Title text="Cadastrar Nova Área de Conhecimento" />
      <Form.Main
        form={{ ...form }}
        onSubmit={onSubmit}
        className="flex flex-col gap-4"
      >
        <Form.Field
          form={form}
          name="name"
          render={({ field }) => (
            <Form.Input
              {...field}
              label="Nome da Área de Conhecimento"
              placeholder="Ex: Matemática"
              disabled={isSubmitting}
            />
          )}
        />

        <Form.Field
          form={form}
          name="description"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Descrição (opcional)
              </label>
              <textarea
                {...field}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                placeholder="Descreva os objetivos e escopo desta área de conhecimento... (opcional)"
                rows={4}
                disabled={isSubmitting}
              />
              {fieldState.error && (
                <p className="text-sm text-red-600">
                  {fieldState.error.message}
                </p>
              )}
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