import { Form } from "@/components/forms/Root";
import { useCreateActivity } from "@/hooks/Activity/useCreateActivity";
import { useCompetence } from "@/hooks/Competence/useCompetence";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useUser } from "@/hooks/User/useUser";
import { formSchema } from "./utils/validation";
import { ACTIVITY_CONFIG, TEMPLATES } from "./utils/constants";
import type { CompetenceWithArea } from "./common/types/activity.types";

interface CreateActivityFormProps {
  onSuccess: () => void;
  onFormStateChange?: (isFormValid: boolean, selectedTemplate?: string) => void;
}

export function CreateActivityForm({
  onSuccess,
  onFormStateChange,
}: CreateActivityFormProps) {
  const { user } = useUser();
  const { create } = useCreateActivity();
  const {
    mutateAsync: createActivity,
    isSuccess: isActivitySuccess,
    isPending: isActivityPending,
  } = create;

  const { competencesQuery } = useCompetence({});
  const { data: competencesData, isLoading: isCompetencesLoading } =
    competencesQuery;

  const allCompetences = competencesData?.data as CompetenceWithArea[];

  const competenceOptions = allCompetences.map((competence) => ({
    value: String(competence.id),
    label: competence.nome,
  }));

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
    if (isActivitySuccess) {
      onSuccess();
    }
  }, [isActivitySuccess, onSuccess]);

  // Monitora o estado do formulário para comunicar se está completo
  useEffect(() => {
    const title = form.watch("title");
    const competenceId = form.watch("competenceId");
    const template = form.watch("template");

    // Para simplificar, vamos só validar os campos essenciais
    const isFormValid =
      title.length >= 3 && competenceId !== "" && template !== "";

    if (onFormStateChange) {
      onFormStateChange(isFormValid, template);
    }
  }, [
    form.watch("title"),
    form.watch("competenceId"),
    form.watch("template"),
    onFormStateChange,
  ]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const payload = {
      template: data.template,
      title: data.title,
      type: "Jogo",
      competenceId: Number(data.competenceId),
      content: JSON.stringify({ text: "Sem Conteúdo..." }),
      creatorId:
        Number(user?.codigo_usuario) || ACTIVITY_CONFIG.DEFAULT_CREATOR_ID,
      maxQuestions: ACTIVITY_CONFIG.DEFAULT_MAX_QUESTIONS,
      escolaId: ACTIVITY_CONFIG.DEFAULT_SCHOOL_ID,
    };

    try {
      await createActivity(payload);
      form.reset();
    } catch (error) {
      if (error instanceof AxiosError) {
        const response = error.response;

        if (Array.isArray(response?.data?.message)) {
          response?.data?.message.map(
            (field: { field: string; message: string[] }) => {
              if (form.control._fields[field.field]) {
                form.setError(field.field as keyof z.infer<typeof formSchema>, {
                  message: field.message.join(", "),
                });
              }
              form.setError("root", {
                message: `Erro ao criar atividade: ${field.message.join(", ")}`,
              });
            },
          );
        } else {
          form.setError("root", {
            message: `${response?.data?.message}`,
          });
        }
      }
    }
  };

  // const filteredCompetences = allCompetences;
  // .filter(
  //   (competence) =>
  //     competence.nome.toLowerCase().includes(competenceSearch.toLowerCase()),
  //   //  ||
  //     (competence.descricao &&
  //       competence.descricao
  //         .toLowerCase()
  //         .includes(competenceSearch.toLowerCase())),
  // );

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
          disabled={isActivityPending || isCompetencesLoading}
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
