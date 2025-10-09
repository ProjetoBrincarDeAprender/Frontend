import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Form } from "@/components/forms/Root";
import api from "@/utils/api";
import { AxiosError } from "axios";

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
    .min(1, { error: "Selecione uma competência" }),
  initialDifficulty: z
    .string({ error: "Dificuldade inicial é obrigatória" })
    .min(1, { error: "Selecione uma dificuldade inicial" })
});

interface CreateActivityFormProps {
  onSuccess: () => void;
}

interface Competence {
  id: number;
  nome: string;
  descricao?: string;
  areaId?: {
    id: number;
    nome: string;
  };
}

interface DifficultyLevel {
  id: number;
  name: string;
}

interface KnowledgeArea {
  id: number;
  nome: string;
  competences?: Competence[];
}

interface CompetenceApiResponse {
  id: number;
  name?: string;
  nome?: string;
  description?: string;
  descricao?: string;
  knowledgeArea?: {
    id: number;
    name?: string;
    nome?: string;
  };
}

interface DifficultyLevelApiResponse {
  id: number;
  name?: string;
  nome?: string;
}

const activityTypes = [
  { value: "Atividade", label: "Atividade" },
  { value: "Jogo", label: "Jogo" },
];

export function CreateActivityForm({ onSuccess }: CreateActivityFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allCompetences, setAllCompetences] = useState<Competence[]>([]);
  const [difficultyLevels, setDifficultyLevels] = useState<DifficultyLevel[]>([]);
  const [competenceSearch, setCompetenceSearch] = useState("");
  const [showCompetenceDropdown, setShowCompetenceDropdown] = useState(false);
  const [selectedCompetence, setSelectedCompetence] = useState<Competence | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "",
      competenceId: "",
      initialDifficulty: ""
    }
  });

  const formatCompetence = (comp: CompetenceApiResponse, areaInfo?: { id: number; nome: string }): Competence => ({
    id: comp.id,
    nome: comp.name || comp.nome || "",
    descricao: comp.description || comp.descricao,
    areaId: comp.knowledgeArea ? {
      id: comp.knowledgeArea.id,
      nome: comp.knowledgeArea.name || comp.knowledgeArea.nome || ""
    } : areaInfo
  });

  useEffect(() => {
    const fetchCompetencesDirect = async (): Promise<Competence[]> => {
      try {
        const response = await api.get("/competence/list");
        if (response.status === 200 && response.data) {
          const competences = Array.isArray(response.data) ? response.data : [response.data];
          return competences.map((comp: CompetenceApiResponse) => formatCompetence(comp));
        }
      } catch {
        // Silently fail and try next method
      }
      return [];
    };

    const fetchCompetencesViaAreas = async (): Promise<Competence[]> => {
      try {
        const areasResponse = await api.get("/knowledge-area/list");
        if (areasResponse.status !== 200 || !areasResponse.data) return [];

        const areas: KnowledgeArea[] = Array.isArray(areasResponse.data) 
          ? areasResponse.data 
          : [areasResponse.data];

        const allCompetences: Competence[] = [];

        for (const area of areas) {
          if (area.competences && Array.isArray(area.competences)) {
            const areaCompetences = area.competences.map((comp: CompetenceApiResponse) =>
              formatCompetence(comp, { id: area.id, nome: area.nome })
            );
            allCompetences.push(...areaCompetences);
          } else {
            try {
              const compResponse = await api.get(`/knowledge-area/${area.id}/competences`);
              if (compResponse.status === 200 && compResponse.data) {
                const areaCompetences = Array.isArray(compResponse.data) 
                  ? compResponse.data 
                  : [compResponse.data];
                
                const formattedComps = areaCompetences.map((comp: CompetenceApiResponse) =>
                  formatCompetence(comp, { id: area.id, nome: area.nome })
                );
                
                allCompetences.push(...formattedComps);
              }
            } catch {
              // Continue to next area
            }
          }
        }

        return allCompetences;
      } catch {
        return [];
      }
    };

    const fetchCompetencesAlternative = async (): Promise<Competence[]> => {
      const endpoints = ["/competences", "/competence", "/competency/list", "/competencies"];
      
      for (const endpoint of endpoints) {
        try {
          const response = await api.get(endpoint);
          if (response.status === 200 && response.data) {
            const competences = Array.isArray(response.data) ? response.data : [response.data];
            return competences.map((comp: CompetenceApiResponse) => formatCompetence(comp));
          }
        } catch {
          continue;
        }
      }
      
      return [];
    };

    const fetchAllCompetences = async () => {
      try {
        let competences = await fetchCompetencesDirect();
        
        if (competences.length === 0) {
          competences = await fetchCompetencesViaAreas();
        }
        
        if (competences.length === 0) {
          competences = await fetchCompetencesAlternative();
        }

        setAllCompetences(competences);
      } catch {
        setAllCompetences([]);
      }
    };

    fetchAllCompetences();
  }, []);

  useEffect(() => {
    const fetchDifficultyLevels = async () => {
      try {
        const response = await api.get("/difficulty-level/list");
        
        if (response.status === 200 && response.data) {
          const levels = Array.isArray(response.data) ? response.data : [response.data];
          const formattedLevels = levels.map((level: DifficultyLevelApiResponse) => ({
            id: level.id,
            name: level.name || level.nome || ""
          }));
          
          setDifficultyLevels(formattedLevels);
        } else {
          setDifficultyLevels([]);
        }
      } catch {
        setDifficultyLevels([]);
      }
    };

    fetchDifficultyLevels();
  }, []);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const payload = {
      title: data.title,
      type: data.type,
      competenceId: Number(data.competenceId),
      initialDifficulty: Number(data.initialDifficulty)
    };

    try {
      setIsSubmitting(true);
      const response = await api.post("/activity/register", payload);

      if (response.status === 201) {
        toast.success("Atividade criada com sucesso!");
        form.reset();
        setSelectedCompetence(null);
        setCompetenceSearch("");
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
                message: `Erro ao criar atividade: ${field.message.join(", ")}`
              });
            }
          );
        } else {
          form.setError("root", {
            message: `${response?.data?.message}`
          });
        }
      }
      toast.error("Erro ao criar atividade. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCompetences = allCompetences.filter(competence =>
    competence.nome.toLowerCase().includes(competenceSearch.toLowerCase()) ||
    (competence.descricao && competence.descricao.toLowerCase().includes(competenceSearch.toLowerCase())) ||
    (competence.areaId && competence.areaId.nome.toLowerCase().includes(competenceSearch.toLowerCase()))
  );

  const handleCompetenceSelect = (competence: Competence) => {
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
              disabled={isSubmitting}
            />
          )}
        />

        <Form.Field
          form={form}
          name="type"
          render={({ field }) => (
            <Form.Select
              {...field}
              label="Tipo de Atividade"
              placeholder="Selecione o tipo de atividade"
              options={activityTypes}
              disabled={isSubmitting}
            />
          )}
        />

        <div className="space-y-2 relative">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Competência 
            {allCompetences.length > 0 ? (
              <span className="font-1 text-green-600"> ({allCompetences.length} disponíveis)</span>
            ) : (
              <span className="text-xs text-red-500">(Carregando...)</span>
            )}
          </label>
          <div className="relative">
            <input
              type="text"
              value={competenceSearch}
              onChange={(e) => handleCompetenceSearchChange(e.target.value)}
              onFocus={() => setShowCompetenceDropdown(competenceSearch.length > 0)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={allCompetences.length > 0 ? "Digite para buscar uma competência..." : "Carregando competências..."}
              disabled={isSubmitting || allCompetences.length === 0}
            />
            {selectedCompetence && (
              <button
                type="button"
                onClick={clearCompetence}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isSubmitting}
              >
                ×
              </button>
            )}
          </div>

          {showCompetenceDropdown && filteredCompetences.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {filteredCompetences.slice(0, 10).map((competence) => (
                <button
                  key={competence.id}
                  type="button"
                  onClick={() => handleCompetenceSelect(competence)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b last:border-b-0"
                  disabled={isSubmitting}
                >
                  <div className="font-medium text-sm">{competence.nome}</div>
                  {competence.areaId && (
                    <div className="text-xs text-gray-500">
                      Área: {competence.areaId.nome}
                    </div>
                  )}
                  {competence.descricao && (
                    <div className="text-xs text-gray-400 truncate">
                      {competence.descricao}
                    </div>
                  )}
                </button>
              ))}
              {filteredCompetences.length > 10 && (
                <div className="px-3 py-2 text-xs text-gray-500 border-t">
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

          {allCompetences.length === 0 && (
            <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded border border-amber-200">
              ⚠️ <strong>Nenhuma competência encontrada.</strong><br/>
              Certifique-se de que existem competências cadastradas no sistema.
            </div>
          )}
        </div>

        {difficultyLevels.length > 0 ? (
          <Form.Field
            form={form}
            name="initialDifficulty"
            render={({ field }) => (
              <Form.Select
                {...field}
                label="Dificuldade Inicial"
                placeholder="Selecione a dificuldade inicial"
                options={difficultyLevels.map(level => ({
                  value: String(level.id),
                  label: level.name
                }))}
                disabled={isSubmitting}
              />
            )}
          />
        ) : (
          <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded border border-amber-200">
            ⚠️ <strong>Nenhum nível de dificuldade encontrado.</strong><br/>
            Crie níveis de dificuldade primeiro para poder selecionar um.
          </div>
        )}

        <Form.Submit disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
          {isSubmitting ? "Criando..." : "Criar"}
        </Form.Submit>
      </Form.Main>
    </Form.Wrapper>
  );
}