import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Form } from "@/components/forms/Root";
import api from "@/utils/api";
import { AxiosError } from "axios";

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
    .min(1, { error: "Selecione uma atividade" })
});

interface CreateQuestionFormProps {
  onSuccess: () => void;
}

interface Activity {
  id: number;
  title: string;
  type: string;
}

interface ActivityApiResponse {
  id: number;
  titulo: string;
  tipo: string;
}

export function CreateQuestionForm({ onSuccess }: CreateQuestionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activitySearch, setActivitySearch] = useState("");
  const [showActivityDropdown, setShowActivityDropdown] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      ordem: 1,
      activityId: ""
    }
  });

  const formatActivity = (activity: ActivityApiResponse): Activity => ({
    id: activity.id,
    title: activity.titulo,
    type: activity.tipo
  });

  const fetchActivities = async () => {
    try {
      const response = await api.get("/activity/list");
      const activitiesData = Array.isArray(response.data) ? response.data : [response.data];
      const formattedActivities = activitiesData.map(formatActivity);
      setActivities(formattedActivities);
    } catch (error) {
      console.error("Erro ao buscar atividades:", error);
      setActivities([]);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      const payload = {
        content: JSON.stringify({ texto: data.content }),
        ordem: data.ordem
      };

      const response = await api.post(`/activity/${data.activityId}/question/register`, payload);

      if (response.status === 201) {
        toast.success("Questão criada com sucesso!");
        form.reset();
        setSelectedActivity(null);
        setActivitySearch("");
        onSuccess();
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const response = error.response;
        let errorMessage = "Erro ao criar questão";

        if (response?.data?.message) {
          if (Array.isArray(response.data.message)) {
            const fieldErrors = response.data.message.map((field: { field: string; message: string[] }) => {
              if (field.field === 'content') {
                form.setError('content', { message: field.message.join(", ") });
              }
              if (field.field === 'ordem') {
                form.setError('ordem', { message: field.message.join(", ") });
              }
              return `${field.field}: ${field.message.join(", ")}`;
            });
            errorMessage = fieldErrors.join(" | ");
          } else {
            errorMessage = response.data.message;
          }
        }

        form.setError("root", { message: errorMessage });
        toast.error(errorMessage);
      } else {
        const errorMessage = "Erro de conexão";
        form.setError("root", { message: errorMessage });
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredActivities = activities.filter(activity =>
    activity.title.toLowerCase().includes(activitySearch.toLowerCase()) ||
    activity.type.toLowerCase().includes(activitySearch.toLowerCase())
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
        <div className="space-y-2 relative">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Atividade *
            {activities.length > 0 && (
              <span className="font-1 text-green-600 ml-1"> ({activities.length} disponíveis)</span>
            )}
          </label>
          
          <div className="relative">
            <input
              type="text"
              value={activitySearch}
              onChange={(e) => handleActivitySearchChange(e.target.value)}
              onFocus={() => setShowActivityDropdown(activitySearch.length > 0)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Digite para buscar uma atividade..."
              disabled={isSubmitting || activities.length === 0}
            />
            {selectedActivity && (
              <button
                type="button"
                onClick={clearActivity}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isSubmitting}
              >
                ×
              </button>
            )}
          </div>

          {showActivityDropdown && filteredActivities.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {filteredActivities.map((activity) => (
                <button
                  key={activity.id}
                  type="button"
                  onClick={() => handleActivitySelect(activity)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b last:border-b-0"
                  disabled={isSubmitting}
                >
                  <div className="font-medium text-sm">{activity.title}</div>
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
            <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded border border-amber-200">
              ⚠️ Nenhuma atividade encontrada. Verifique se existem atividades cadastradas.
            </div>
          )}
        </div>

        <Form.Field
          form={form}
          name="content"
          render={({ field }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Conteúdo da Questão *
              </label>
              <textarea
                {...field}
                placeholder="Digite o conteúdo da questão... Ex: Quanto é 2 + 2?"
                disabled={isSubmitting}
                className="flex min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical"
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
              disabled={isSubmitting}
              onChange={(e) => field.onChange(Number(e.target.value))}
              min="1"
              max="100"
            />
          )}
        />

        <Form.Submit disabled={isSubmitting || !selectedActivity} className="bg-primary hover:bg-primary/90">
          {isSubmitting ? "Criando..." : "Criar"}
        </Form.Submit>
      </Form.Main>
    </Form.Wrapper>
  );
}