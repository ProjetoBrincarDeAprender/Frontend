import { Form } from "@/components/forms/Root";
import { useTable } from "@/hooks/Table/useTable";
import api from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z
    .string({ error: "Nome é obrigatório" })
    .max(100, { error: "O limite suportado é de 100 caracteres" })
    .min(2, { error: "Nome deve ter pelo menos 2 caracteres" }),
});

type EditDifficultyLevelFormProps = {
  id: number;
  onSuccess: () => void;
};

export function EditDifficultyLevelForm({ id, onSuccess }: EditDifficultyLevelFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const { setUpdating } = useTable();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDifficultyLevelData = async () => {
      try {
        const response = await api.get(`/difficulty-level/list/${id}`);

        if (response.status === 200) {
          const levelData = {
            name: response.data.name || "",
          };
          form.reset(levelData);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error("Erro ao buscar dados do nível de dificuldade:", error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDifficultyLevelData();
  }, [id, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const cleanData = {
      name: String(data.name).trim(),
    };

    try {
      const response = await api.put(`/difficulty-level/update/${id}`, cleanData);

      if (response.status === 200) {
        setUpdating(true);
        onSuccess();
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const response = error.response;
        
        if (Array.isArray(response?.data?.message)) {
          response?.data?.message.forEach(
            (fieldError: { field: string; message: string[] }) => {
              if (fieldError.field === 'name') {
                form.setError('name', {
                  message: fieldError.message.join(", "),
                });
              } else {
                form.setError("root", {
                  message: `${fieldError.field}: ${fieldError.message.join(", ")}`,
                });
              }
            },
          );
        } else {
          form.setError("root", {
            message: response?.data?.message || "Erro desconhecido na atualização",
          });
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Carregando dados...</span>
      </div>
    );
  }

  return (
    <Form.Wrapper>
      <Form.Title text="Atualizar Dados do Nível de Dificuldade" />
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
              label="Nome do Nível de Dificuldade"
              placeholder="Digite o nome do nível de dificuldade"
            />
          )}
        />

        <Form.Submit>Atualizar</Form.Submit>
      </Form.Main>
    </Form.Wrapper>
  );
}