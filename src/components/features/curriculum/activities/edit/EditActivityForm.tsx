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
  initialDifficulty: z.string({ error: "Nível de dificuldade é obrigatório" }),
});

interface Competence {
  id: number;
  nome: string;
}

interface DifficultyLevel {
  id: number;
  nome: string;
  name: string;
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
      initialDifficulty: "",
    },
  });

  const { setUpdating } = useTable();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [competences, setCompetences] = useState<Competence[]>([]);
  const [difficultyLevels, setDifficultyLevels] = useState<DifficultyLevel[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [activityResponse, competencesResponse, difficultyLevelsResponse] = await Promise.all([
          api.get(`/activity/list/${id}`),
          api.get('/competence/list'),
          api.get('/difficulty-level/list'),
        ]);

        // Carrega dados da atividade
        if (activityResponse.status === 200) {
          const data = activityResponse.data;
          const activityData = {
            title: data.titulo || "",
            type: data.tipo || "",
            competenceId: String(
              data.competenciaId?.id || 
              data.competencia_id || 
              ""
            ),
            initialDifficulty: String(
              data.nivel_dificuldadeId?.id || 
              data.nivel_dificuldade_inicial || 
              ""
            ),
          };
          form.reset(activityData);
        }

        // Carrega competências
        if (competencesResponse.status === 200 && Array.isArray(competencesResponse.data)) {
          setCompetences(competencesResponse.data);
        }

        // Carrega níveis de dificuldade
        if (difficultyLevelsResponse.status === 200 && Array.isArray(difficultyLevelsResponse.data)) {
          setDifficultyLevels(difficultyLevelsResponse.data);
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
        initialDifficulty: Number(data.initialDifficulty),
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
                'initialDifficulty': 'initialDifficulty',
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
          name="initialDifficulty"
          render={({ field }) => (
            <Form.Select
              label="Nível de Dificuldade Inicial"
              placeholder="Selecione o nível"
              options={difficultyLevels.map((level) => ({
                value: level.id.toString(),
                label: level.nome || level.name,
              }))}
              onChange={field.onChange}
              value={field.value || ""}
            />
          )}
        />

        <Form.Submit>Atualizar</Form.Submit>
      </Form.Main>
    </Form.Wrapper>
  );
}