import { Form } from "@/components/forms/Root";
import { useCompetence } from "@/hooks/Competence/useCompetence";
import { useCreateCompetence } from "@/hooks/Competence/useCreateCompetence";
import { useKnowledgeArea } from "@/hooks/KnowledgeArea/useKnowledgeArea";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  knowledgeAreaId: z
    .string({ error: "Área de conhecimento é obrigatória" })
    .min(1, { error: "Selecione uma área de conhecimento" }),
  name: z
    .string({ error: "Nome é obrigatório" })
    .min(3, { error: "Nome deve ter pelo menos 3 caracteres" })
    .max(100, { error: "Nome deve ter no máximo 100 caracteres" }),
  description: z
    .string()
    .max(500, { error: "Descrição deve ter no máximo 500 caracteres" })
    .optional()
    .or(z.literal("")),
  prerequisiteId: z.number().optional().or(z.literal(0)),
});

interface CreateCompetenceFormProps {
  onSuccess: () => void;
}

export function CreateCompetenceForm({ onSuccess }: CreateCompetenceFormProps) {
  const { create } = useCreateCompetence();
  const {
    mutateAsync: createCompetence,
    isSuccess: isCompetenceSuccess,
    isPending: isCompetencePending,
  } = create;
  const { knowledgeAreasQuery } = useKnowledgeArea();
  const { data: knowledgeAreasData, isLoading: isKnowledgeAreasLoading } =
    knowledgeAreasQuery;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      knowledgeAreaId: "",
      name: "",
      description: "",
      prerequisiteId: 0,
    },
  });

  const selectedAreaId = form.watch("knowledgeAreaId");

  const { competencesByKnowledgeAreaQuery } = useCompetence({
    knowledgeAreaId: selectedAreaId ? Number(selectedAreaId) : undefined,
  });
  const { data: competencesData, isLoading: isCompetencesLoading } =
    competencesByKnowledgeAreaQuery;

  useEffect(() => {
    if (isCompetenceSuccess) {
      onSuccess();
    }
  }, [isCompetenceSuccess, onSuccess]);

  useEffect(() => {
    form.setValue("prerequisiteId", 0);
  }, [selectedAreaId, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const payload = {
      name: data.name,
      description: data.description || "",
      prerequisiteId:
        data.prerequisiteId === 0 ? undefined : data.prerequisiteId,
    };

    try {
      await createCompetence({
        knowledgeAreaId: Number(data.knowledgeAreaId),
        data: payload,
      });
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
                message: `Erro ao criar competência: ${field.message.join(", ")}`,
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

  const renderPrerequisiteOptions = () => {
    if (!selectedAreaId || selectedAreaId === "") {
      return (
        <option value={0} disabled>
          Selecione uma área de conhecimento primeiro
        </option>
      );
    }

    if (isCompetencesLoading) {
      return (
        <option value={0} disabled>
          Carregando competências...
        </option>
      );
    }

    if (!competencesData || competencesData.length === 0) {
      return (
        <option value={0} disabled>
          Nenhuma competência existente nesta área
        </option>
      );
    }

    return (
      <>
        <option value={0}>Nenhum pré-requisito selecionado</option>
        {competencesData.map((competence) => (
          <option key={competence.id} value={competence.id}>
            {competence.nome}
          </option>
        ))}
      </>
    );
  };

  return (
    <Form.Wrapper>
      <Form.Title text="Cadastrar Nova Competência" />
      <Form.Main
        form={{ ...form }}
        onSubmit={onSubmit}
        className="flex flex-col gap-4"
      >
        {isKnowledgeAreasLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="ml-2">Carregando áreas...</span>
          </div>
        ) : (
          knowledgeAreasData && (
            <Form.Field
              form={form}
              name="knowledgeAreaId"
              render={({ field }) => (
                <Form.Select
                  {...field}
                  label="Área de Conhecimento *"
                  placeholder="Selecione a Área de Conhecimento"
                  options={knowledgeAreasData.map((area) => ({
                    value: String(area.id),
                    label: area.nome,
                  }))}
                  disabled={isCompetencePending}
                />
              )}
            />
          )
        )}

        <Form.Field
          form={form}
          name="name"
          render={({ field }) => (
            <Form.Input
              {...field}
              label="Nome da Competência *"
              placeholder="Ex: Operações básicas de matemática"
              disabled={isCompetencePending}
            />
          )}
        />

        <Form.Field
          form={form}
          name="description"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Descrição (opcional)
              </label>
              <textarea
                {...field}
                className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full resize-none rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Descreva os objetivos e habilidades desta competência... (opcional)"
                rows={4}
                disabled={isCompetencePending}
              />
              {fieldState.error && (
                <p className="text-sm text-red-600">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />

        <Form.Field
          form={form}
          name="prerequisiteId"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Pré-requisito (opcional)
              </label>
              <select
                {...field}
                className="border-purplish-blue ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isCompetencePending || !selectedAreaId}
                onChange={(e) => field.onChange(Number(e.target.value))}
              >
                {renderPrerequisiteOptions()}
              </select>
              {!selectedAreaId && (
                <p className="font-1 text-amber-600">
                  Selecione uma área de conhecimento para ver as competências
                  disponíveis
                </p>
              )}

              {selectedAreaId &&
                !isCompetencesLoading &&
                (!competencesData || competencesData.length === 0) && (
                  <p className="font-1 text-blue-600">
                    Esta será a primeira competência desta área de conhecimento
                  </p>
                )}

              {selectedAreaId &&
                !isCompetencesLoading &&
                competencesData &&
                competencesData.length > 0 && (
                  <p className="font-1 text-green-600">
                    {competencesData.length} competência(s) disponível(is) como
                    pré-requisito
                  </p>
                )}

              {fieldState.error && (
                <p className="font-1 text-red-600">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />

        <Form.Submit
          disabled={isCompetencePending}
          className="bg-primary hover:bg-primary/90"
        >
          {isCompetencePending ? (
            <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
          ) : (
            "Criar"
          )}
        </Form.Submit>
      </Form.Main>
    </Form.Wrapper>
  );
}
