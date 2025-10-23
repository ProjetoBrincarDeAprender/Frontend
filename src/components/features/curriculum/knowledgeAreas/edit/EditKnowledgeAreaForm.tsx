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
    .min(2, { error: "Nome deve ter pelo menos 2 caracteres" })
    .max(100, { error: "O limite suportado é de 100 caracteres" }),
  description: z
    .string({ error: "Descrição é obrigatória" })
    .max(500, { error: "O limite suportado é de 500 caracteres" })
    .optional(),
});

type EditKnowledgeAreaFormProps = {
  id: number;
  onSuccess: () => void;
};

export function EditKnowledgeAreaForm({ id, onSuccess }: EditKnowledgeAreaFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { setUpdating } = useTable();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKnowledgeAreaData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.get(`/knowledge-area/list/${id}`);

        if (response.status === 200) {
          const areaData = {
            name: response.data.nome || "",
            description: response.data.descricao || "",
          };
          form.reset(areaData);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          setError(error.response?.data?.message || "Erro ao carregar dados");
        } else {
          setError("Erro desconhecido ao carregar dados");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchKnowledgeAreaData();
    }
  }, [id, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const updateData = {
      name: String(data.name).trim(),
      description: String(data.description || "").trim(),
      competencesIds: [],
      deleted: false,
    };

    try {
      const response = await api.put(`/knowledge-area/update/${id}`, updateData);

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
              const fieldMap: Record<string, keyof z.infer<typeof formSchema>> = {
                'name': 'name',
                'description': 'description',
              };
              
              const formFieldName = fieldMap[fieldError.field];
              
              if (formFieldName) {
                form.setError(formFieldName, {
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
      } else {
        form.setError("root", {
          message: "Erro desconhecido na atualização",
        });
      }
    }
  };

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center py-8 text-red-600">
        <p>Erro: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

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
      <Form.Title text="Atualizar Dados da Área de Conhecimento" />
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
              placeholder="Digite o nome da área de conhecimento"
            />
          )}
        />

        <Form.Field
          form={form}
          name="description"
          render={({ field }) => (
            <Form.Input
              {...field}
              label="Descrição"
              placeholder="Digite a descrição da área de conhecimento"
            />
          )}
        />

        <Form.Submit>Atualizar</Form.Submit>
      </Form.Main>
    </Form.Wrapper>
  );
}