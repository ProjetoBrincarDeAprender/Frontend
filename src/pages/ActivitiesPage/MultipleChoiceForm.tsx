import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/forms/Root";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useCreateQuestion } from "@/hooks/Question/useCreateQuestion";
import { AxiosError } from "axios";

type Difficulty = "Fácil" | "Médio" | "Difícil";

interface Option {
  id: string;
  texto: string;
  correta: boolean;
}

interface Question {
  id: string;
  enunciado: string;
  opcoes: Option[];
}

interface DifficultyQuestions {
  difficulty: Difficulty;
  questions: Question[];
}

const formSchema = z.object({
  comando: z
    .string()
    .min(3, { message: "O comando deve ter pelo menos 3 caracteres" })
    .max(100, { message: "O comando deve ter no máximo 100 caracteres" }),
});

export function MultipleChoiceForm({ className = "" }: { className?: string }) {
  const { create } = useCreateQuestion();
  const { mutateAsync: createQuestion } = create;

  const [difficulties, setDifficulties] = useState<DifficultyQuestions[]>([
    { difficulty: "Fácil", questions: [] },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState<{
    total: number;
    current: number;
    currentQuestion: string;
  } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comando: "",
    },
  });

  const addDifficulty = () => {
    if (difficulties.length === 1) {
      setDifficulties([
        ...difficulties,
        { difficulty: "Médio", questions: [] },
      ]);
    } else if (difficulties.length === 2) {
      setDifficulties([
        ...difficulties,
        { difficulty: "Difícil", questions: [] },
      ]);
    }
  };

  const removeDifficulty = (index: number) => {
    if (difficulties.length > 1) {
      setDifficulties(difficulties.filter((_, i) => i !== index));
    }
  };

  const addQuestion = (difficultyIndex: number) => {
    const newQuestion: Question = {
      id: `${Date.now()}-${Math.random()}`,
      enunciado: "",
      opcoes: [
        { id: `${Date.now()}-1`, texto: "", correta: false },
        { id: `${Date.now()}-2`, texto: "", correta: false },
      ],
    };

    setDifficulties((prev) =>
      prev.map((diff, idx) =>
        idx === difficultyIndex
          ? { ...diff, questions: [...diff.questions, newQuestion] }
          : diff,
      ),
    );
  };

  const removeQuestion = (difficultyIndex: number, questionIndex: number) => {
    setDifficulties((prev) =>
      prev.map((diff, idx) =>
        idx === difficultyIndex
          ? {
              ...diff,
              questions: diff.questions.filter(
                (_, qIdx) => qIdx !== questionIndex,
              ),
            }
          : diff,
      ),
    );
  };

  const updateQuestion = (
    difficultyIndex: number,
    questionIndex: number,
    field: keyof Question,
    value: string | Option[],
  ) => {
    setDifficulties((prev) =>
      prev.map((diff, idx) =>
        idx === difficultyIndex
          ? {
              ...diff,
              questions: diff.questions.map((q, qIdx) =>
                qIdx === questionIndex ? { ...q, [field]: value } : q,
              ),
            }
          : diff,
      ),
    );
  };

  const updateOption = (
    difficultyIndex: number,
    questionIndex: number,
    optionIndex: number,
    field: keyof Option,
    value: string | boolean,
  ) => {
    setDifficulties((prev) =>
      prev.map((diff, idx) =>
        idx === difficultyIndex
          ? {
              ...diff,
              questions: diff.questions.map((q, qIdx) =>
                qIdx === questionIndex
                  ? {
                      ...q,
                      opcoes: q.opcoes.map((opt, optIdx) =>
                        optIdx === optionIndex
                          ? { ...opt, [field]: value }
                          : opt,
                      ),
                    }
                  : q,
              ),
            }
          : diff,
      ),
    );
  };

  const addOption = (difficultyIndex: number, questionIndex: number) => {
    const newOption: Option = {
      id: `${Date.now()}-${Math.random()}`,
      texto: "",
      correta: false,
    };

    setDifficulties((prev) =>
      prev.map((diff, idx) =>
        idx === difficultyIndex
          ? {
              ...diff,
              questions: diff.questions.map((q, qIdx) =>
                qIdx === questionIndex
                  ? { ...q, opcoes: [...q.opcoes, newOption] }
                  : q,
              ),
            }
          : diff,
      ),
    );
  };

  const removeOption = (
    difficultyIndex: number,
    questionIndex: number,
    optionIndex: number,
  ) => {
    setDifficulties((prev) =>
      prev.map((diff, idx) =>
        idx === difficultyIndex
          ? {
              ...diff,
              questions: diff.questions.map((q, qIdx) =>
                qIdx === questionIndex
                  ? {
                      ...q,
                      opcoes: q.opcoes.filter(
                        (_, optIdx) => optIdx !== optionIndex,
                      ),
                    }
                  : q,
              ),
            }
          : diff,
      ),
    );
  };

  const canSubmit = () => {
    return difficulties.every(
      (diff) =>
        diff.questions.length > 0 &&
        diff.questions.every(
          (q) =>
            q.enunciado.trim() !== "" &&
            q.opcoes.length >= 2 &&
            q.opcoes.every((opt) => opt.texto.trim() !== "") &&
            q.opcoes.some((opt) => opt.correta),
        ),
    );
  };

  const getDifficultyId = (difficulty: Difficulty): number => {
    switch (difficulty) {
      case "Fácil":
        return 1;
      case "Médio":
        return 2;
      case "Difícil":
        return 3;
      default:
        return 1;
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!canSubmit() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    // Contar o total de questões
    const totalQuestions = difficulties.reduce(
      (total, diff) => total + diff.questions.length,
      0,
    );

    setSubmitProgress({
      total: totalQuestions,
      current: 0,
      currentQuestion: "",
    });

    try {
      let currentQuestionIndex = 0;

      // Iterar por cada nível de dificuldade
      for (const difficulty of difficulties) {
        const difficultyId = getDifficultyId(difficulty.difficulty);

        // Iterar por cada questão do nível de dificuldade
        for (
          let questionIndex = 0;
          questionIndex < difficulty.questions.length;
          questionIndex++
        ) {
          const question = difficulty.questions[questionIndex];
          currentQuestionIndex++;

          // Atualizar progresso
          setSubmitProgress({
            total: totalQuestions,
            current: currentQuestionIndex,
            currentQuestion: question.enunciado.substring(0, 50) + "...",
          });

          // Criar payload para esta questão específica
          const questionPayload = {
            activityId: 43,
            data: {
              content: JSON.stringify({
                comando: data.comando,
                enunciado: question.enunciado,
                opcoes: question.opcoes.map((opcao) => ({
                  texto: opcao.texto,
                  correta: opcao.correta,
                })),
              }),
              ordem: currentQuestionIndex,
              difficultyId: difficultyId,
            },
          };

          // Fazer a requisição para esta questão
          await createQuestion(questionPayload);

          // Pequena pausa para não sobrecarregar o servidor
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      // Sucesso - limpar o formulário
      form.reset();
      setDifficulties([{ difficulty: "Fácil", questions: [] }]);
      setSubmitProgress(null);
    } catch (error) {
      console.error("Erro ao criar questões:", error);

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
                message: `Erro ao criar questão: ${field.message.join(", ")}`,
              });
            },
          );
        } else {
          form.setError("root", {
            message: `${response?.data?.message || "Erro ao criar questões"}`,
          });
        }
      }

      setSubmitProgress(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form.Wrapper className={`flex max-h-[85vh] flex-col ${className}`}>
      <Form.Title
        text="Questões de Múltipla Escolha"
        className="flex-shrink-0"
      />
      <Form.Main
        form={{ ...form }}
        onSubmit={onSubmit}
        className="flex flex-1 flex-col gap-6 overflow-y-auto pr-2"
      >
        <div className="flex-shrink-0">
          <Form.Field
            form={form}
            name="comando"
            render={({ field }) => (
              <Form.Input
                {...field}
                label="Comando"
                placeholder="Ex: Selecione a(s) alternativa(s) correta(s)"
              />
            )}
          />
        </div>

        <div className="flex-1 space-y-6">
          {difficulties.map((diff, diffIndex) => (
            <div
              key={diffIndex}
              className="rounded-lg border bg-white p-4 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold">{diff.difficulty}</h3>
                  {diffIndex === difficulties.length - 1 &&
                    difficulties.length < 3 && (
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        onClick={addDifficulty}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                </div>
                {difficulties.length > 1 &&
                  diffIndex === difficulties.length - 1 && (
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="h-7 w-7"
                      onClick={() => removeDifficulty(diffIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
              </div>

              <div className="space-y-4">
                {diff.questions.map((question, qIndex) => (
                  <div
                    key={question.id}
                    className="space-y-3 rounded-md border bg-gray-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <Label className="mb-2">Enunciado:</Label>
                        <input
                          type="text"
                          value={question.enunciado}
                          onChange={(e) =>
                            updateQuestion(
                              diffIndex,
                              qIndex,
                              "enunciado",
                              e.target.value,
                            )
                          }
                          className="focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                          placeholder="Digite o enunciado da questão"
                        />
                      </div>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                        onClick={() => removeQuestion(diffIndex, qIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <Label>Opções de Resposta:</Label>
                      {question.opcoes.map((opcao, optIndex) => (
                        <div
                          key={opcao.id}
                          className="flex items-start gap-2 rounded-md border bg-white p-3"
                        >
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              value={opcao.texto}
                              onChange={(e) =>
                                updateOption(
                                  diffIndex,
                                  qIndex,
                                  optIndex,
                                  "texto",
                                  e.target.value,
                                )
                              }
                              className="focus:ring-primary w-full rounded-md border px-3 py-2 focus:ring-2 focus:outline-none"
                              placeholder={`Opção ${optIndex + 1}`}
                            />
                            <label className="flex cursor-pointer items-center gap-2">
                              <input
                                type="checkbox"
                                checked={opcao.correta}
                                onChange={(e) =>
                                  updateOption(
                                    diffIndex,
                                    qIndex,
                                    optIndex,
                                    "correta",
                                    e.target.checked,
                                  )
                                }
                                className="text-primary focus:ring-primary h-4 w-4 rounded"
                              />
                              <span className="text-sm font-medium">
                                Resposta Correta
                              </span>
                            </label>
                          </div>
                          {question.opcoes.length > 2 && (
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                              onClick={() =>
                                removeOption(diffIndex, qIndex, optIndex)
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => addOption(diffIndex, qIndex)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Opção
                      </Button>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => addQuestion(diffIndex)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Questão em {diff.difficulty}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-am1 sticky bottom-0 -mx-2 flex-shrink-0 space-y-2 px-2 pt-4 pb-2">
          {submitProgress && (
            <div className="mb-3 space-y-2">
              <div className="text-center text-sm text-gray-600">
                Criando questões... {submitProgress.current}/
                {submitProgress.total}
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                  style={{
                    width: `${(submitProgress.current / submitProgress.total) * 100}%`,
                  }}
                ></div>
              </div>
              {submitProgress.currentQuestion && (
                <div className="truncate text-center text-xs text-gray-500">
                  {submitProgress.currentQuestion}
                </div>
              )}
            </div>
          )}

          <Form.Submit
            className={cn(
              "bg-primary hover:bg-primary/90",
              (!canSubmit() || isSubmitting) && "cursor-not-allowed opacity-50",
            )}
            disabled={!canSubmit() || isSubmitting}
          >
            {isSubmitting ? "Criando Questões..." : "Criar Atividade"}
          </Form.Submit>

          {!canSubmit() && !isSubmitting && (
            <p className="text-destructive text-center text-sm">
              Todas as questões devem ter pelo menos 2 opções preenchidas e pelo
              menos 1 resposta correta marcada
            </p>
          )}
        </div>
      </Form.Main>
    </Form.Wrapper>
  );
}
