import { Form } from "@/components/forms/Root";
import { useTable } from "@/hooks/Table/useTable";
import api from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  activityId: z.string({ error: "Atividade é obrigatória" }),
  content: z
    .string({ error: "Conteúdo é obrigatório" })
    .min(5, { message: "Conteúdo deve ter pelo menos 5 caracteres" })
    .max(1000, { message: "O limite suportado é de 1000 caracteres" }),
  ordem: z
    .number({ error: "Ordem é obrigatória" })
    .min(1, { message: "Ordem deve ser maior que 0" }),
  difficultyId: z.string({ error: "Nível de dificuldade é obrigatório" }),
});

type EditQuestionFormProps = {
  id: number;
  onSuccess: () => void;
};

interface Activity {
  id: number;
  titulo: string;
}

interface DifficultyLevel {
  id: number;
  nome: string;
}

export function EditQuestionForm({ id, onSuccess }: EditQuestionFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      activityId: "",
      content: "",
      ordem: 1,
      difficultyId: "",
    },
  });

  const { setUpdating } = useTable();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [difficultyLevels, setDifficultyLevels] = useState<DifficultyLevel[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [questionResponse, activitiesResponse, difficultyResponse] = await Promise.all([
          api.get(`/question/list/${id}`),
          api.get('/activity/list'),
          api.get('/difficulty-level/list'),
        ]);

        if (activitiesResponse.status === 200 && Array.isArray(activitiesResponse.data)) {
          const validActivities = activitiesResponse.data.filter(
            activity => activity && activity.id && activity.titulo
          );
          setActivities(validActivities);
        }

        if (difficultyResponse.status === 200 && Array.isArray(difficultyResponse.data)) {
          setDifficultyLevels(difficultyResponse.data);
        }

        if (questionResponse.status === 200 && questionResponse.data) {
          const data = questionResponse.data;
          
          let contentText = "";
          if (data.conteudo && typeof data.conteudo === 'object' && data.conteudo.texto) {
            contentText = data.conteudo.texto;
          } else if (typeof data.conteudo === 'string') {
            contentText = data.conteudo;
          } else if (data.content) {
            contentText = data.content;
          }
          
          const questionData = {
            activityId: data.atividade_id ? String(data.atividade_id) : "",
            content: contentText,
            ordem: Number(data.ordem) || 1,
            difficultyId: data.difficulty?.id ? String(data.difficulty.id) : "",
          };
          
          form.reset(questionData);
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
      const cleanData = {
        activityId: Number(data.activityId),
        content: JSON.stringify({ texto: data.content.trim() }),
        ordem: Number(data.ordem),
        difficultyId: Number(data.difficultyId),
      };

      const response = await api.put(`/question/update/${id}`, cleanData);

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
                'activityId': 'activityId',
                'content': 'content',
                'ordem': 'ordem',
                'difficultyId': 'difficultyId',
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

  const activityOptions = activities.map((activity) => ({
    value: String(activity.id),
    label: String(activity.titulo),
  }));

  return (
    <Form.Wrapper>
      <Form.Title text="Atualizar Dados da Questão" />
      <Form.Main
        form={{ ...form }}
        onSubmit={onSubmit}
        className="flex flex-col gap-4"
      >
        <Form.Field
          form={form}
          name="activityId"
          render={({ field }) => (
            <Form.Select
              label="Atividade"
              placeholder="Selecione uma atividade"
              options={activityOptions}
              onChange={field.onChange}
              value={field.value || ""}
            />
          )}
        />

        <Form.Field
          form={form}
          name="content"
          render={({ field }) => (
            <Form.Input
              {...field}
              label="Conteúdo da Questão"
              placeholder="Digite o conteúdo da questão"
            />
          )}
        />

        <Form.Field
          form={form}
          name="ordem"
          render={({ field }) => (
            <Form.Input
              {...field}
              type="number"
              label="Ordem"
              placeholder="Digite a ordem da questão"
              onChange={(e) => field.onChange(Number(e.target.value))}
              value={field.value?.toString() || ""}
            />
          )}
        />

        <Form.Field
          form={form}
          name="difficultyId"
          render={({ field }) => (
            <Form.Select
              label="Nível de Dificuldade"
              placeholder="Selecione um nível de dificuldade"
              options={difficultyLevels.map((level) => ({
                value: level.id.toString(),
                label: level.nome,
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