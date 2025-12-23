import { Form } from "@/components/forms/Root";
import { useCreateActivity } from "@/hooks/Activity/useCreateActivity";
import { useCompetence } from "@/hooks/Competence/useCompetence";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useUser } from "@/hooks/User/useUser";
import { useState } from "react";
import type { CompetenceWithArea } from "./common/types/activity.types";
import handleAxiosError from "./files/HandleAxiosError";

const TEMPLATES = [
  { label: "Múltipla Escolha", value: "multiple_choice" },
  { label: "Verdadeiro ou Falso", value: "true_false" },
];

const ACTIVITY_CONFIG = {
  DEFAULT_CONTENT: JSON.stringify({ text: "Sem Conteúdo..." }),
  DEFAULT_CREATOR_ID: 1,
  DEFAULT_MAX_QUESTIONS: 10,
  DEFAULT_SCHOOL_ID: 101,
  DEFAULT_TYPE: "Jogo",
} as const;

const formSchema = z.object({
  title: z
    .string({ error: "Título é obrigatório" })
    .min(3, { error: "Título deve ter pelo menos 3 caracteres" })
    .max(100, { error: "Título deve ter no máximo 100 caracteres" }),
  type: z
    .string({ error: "Tipo é obrigatório" })
    .min(1, { error: "Selecione um tipo de atividade" }),
  competenceId: z
    .string({ error: "Competência é obrigatória" })
    .min(1, { error: "Você não escolheu uma competência!" }),
  template: z.string().min(1, "Template é obrigatório"),
});

interface CreateActivityFormProps {
  onSuccess: () => void;
  templateChange?: (selectedTemplate?: string) => void;
}

export function CreateActivityForm({
  onSuccess,
  templateChange,
}: CreateActivityFormProps) {
  const [canSubmit, setCanSubmit] = useState(false);
  const { user } = useUser();
  const { competencesQuery } = useCompetence({});
  const { data: competencesData, isLoading: isCompetencesLoading } =
    competencesQuery;
  const allCompetences = (competencesData?.data as CompetenceWithArea[]) || [];
  const competenceOptions = allCompetences.map((competence) => ({
    value: String(competence.id),
    label: competence.nome,
  }));

  const { create } = useCreateActivity();
  const {
    mutateAsync: createActivity,
    isSuccess: isActivitySuccess,
    isPending: isActivityPending,
  } = create;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "Jogo",
      competenceId: "",
      template: "multiple_choice",
    },
  });

  useEffect(() => {
    if (!isActivityPending || !isCompetencesLoading || form.formState.isValid)
      setCanSubmit(form.formState.isValid);
    else setCanSubmit(false);

    if (form.watch("template") === "true_false") {
      setCanSubmit(false);
    }
  }, [
    isActivityPending,
    isCompetencesLoading,
    form.formState.isValid,
    form.watch("template"),
  ]);

  useEffect(() => {
    if (isActivitySuccess) {
      onSuccess();
    }
  }, [isActivitySuccess, onSuccess]);

  useEffect(() => {
    const template = form.watch("template");
    if (templateChange) {
      templateChange(template);
    }
  }, [form.watch("template"), templateChange]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const payload = {
      template: data.template,
      title: data.title,
      type: ACTIVITY_CONFIG.DEFAULT_TYPE,
      competenceId: Number(data.competenceId),
      content: ACTIVITY_CONFIG.DEFAULT_CONTENT,
      creatorId:
        Number(user?.codigo_usuario) || ACTIVITY_CONFIG.DEFAULT_CREATOR_ID,
      maxQuestions: ACTIVITY_CONFIG.DEFAULT_MAX_QUESTIONS,
      escolaId: ACTIVITY_CONFIG.DEFAULT_SCHOOL_ID,
    };

    try {
      await createActivity(payload);
      form.reset();
    } catch (error) {
      handleAxiosError(error, form, formSchema);
    }
  };

  return (
    <Form.Wrapper>
      <Form.Title text="Cadastrar Nova Atividade" />
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
              placeholder="Ex: Exercícios de Adição e Subtração"
              disabled={isActivityPending}
            />
          )}
        />

        <Form.Field
          form={form}
          name="competenceId"
          render={({ field }) => (
            <Form.Combobox
              {...field}
              label="Selecione uma Competência"
              placeholder="Escolha..."
              noItemFoundMessage="Nenhuma competência encontrada."
              options={competenceOptions}
              variant={"ghost"}
            />
          )}
        />

        <Form.Field
          form={form}
          name="template"
          render={({ field }) => (
            <Form.Select
              {...field}
              label="Template"
              placeholder="Selecione o template"
              options={TEMPLATES}
              disabled={isActivityPending || form.formState.isSubmitting}
            />
          )}
        />

        <Form.Submit
          disabled={!canSubmit}
          className="bg-primary hover:bg-primary/90"
        >
          {isActivityPending ? (
            <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
          ) : (
            "Criar"
          )}
        </Form.Submit>
      </Form.Main>
    </Form.Wrapper>
  );
}
