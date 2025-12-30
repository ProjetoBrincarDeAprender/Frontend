import { Form } from "@/components/forms/Root";
import useActivity from "@/hooks/Activity/useActivity";
import { useCreateQuestion } from "@/hooks/Question/useCreateQuestion";
import { useUser } from "@/hooks/User/useUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  content: z
    .string({ error: "Conteúdo é obrigatório" })
    .min(5, { error: "Conteúdo deve ter pelo menos 5 caracteres" })
    .max(1000, { error: "Conteúdo deve ter no máximo 1000 caracteres" }),
  ordem: z
    .number({ error: "Ordem é obrigatória" })
    .min(1, { error: "Ordem deve ser um número positivo" })
    .max(100, { error: "Ordem deve ser no máximo 100" }),
  activityId: z
    .string({ error: "Atividade é obrigatória" })
    .min(1, { error: "Selecione uma atividade" }),
  difficultyId: z
    .string({ error: "Nível de dificuldade é obrigatório" })
    .min(1, { error: "Selecione um nível de dificuldade" }),
});

interface CreateQuestionFormProps {
  onSuccess: () => void;
}

interface Activity {
  id: number;
  title: string;
  type: string;
}

interface DifficultyLevel {
  id: number;
  nome: string;
}

interface ActivityApiResponse {
  id: number;
  titulo: string;
  tipo: string;
}

export function CreateQuestionForm({ onSuccess }: CreateQuestionFormProps) {
  const { user } = useUser();
  const { create } = useCreateQuestion();
  const { activitiesQuery } = useActivity();
  const [difficultyLevels, setDifficultyLevels] = useState<DifficultyLevel[]>(
    [],
  );
  const [activitySearch, setActivitySearch] = useState("");
  const [showActivityDropdown, setShowActivityDropdown] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null,
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      ordem: 1,
      activityId: "",
      difficultyId: "",
    },
  });

  const formatActivity = (activity: ActivityApiResponse): Activity => ({
    id: activity.id,
    title: activity.titulo,
    type: activity.tipo,
  });

  const activities = activitiesQuery.data
    ? (Array.isArray(activitiesQuery.data)
        ? activitiesQuery.data
        : [activitiesQuery.data]
      ).map(formatActivity)
    : [];

  useEffect(() => {
    const fetchDifficultyLevels = async () => {
      try {
        const { default: api } = await import("@/utils/api");
        const response = await api.get("/difficulty-level/list");
        if (response.status === 200 && Array.isArray(response.data)) {
          setDifficultyLevels(response.data);
        }
      } catch (error) {
        console.error("Erro ao buscar níveis de dificuldade:", error);
        setDifficultyLevels([]);
      }
    };

    fetchDifficultyLevels();
  }, []);

  useEffect(() => {
    if (create.isSuccess) {
      onSuccess();
    }
  }, [create.isSuccess, onSuccess]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const payload = {
        content: JSON.stringify({ texto: data.content }),
        ordem: data.ordem,
        difficultyId: Number(data.difficultyId),
        creatorId: Number(user!.codigo_usuario),
        escolaId: Number(user!.escolaId),
      };

      await create.mutateAsync({
        activityId: Number(data.activityId),
        data: payload,
      });

      form.reset();
      setSelectedActivity(null);
      setActivitySearch("");
    } catch (error) {
      if (error instanceof AxiosError) {
        const response = error.response;

        if (response?.data?.message) {
          if (Array.isArray(response.data.message)) {
            response.data.message.forEach(
              (field: { field: string; message: string[] }) => {
                if (field.field === "content") {
                  form.setError("content", {
                    message: field.message.join(", "),
                  });
                }
                if (field.field === "ordem") {
                  form.setError("ordem", { message: field.message.join(", ") });
                }
                if (field.field === "difficultyId") {
                  form.setError("difficultyId", {
                    message: field.message.join(", "),
                  });
                }
              },
            );
            form.setError("root", {
              message: response.data.message
                .map(
                  (f: { field: string; message: string[] }) =>
                    `${f.field}: ${f.message.join(", ")}`,
                )
                .join(" | "),
            });
          } else {
            form.setError("root", { message: response.data.message });
          }
        }
      } else {
        form.setError("root", { message: "Erro de conexão" });
      }
    }
  };

  const filteredActivities = activities.filter(
    (activity) =>
      activity.title.toLowerCase().includes(activitySearch.toLowerCase()) ||
      activity.type.toLowerCase().includes(activitySearch.toLowerCase()),
  );

  const handleActivitySelect = (activity: Activity) => {
    setSelectedActivity(activity);
    setActivitySearch(activity.title);
    setShowActivityDropdown(false);
    form.setValue("activityId", String(activity.id));
  };

  const handleActivitySearchChange = (value: string) => {
    setActivitySearch(value);
    if (value === "") {
      setSelectedActivity(null);
      form.setValue("activityId", "");
    }
    setShowActivityDropdown(value.length > 0);
  };

  const clearActivity = () => {
    setSelectedActivity(null);
    setActivitySearch("");
    setShowActivityDropdown(false);
    form.setValue("activityId", "");
  };

  return (
    <Form.Wrapper>
      <Form.Title text="Cadastrar Nova Questão" />
      <Form.Main
        form={{ ...form }}
        onSubmit={onSubmit}
        className="flex flex-col gap-4"
      >
        <div className="relative space-y-2">
          <label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Atividade *
            {activities.length > 0 && (
              <span className="font-1 ml-1 text-green-600">
                {" "}
                ({activities.length} disponíveis)
              </span>
            )}
          </label>

          <div className="relative">
            <input
              type="text"
              value={activitySearch}
              onChange={(e) => handleActivitySearchChange(e.target.value)}
              onFocus={() => setShowActivityDropdown(activitySearch.length > 0)}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Digite para buscar uma atividade..."
              disabled={
                create.isPending ||
                activitiesQuery.isPending ||
                activities.length === 0
              }
            />
            {selectedActivity && (
              <button
                type="button"
                onClick={clearActivity}
                className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={create.isPending}
              >
                ×
              </button>
            )}
          </div>

          {showActivityDropdown && filteredActivities.length > 0 && (
            <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg">
              {filteredActivities.map((activity) => (
                <button
                  key={activity.id}
                  type="button"
                  onClick={() => handleActivitySelect(activity)}
                  className="w-full border-b px-3 py-2 text-left last:border-b-0 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  disabled={create.isPending}
                >
                  <div className="text-sm font-medium">{activity.title}</div>
                  <div className="text-xs text-gray-500">
                    Tipo: {activity.type}
                  </div>
                </button>
              ))}
            </div>
          )}

          {activitySearch.length > 0 && filteredActivities.length === 0 && (
            <div className="text-sm text-gray-500">
              Nenhuma atividade encontrada com "{activitySearch}"
            </div>
          )}

          {/* {selectedActivity && (
            <div className="font-1 text-green-600">
              Atividade selecionada: {selectedActivity.title}
              <span className="text-gray-500"> (Tipo: {selectedActivity.type})</span>
            </div>
          )} */}

          {activities.length === 0 && (
            <div className="rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-600">
              ⚠️ Nenhuma atividade encontrada. Verifique se existem atividades
              cadastradas.
            </div>
          )}
        </div>

        <Form.Field
          form={form}
          name="content"
          render={({ field }) => (
            <div className="space-y-2">
              <label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Conteúdo da Questão *
              </label>
              <textarea
                {...field}
                placeholder="Digite o conteúdo da questão... Ex: Quanto é 2 + 2?"
                disabled={create.isPending}
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring resize-vertical flex min-h-32 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          )}
        />

        <Form.Field
          form={form}
          name="ordem"
          render={({ field }) => (
            <Form.Input
              {...field}
              label="Ordem da Questão *"
              type="number"
              placeholder="Ex: 1, 2, 3..."
              disabled={create.isPending}
              onChange={(e) => field.onChange(Number(e.target.value))}
              min="1"
              max="100"
            />
          )}
        />

        <Form.Field
          form={form}
          name="difficultyId"
          render={({ field }) => (
            <Form.Select
              label="Nível de Dificuldade *"
              placeholder="Selecione um nível de dificuldade"
              options={difficultyLevels.map((level) => ({
                value: level.id.toString(),
                label: level.nome,
              }))}
              onChange={field.onChange}
              value={field.value || ""}
              disabled={create.isPending}
            />
          )}
        />

        <Form.Submit
          disabled={create.isPending || !selectedActivity}
          className="bg-primary hover:bg-primary/90"
        >
          {create.isPending ? (
            <>
              <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
              Criando...
            </>
          ) : (
            "Criar"
          )}
        </Form.Submit>
      </Form.Main>
    </Form.Wrapper>
  );
}
