import { Form } from "@/components/forms/Root";
import useActivity from "@/hooks/Activity/useActivity";
import { useQuestion } from "@/hooks/Question/useQuestion";
import { useUpdateQuestion } from "@/hooks/Question/useUpdateQuestion";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
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

interface DifficultyLevel {
  id: number;
  nome: string;
}

export function EditQuestionForm({ id, onSuccess }: EditQuestionFormProps) {
  const { questionQuery } = useQuestion({ questionId: id });
  const { activitiesQuery } = useActivity();
  const { update } = useUpdateQuestion();
  const [difficultyLevels, setDifficultyLevels] = useState<DifficultyLevel[]>(
    [],
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      activityId: "",
      content: "",
      ordem: 1,
      difficultyId: "",
    },
  });

  useEffect(() => {
    const fetchDifficultyLevels = async () => {
      try {
        const { default: api } = await import("@/utils/api");
        const response = await api.get("/difficulty-level/list");
        if (response.status === 200 && Array.isArray(response.data)) {
          setDifficultyLevels(response.data);
        }
      } catch (error) {
        console.error("Erro ao carregar níveis de dificuldade:", error);
      }
    };

    fetchDifficultyLevels();
  }, []);

  useEffect(() => {
    if (questionQuery.data) {
      const data = questionQuery.data;

      let contentText = "";
      if (
        data.conteudo &&
        typeof data.conteudo === "object" &&
        (data.conteudo as { texto: string }).texto
      ) {
        contentText = (data.conteudo as { texto: string }).texto;
      } else if (typeof data.conteudo === "string") {
        contentText = data.conteudo;
      } else if (data.conteudo) {
        contentText = JSON.stringify(data.conteudo);
      }

      const questionData = {
        activityId: data.atividade_id ? String(data.atividade_id) : "",
        content: contentText,
        ordem: Number(data.ordem) || 1,
        difficultyId: data.nivelDificuldadeId
          ? String(data.nivelDificuldadeId)
          : "",
      };

      form.reset(questionData);
    }
  }, [questionQuery.data, form]);

  useEffect(() => {
    if (update.isSuccess) {
      onSuccess();
    }
  }, [update.isSuccess, onSuccess]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const cleanData = {
        activityId: Number(data.activityId),
        content: JSON.stringify({ texto: data.content.trim() }),
        ordem: Number(data.ordem),
        difficultyId: Number(data.difficultyId),
      };

      await update.mutateAsync({
        questionId: id,
        data: cleanData,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        const response = error.response;

        if (Array.isArray(response?.data?.message)) {
          response?.data?.message.forEach(
            (fieldError: { field: string; message: string[] }) => {
              const fieldMap: Record<string, keyof z.infer<typeof formSchema>> =
                {
                  activityId: "activityId",
                  content: "content",
                  ordem: "ordem",
                  difficultyId: "difficultyId",
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
            message:
              response?.data?.message || "Erro desconhecido na atualização",
          });
        }
      } else {
        form.setError("root", {
          message: "Erro desconhecido na atualização",
        });
      }
    }
  };

  if (questionQuery.isError || activitiesQuery.isError) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-red-600">
        <p>Erro ao carregar dados</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (questionQuery.isPending || activitiesQuery.isPending) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando dados...</span>
      </div>
    );
  }

  const activities = activitiesQuery.data
    ? Array.isArray(activitiesQuery.data)
      ? activitiesQuery.data
      : [activitiesQuery.data]
    : [];

  const activityOptions = activities
    .filter((activity) => activity && activity.id && activity.titulo)
    .map((activity) => ({
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
              disabled={update.isPending}
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
              disabled={update.isPending}
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
              disabled={update.isPending}
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
              disabled={update.isPending}
            />
          )}
        />

        <Form.Submit disabled={update.isPending}>
          {update.isPending ? (
            <>
              <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
              Atualizando...
            </>
          ) : (
            "Atualizar"
          )}
        </Form.Submit>
      </Form.Main>
    </Form.Wrapper>
  );
}
