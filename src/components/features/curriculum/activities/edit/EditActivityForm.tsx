import { Form } from "@/components/forms/Root";
import useActivity from "@/hooks/Activity/useActivity";
import { useUpdateActivity } from "@/hooks/Activity/useUpdateActivity";
import { useCompetence } from "@/hooks/Competence/useCompetence";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
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
    .min(1, { error: "Conteúdo é obrigatório" }),
});

type EditActivityFormProps = {
  id: number;
  onSuccess: () => void;
};

export function EditActivityForm({ id, onSuccess }: EditActivityFormProps) {
  const { activityQuery } = useActivity({ activityId: id });
  const {
    data: activityData,
    isLoading: isActivityLoading,
    isError: isActivityError,
  } = activityQuery;

  const { competencesQuery } = useCompetence({});
  const {
    data: competences = [],
    isLoading: isCompetencesLoading,
    isError: isCompetencesError,
  } = competencesQuery;

  const { update: updateActivityMutation } = useUpdateActivity();
  const {
    mutateAsync: updateActivity,
    isPending: isActivityPending,
    isSuccess: isActivitySuccess,
  } = updateActivityMutation;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "",
      competenceId: "",
      content: "",
    },
  });

  useEffect(() => {
    if (activityData) {
      const data = {
        title: activityData.titulo || "",
        type: activityData.tipo || "",
        competenceId: String(activityData.competencia_id || ""),
        content:
          typeof activityData.conteudo === "string"
            ? activityData.conteudo
            : JSON.stringify(activityData.conteudo || {}),
      };
      form.reset(data);
    }
  }, [activityData, form]);

  useEffect(() => {
    if (isActivitySuccess) {
      onSuccess();
    }
  }, [isActivitySuccess, onSuccess]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const activityData = {
        title: data.title,
        type: data.type,
        competenceId: Number(data.competenceId),
        content: data.content,
      };

      await updateActivity({
        activityId: id,
        data: activityData,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        const response = error.response;

        if (Array.isArray(response?.data?.message)) {
          response?.data?.message.forEach(
            (fieldError: { field: string; message: string[] }) => {
              const fieldMap: Record<string, keyof z.infer<typeof formSchema>> =
                {
                  title: "title",
                  type: "type",
                  competenceId: "competenceId",
                  content: "content",
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

  if (isActivityError || isCompetencesError) {
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

  if (isActivityLoading || isCompetencesLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
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
              disabled={isActivityPending}
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
              disabled={isActivityPending}
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
              disabled={isActivityPending}
            />
          )}
        />

        <Form.Field
          form={form}
          name="content"
          render={({ field }) => (
            <div className="space-y-2">
              <label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Conteúdo
              </label>
              <textarea
                {...field}
                placeholder="Digite o conteúdo da atividade"
                disabled={isActivityPending}
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-[100px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
              <p className="text-muted-foreground text-sm">
                Digite o conteúdo da atividade.
              </p>
            </div>
          )}
        />

        <Form.Submit disabled={isActivityPending}>
          {isActivityPending ? (
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
