import { Form } from "@/components/forms/Root";
import { useCompetence } from "@/hooks/Competence/useCompetence";
import { useUpdateCompetence } from "@/hooks/Competence/useUpdateCompetence";
import { useKnowledgeArea } from "@/hooks/KnowledgeArea/useKnowledgeArea";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z
    .string({ error: "Nome é obrigatório" })
    .min(2, { message: "Nome deve ter pelo menos 2 caracteres" })
    .max(100, { message: "O limite suportado é de 100 caracteres" }),
  description: z
    .string({ error: "Descrição é obrigatória" })
    .max(500, { message: "O limite suportado é de 500 caracteres" })
    .optional(),
  areaId: z
    .number({ error: "Área de conhecimento é obrigatória" })
    .min(1, { message: "Selecione uma área de conhecimento" }),
  prerequisiteId: z.number().optional().nullable(),
});

type EditCompetenceFormProps = {
  id: number;
  onSuccess: () => void;
};

export function EditCompetenceForm({ id, onSuccess }: EditCompetenceFormProps) {
  const { competenceQuery } = useCompetence({ competenceId: id });
  const {
    data: competenceData,
    isLoading: isCompetenceLoading,
    isError: isCompetenceError,
  } = competenceQuery;
  const { knowledgeAreasQuery } = useKnowledgeArea();
  const {
    data: knowledgeAreasReturn,
    isLoading: isKnowledgeAreasLoading,
    isError: isKnowledgeAreasError,
  } = knowledgeAreasQuery;
  const knowledgeAreasData = knowledgeAreasReturn?.data;
  const { competencesQuery } = useCompetence();
  const {
    data: competencesReturn,
    isLoading: isCompetencesLoading,
    isError: isCompetencesError,
  } = competencesQuery;
  const competencesData = competencesReturn?.data;
  const { update: updateCompetenceMutation } = useUpdateCompetence();
  const {
    mutateAsync: updateCompetence,
    isPending: isCompetencePending,
    isSuccess: isCompetenceSuccess,
  } = updateCompetenceMutation;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      areaId: 0,
      prerequisiteId: null,
    },
  });

  useEffect(() => {
    if (competenceData && knowledgeAreasData) {
      const data = {
        name: competenceData.nome || "",
        description: competenceData.descricao || "",
        areaId: Number(competenceData.areaId || 0),
        prerequisiteId: competenceData.preRequisitos
          ? Number(competenceData.preRequisitos)
          : null,
      };

      console.log(data);
      form.reset(data);
    }
  }, [competenceData, knowledgeAreasData, form]);

  useEffect(() => {
    if (isCompetenceSuccess) {
      onSuccess();
    }
  }, [isCompetenceSuccess, onSuccess]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const cleanData = {
        name: String(data.name).trim(),
        description: String(data.description || "").trim(),
        areaId: Number(data.areaId),
        prerequisiteId: data.prerequisiteId
          ? Number(data.prerequisiteId)
          : null,
      };

      await updateCompetence({
        competenceId: id,
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
                  name: "name",
                  description: "description",
                  areaId: "areaId",
                  prerequisiteId: "prerequisiteId",
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

  if (isCompetenceError || isKnowledgeAreasError || isCompetencesError) {
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

  if (isCompetenceLoading || isKnowledgeAreasLoading || isCompetencesLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando dados...</span>
      </div>
    );
  }

  const filteredCompetences =
    competencesData?.filter((comp) => comp.id !== id) || [];

  return (
    <Form.Wrapper>
      <Form.Title text="Atualizar Dados da Competência" />
      <Form.Main
        form={{ ...form }}
        onSubmit={onSubmit}
        className="flex flex-col gap-4"
      >
        <Form.Field
          form={form}
          name="name"
          render={({ field }) => (
            <Form.Input
              {...field}
              label="Nome da Competência"
              placeholder="Digite o nome da competência"
            />
          )}
        />

        <Form.Field
          form={form}
          name="description"
          render={({ field }) => (
            <Form.Input
              {...field}
              label="Descrição (Opcional)"
              placeholder="Digite a descrição da competência"
            />
          )}
        />

        <Form.Field
          form={form}
          name="areaId"
          render={({ field }) => (
            <Form.Select
              label="Área de Conhecimento"
              placeholder="Selecione uma área de conhecimento"
              options={
                knowledgeAreasData?.map((area) => ({
                  value: area.id.toString(),
                  label: area.nome,
                })) || []
              }
              onChange={(value) => field.onChange(Number(value))}
              value={field.value ? field.value.toString() : ""}
              disabled={isCompetencePending}
            />
          )}
        />

        <Form.Field
          form={form}
          name="prerequisiteId"
          render={({ field }) => (
            <Form.Select
              label="Competência Pre-requisito (Opcional)"
              placeholder="Selecione uma competência pre-requisito"
              options={[
                { value: "0", label: "Nenhuma" },
                ...filteredCompetences.map((comp) => ({
                  value: comp.id.toString(),
                  label: comp.nome,
                })),
              ]}
              onChange={(value) => {
                const numValue = Number(value);
                field.onChange(numValue === 0 ? null : numValue);
              }}
              value={field.value ? field.value.toString() : "0"}
              disabled={isCompetencePending}
            />
          )}
        />

        <Form.Submit disabled={isCompetencePending}>
          {isCompetencePending ? (
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
