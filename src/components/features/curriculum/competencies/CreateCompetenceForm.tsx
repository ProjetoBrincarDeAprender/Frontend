import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Form } from "@/components/forms/Root";
import api from "@/utils/api";
import { AxiosError } from "axios";

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
  prerequisiteId: z
    .number()
    .optional()
    .or(z.literal(0))
});

interface CreateCompetenceFormProps {
  onSuccess: () => void;
}

interface KnowledgeArea {
  id: number;
  nome: string;
}

interface Competence {
  id: number;
  nome: string;
  descricao: string;
}

export function CreateCompetenceForm({ onSuccess }: CreateCompetenceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [knowledgeAreas, setKnowledgeAreas] = useState<KnowledgeArea[] | null>(null);
  const [availableCompetences, setAvailableCompetences] = useState<Competence[]>([]);
  const [isLoadingCompetences, setIsLoadingCompetences] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      knowledgeAreaId: "",
      name: "",
      description: "",
      prerequisiteId: 0
    }
  });

  const selectedAreaId = form.watch("knowledgeAreaId");

  useEffect(() => {
    const fetchKnowledgeAreas = async () => {
      try {
        const response = await api.get("/knowledge-area/list");

        if (response.status === 200) {
          setKnowledgeAreas(response.data);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          form.setError("root", {
            message: `Erro ao carregar áreas de conhecimento: ${error.message}`,
          });
        }
      }
    };

    fetchKnowledgeAreas();
  }, [form]);

  useEffect(() => {
    const loadCompetences = async () => {
      if (selectedAreaId && selectedAreaId !== "") {
        try {
          setIsLoadingCompetences(true);
          const response = await api.get(`/knowledge-area/list/${selectedAreaId}/competences`);
          
          if (response.status === 200) {
            setAvailableCompetences(response.data);
          }
        } catch (error) {
          console.error("Erro ao carregar competências:", error);
          setAvailableCompetences([]);
        } finally {
          setIsLoadingCompetences(false);
        }
      } else {
        setAvailableCompetences([]);
        setIsLoadingCompetences(false);
      }
      
      form.setValue("prerequisiteId", 0);
    };

    loadCompetences();
  }, [selectedAreaId, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const payload = {
      name: data.name,
      description: data.description || "",
      prerequisiteId: data.prerequisiteId === 0 ? undefined : data.prerequisiteId
    };

    try {
      setIsSubmitting(true);
      const response = await api.post(`/knowledge-area/${data.knowledgeAreaId}/competence/register`, payload);

      if (response.status === 201) {
        toast.success("Competência criada com sucesso!");
        form.reset();
        setAvailableCompetences([]);
        return onSuccess();
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const response = error.response;

        if (Array.isArray(response?.data?.message)) {
          response?.data?.message.map(
            (field: { field: string; message: string[] }) => {
              if (form.control._fields[field.field]) {
                form.setError(field.field as keyof z.infer<typeof formSchema>, {
                  message: field.message.join(", ")
                });
              }
              form.setError("root", {
                message: `Erro ao criar competência: ${field.message.join(", ")}`
              });
            }
          );
        } else {
          form.setError("root", {
            message: `${response?.data?.message}`
          });
        }
      }
      toast.error("Erro ao criar competência. Tente novamente.");
    } finally {
      setIsSubmitting(false);
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

    if (isLoadingCompetences) {
      return (
        <option value={0} disabled>
          Carregando competências...
        </option>
      );
    }

    if (availableCompetences.length === 0) {
      return (
        <option value={0} disabled>
          Nenhuma competência existente nesta área
        </option>
      );
    }

    return (
      <>
        <option value={0}>Nenhum pré-requisito selecionado</option>
        {availableCompetences.map((competence) => (
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
        {knowledgeAreas && (
          <Form.Field
            form={form}
            name="knowledgeAreaId"
            render={({ field }) => (
              <Form.Select
                {...field}
                label="Área de Conhecimento *"
                placeholder="Selecione a Área de Conhecimento"
                options={knowledgeAreas.map((area) => ({
                  value: String(area.id),
                  label: area.nome,
                }))}
                disabled={isSubmitting}
              />
            )}
          />
        )}

        <Form.Field
          form={form}
          name="name"
          render={({ field }) => (
            <Form.Input
              {...field}
              label="Nome da Competência *"
              placeholder="Ex: Operações básicas de matemática"
              disabled={isSubmitting}
            />
          )}
        />

        <Form.Field
          form={form}
          name="description"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Descrição (opcional)
              </label>
              <textarea
                {...field}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm  placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                placeholder="Descreva os objetivos e habilidades desta competência... (opcional)"
                rows={4}
                disabled={isSubmitting}
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
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Pré-requisito (opcional)
              </label>
              <select
                {...field}
                className="border-purplish-blue flex h-10 w-full rounded-md border  px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isSubmitting || !selectedAreaId}
                onChange={(e) => field.onChange(Number(e.target.value))}
              >
                {renderPrerequisiteOptions()}
              </select>
              {!selectedAreaId && (
                <p className="font-1 text-amber-600">
                  Selecione uma área de conhecimento para ver as competências disponíveis
                </p>
              )}
              
              {selectedAreaId && !isLoadingCompetences && availableCompetences.length === 0 && (
                <p className="font-1 text-blue-600">
                   Esta será a primeira competência desta área de conhecimento
                </p>
              )}
              
              {selectedAreaId && !isLoadingCompetences && availableCompetences.length > 0 && (
                <p className="font-1 text-green-600">
                   {availableCompetences.length} competência(s) disponível(is) como pré-requisito
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

        <Form.Submit disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
          {isSubmitting ? "Criando..." : "Criar"}
        </Form.Submit>
      </Form.Main>
    </Form.Wrapper>
  );
}