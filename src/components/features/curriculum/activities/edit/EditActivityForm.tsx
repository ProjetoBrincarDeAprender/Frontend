import { Form } from "@/components/forms/Root";
import { useTable } from "@/hooks/Table/useTable";
import api from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  title: z
    .string({ error: "Título é obrigatório" })
    .min(2, { error: "Título deve ter pelo menos 2 caracteres" })
    .max(100, { error: "O limite suportado é de 100 caracteres" }),
  type: z.string({ error: "Tipo é obrigatório" }),
  competenceId: z.string({ error: "Competência é obrigatória" }),
  content: z
    .string({ error: "Conteúdo é obrigatório" })
    .min(1, { error: "Conteúdo é obrigatório" })
});

interface Competence {
  id: number;
  nome: string;
}

type EditActivityFormProps = {
  id: number;
  onSuccess: () => void;
};

export function EditActivityForm({ id, onSuccess }: EditActivityFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "",
      competenceId: "",
      content: "",
    },
  });

  const { setUpdating } = useTable();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [competences, setCompetences] = useState<Competence[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [activityResponse, competencesResponse] = await Promise.all([
          api.get(`/activity/list/${id}`),
          api.get('/competence/list'),
        ]);

        if (activityResponse.status === 200) {
          const data = activityResponse.data;
          
          const activityData = {
            title: data.titulo || "",
            type: data.tipo || "",
            competenceId: String(data.competencia_id || data.competenciaId?.id || ""),
            content: typeof data.conteudo === 'string' ? data.conteudo : JSON.stringify(data.conteudo || {}),
          };
          
          form.reset(activityData);
        }

        // Carrega competências
        if (competencesResponse.status === 200 && Array.isArray(competencesResponse.data)) {
          setCompetences(competencesResponse.data);
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
      fetchData();
    }
  }, [id, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const activityData = {
        title: data.title,
        type: data.type,
        competenceId: Number(data.competenceId),
        content: data.content,
      };

      const response = await api.put(`/activity/update/${id}`, activityData);

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
                'title': 'title',
                'type': 'type',
                'competenceId': 'competenceId',
                'content': 'content',
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

  const typeOptions = [
    { value: "Atividade", label: "Atividade" },
    { value: "Jogo", label: "Jogo" },
  ];

  return (
    <Form.Wrapper>
      <Form.Title text="Atualizar Dados da Atividade" />
      <Form.Main
        form={{ ...form }}
        onSubmit={onSubmit}
        className="flex flex-col gap-4"
      >
        <Form.Field
          form={form}
          name="title"
          render={({ field }) => (
            <Form.Input
              {...field}
              label="Título da Atividade"
              placeholder="Digite o título da atividade"
            />
          )}
        />

        <Form.Field
          form={form}
          name="type"
          render={({ field }) => (
            <Form.Select
              label="Tipo da Atividade"
              placeholder="Selecione o tipo"
              options={typeOptions}
              onChange={field.onChange}
              value={field.value || ""}
            />
          )}
        />

        <Form.Field
          form={form}
          name="competenceId"
          render={({ field }) => (
            <Form.Select
              label="Competência"
              placeholder="Selecione uma competência"
              options={competences.map((competence) => ({
                value: competence.id.toString(),
                label: competence.nome,
              }))}
              onChange={field.onChange}
              value={field.value || ""}
            />
          )}
        />

        <Form.Field
          form={form}
          name="content"
          render={({ field }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Conteúdo
              </label>
              <textarea
                {...field}
                placeholder="Digite o conteúdo da atividade"
                className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <p className="text-sm text-muted-foreground">
                Digite o conteúdo da atividade.
              </p>
            </div>
          )}
        />

        <Form.Submit>Atualizar</Form.Submit>
      </Form.Main>
    </Form.Wrapper>
  );
}