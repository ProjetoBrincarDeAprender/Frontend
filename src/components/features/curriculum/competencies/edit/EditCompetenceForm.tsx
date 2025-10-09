import { Form } from "@/components/forms/Root";
import { useTable } from "@/hooks/Table/useTable";
import api from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
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
  prerequisiteId: z
    .number()
    .optional()
    .nullable(),
});

type EditCompetenceFormProps = {
  id: number;
  onSuccess: () => void;
};

interface KnowledgeArea {
  id: number;
  nome: string;
}

interface Competence {
  id: number;
  nome: string;
}

export function EditCompetenceForm({ id, onSuccess }: EditCompetenceFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      areaId: 0,
      prerequisiteId: null,
    },
  });

  const { setUpdating } = useTable();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [knowledgeAreas, setKnowledgeAreas] = useState<KnowledgeArea[]>([]);
  const [competences, setCompetences] = useState<Competence[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [competenceResponse, areasResponse, competencesResponse] = await Promise.all([
          api.get(`/competence/list/${id}`),
          api.get('/knowledge-area/list'),
          api.get('/competence/list'),
        ]);

        // Carrega dados da competência
        if (competenceResponse.status === 200 && competenceResponse.data) {
          const data = competenceResponse.data;
          const competenceData = {
            name: data.nome || data.name || "",
            description: data.descricao || data.description || "",
            areaId: Number(data.area_conhecimento_id || data.areaId || data.area_id || 0),
            prerequisiteId: data.prerequisito_id || data.prerequisiteId || data.prerequisite_id ? 
              Number(data.prerequisito_id || data.prerequisiteId || data.prerequisite_id) : null,
          };
          form.reset(competenceData);
        }

        if (areasResponse.status === 200 && Array.isArray(areasResponse.data)) {
          setKnowledgeAreas(areasResponse.data);
        }
        if (competencesResponse.status === 200 && Array.isArray(competencesResponse.data)) {
          const filteredCompetences = competencesResponse.data.filter(
            (comp: Competence) => comp.id !== id
          );
          setCompetences(filteredCompetences);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          setError(error.response?.data?.message || "Erro ao carregar dados");
        } else {
          setError("Erro desconhecido ao carregar dados");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const cleanData = {
        name: String(data.name).trim(),
        description: String(data.description || "").trim(),
        areaId: Number(data.areaId),
        prerequisiteId: data.prerequisiteId ? Number(data.prerequisiteId) : null,
      };

      const response = await api.put(`/competence/update/${id}`, cleanData);

      if (response.status === 200) {
        setUpdating(true);
        onSuccess();
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const response = error.response;
        
        if (Array.isArray(response?.data?.message)) {
          response?.data?.message.forEach(
            (fieldError: { field: string; message: string[] }) => {
              const fieldMap: Record<string, keyof z.infer<typeof formSchema>> = {
                'name': 'name',
                'description': 'description',
                'areaId': 'areaId',
                'prerequisiteId': 'prerequisiteId',
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
            message: response?.data?.message || "Erro desconhecido na atualização",
          });
        }
      } else {
        form.setError("root", {
          message: "Erro desconhecido na atualização",
        });
      }
    }
  };

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center py-8 text-red-600">
        <p>Erro: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Carregando dados...</span>
      </div>
    );
  }

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
              options={knowledgeAreas.map((area) => ({
                value: area.id.toString(),
                label: area.nome,
              }))}
              onChange={(value) => field.onChange(Number(value))}
              value={field.value ? field.value.toString() : ""}
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
                ...competences.map((comp) => ({
                  value: comp.id.toString(),
                  label: comp.nome,
                })),
              ]}
              onChange={(value) => {
                const numValue = Number(value);
                field.onChange(numValue === 0 ? null : numValue);
              }}
              value={field.value ? field.value.toString() : "0"}
            />
          )}
        />

        <Form.Submit>Atualizar</Form.Submit>
      </Form.Main>
    </Form.Wrapper>
  );
}