import { Form } from "@/components/forms/Root";
import { useCreateKnowledgeArea } from "@/hooks/KnowledgeArea/useCreateKnowledgeArea";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z
    .string({ error: "Nome é obrigatório" })
    .min(3, { error: "Nome deve ter pelo menos 3 caracteres" })
    .max(100, { error: "Nome deve ter no máximo 100 caracteres" }),
  description: z
    .string()
    .max(500, { error: "Descrição deve ter no máximo 500 caracteres" })
    .optional()
    .or(z.literal("")),
});

interface CreateKnowledgeAreaFormProps {
  onSuccess: () => void;
}

export function CreateKnowledgeAreaForm({
  onSuccess,
}: CreateKnowledgeAreaFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { create: createKnowledgeAreaMutation } = useCreateKnowledgeArea();
  const {
    mutateAsync: createKnowledgeArea,
    isPending: isCreating,
    isSuccess: isCreateSuccess,
  } = createKnowledgeAreaMutation;

  useEffect(() => {
    if (isCreateSuccess) {
      form.reset();
      onSuccess();
    }
  }, [isCreateSuccess, onSuccess, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const payload = {
      nome: data.name,
      description: data.description || "",
    };

    try {
      await createKnowledgeArea(payload);
    } catch (error) {
      if (error instanceof AxiosError) {
        const response = error.response;

        if (Array.isArray(response?.data?.message)) {
          response?.data?.message.map(
            (field: { field: string; message: string[] }) => {
              if (form.control._fields[field.field]) {
                form.setError(field.field as keyof z.infer<typeof formSchema>, {
                  message: field.message.join(", "),
                });
              }
              form.setError("root", {
                message: `Erro ao criar área de conhecimento: ${field.message.join(", ")}`,
              });
            },
          );
        } else {
          form.setError("root", {
            message: `${response?.data?.message}`,
          });
        }
      }
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
              disabled={isCreating}
            />
          )}
        />

        <Form.Field
          form={form}
          name="description"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Descrição (opcional)
              </label>
              <textarea
                {...field}
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full resize-none rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Descreva os objetivos e escopo desta área de conhecimento... (opcional)"
                rows={4}
                disabled={isCreating}
              />
              {fieldState.error && (
                <p className="text-sm text-red-600">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />

        <Form.Submit
          disabled={isCreating}
          className="bg-primary hover:bg-primary/90"
        >
          {isCreating ? <Loader2 className="animate-spin" /> : "Criar"}
        </Form.Submit>
      </Form.Main>
    </Form.Wrapper>
  );
}
