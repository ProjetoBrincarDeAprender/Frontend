import { Form } from "@/components/forms/Root";
import { useCreateActivity } from "@/hooks/Activity/useCreateActivity";
import { useCompetence } from "@/hooks/Competence/useCompetence";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useUser } from "@/hooks/User/useUser";
import { formSchema } from "./utils/validation";
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

  const [competenceSearch, setCompetenceSearch] = useState("");
  const [showCompetenceDropdown, setShowCompetenceDropdown] = useState(false);
  const [selectedCompetence, setSelectedCompetence] =
    useState<CompetenceWithArea | null>(null);

  const templates = [
    { label: "Múltipla Escolha", value: "multiple_choice" },
    { label: "Verdadeiro ou Falso", value: "true_false" },
  ];

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
      creatorId: Number(user?.codigo_usuario) || 1,
      maxQuestions: 10,
      escolaId: 101,
    };

    try {
      await createActivity(payload);
      form.reset();
      setSelectedCompetence(null);
      setCompetenceSearch("");
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

  const filteredCompetences = allCompetences
   .filter(
     (competence) =>
       competence.nome.toLowerCase().includes(competenceSearch.toLowerCase()) 
    //  ||
  //     (competence.descricao &&
  //       competence.descricao
  //         .toLowerCase()
  //         .includes(competenceSearch.toLowerCase())),
   );

  const handleCompetenceSelect = (competence: CompetenceWithArea) => {
    setSelectedCompetence(competence);
    setCompetenceSearch(competence.nome);
    setShowCompetenceDropdown(false);
    form.setValue("competenceId", String(competence.id));
  };

  const handleCompetenceSearchChange = (value: string) => {
    setCompetenceSearch(value);
    if (value === "") {
      setSelectedCompetence(null);
      form.setValue("competenceId", "");
    }
    setShowCompetenceDropdown(value.length > 0);
  };

  const clearCompetence = () => {
    setSelectedCompetence(null);
    setCompetenceSearch("");
    setShowCompetenceDropdown(false);
    form.setValue("competenceId", "");
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

        <div className="relative space-y-2">
          <label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Competência
            {isCompetencesLoading ? (
              <span className="ml-2 text-xs text-gray-500">
                <Loader2 className="inline h-3 w-3 animate-spin" />{" "}
                Carregando...
              </span>
            ) : allCompetences.length > 0 ? (
              <span className="font-1 text-green-600">
                {" "}
                ({allCompetences.length} disponíveis)
              </span>
            ) : null}
          </label>
          <div className="relative">
            <input
              type="text"
              value={competenceSearch}
              onChange={(e) => handleCompetenceSearchChange(e.target.value)}
              onFocus={() =>
                setShowCompetenceDropdown(competenceSearch.length > 0)
              }
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={
                isCompetencesLoading
                  ? "Carregando competências..."
                  : allCompetences.length > 0
                    ? "Digite para buscar uma competência..."
                    : "Nenhuma competência disponível"
              }
              disabled={isActivityPending || isCompetencesLoading}
            />
            {selectedCompetence && (
              <button
                type="button"
                onClick={clearCompetence}
                className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isActivityPending}
              >
                ×
              </button>
            )}
          </div>

          {showCompetenceDropdown && filteredCompetences.length > 0 && (
            <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg">
              {filteredCompetences.slice(0, 10).map((competence) => (
                <button
                  key={competence.id}
                  type="button"
                  onClick={() => handleCompetenceSelect(competence)}
                  className="w-full border-b px-3 py-2 text-left last:border-b-0 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  disabled={isActivityPending}
                >
                  <div className="text-sm font-medium">{competence.nome}</div>
                  {competence.descricao && (
                    <div className="truncate text-xs text-gray-400">
                      {competence.descricao}
                    </div>
                  )}
                </button>
              ))}
              {filteredCompetences.length > 10 && (
                <div className="border-t px-3 py-2 text-xs text-gray-500">
                  E mais {filteredCompetences.length - 10} competências...
                </div>
              )}
            </div>
          )}

          {competenceSearch.length > 0 && filteredCompetences.length === 0 && (
            <div className="text-sm text-gray-500">
              Nenhuma competência encontrada com "{competenceSearch}"
            </div>
          )}

          {
            // allCompetences
            [].length === 0 && (
              <div className="rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-600">
                ⚠️ <strong>Nenhuma competência encontrada.</strong>
                <br />
                Certifique-se de que existem competências cadastradas no
                sistema.
              </div>
            )
          }
        </div>

        <Form.Field
          form={form}
          name="template"
          render={({ field }) => (
            <Form.Select
              {...field}
              label="Template"
              placeholder="Selecione o template"
              options={templates}
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
