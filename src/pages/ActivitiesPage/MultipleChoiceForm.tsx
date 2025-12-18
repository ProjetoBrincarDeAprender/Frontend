import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/forms/Root";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useCreateQuestion } from "@/hooks/Question/useCreateQuestion";
import { AxiosError } from "axios";
import { useUpdateActivity } from "@/hooks/Activity/useUpdateActivity";
import { useDifficultyManager } from "./MultipleChoiceForm/useDifficultyManager";
import { useActivityQuestions } from "@/hooks/Activity/useActivityQuestions";
import useActivity from "@/hooks/Activity/useActivity";
import handleAxiosError from "@/components/features/curriculum/activities/files/HandleAxiosError";

const formSchema = z.object({
  activityId: z.string().min(1, { message: "Selecione uma atividade" }),
  comando: z
    .string()
    .min(3, { message: "O comando deve ter pelo menos 3 caracteres" })
    .max(100, { message: "O comando deve ter no máximo 100 caracteres" }),
});

export function MultipleChoiceForm({ className = "" }: { className?: string }) {
  const [submitProgress, setSubmitProgress] = useState<{
    total: number;
    current: number;
    currentQuestion: string;
  } | null>(null);

  const [activityOptions, setActivityOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const { create } = useCreateQuestion();
  const { mutateAsync: createQuestion } = create;

  const { activitiesQuery } = useActivity({});
  const { data: allActivities, isLoading: isLoadingActivities } =
    activitiesQuery;

  const { update: updateActivityMutation } = useUpdateActivity();
  const { mutateAsync: updateActivity, isPending: isActivityPending } =
    updateActivityMutation;

  const {
    difficulties,
    addDifficulty,
    removeDifficulty,
    resetDifficulties,
    loadExistingQuestions,
    addQuestion,
    removeQuestion,
    updateQuestion,
    addOption,
    removeOption,
    updateOption,
    getDifficultyId,
  } = useDifficultyManager();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      activityId: "",
      comando: "",
    },
  });

  // Hook para buscar questões da atividade selecionada
  const selectedActivityId = form.watch("activityId");
  const { activityQuestionsQuery } = useActivityQuestions({
    activityId: selectedActivityId ? Number(selectedActivityId) : undefined,
  });
  const { data: existingQuestions } = activityQuestionsQuery;

  useEffect(() => {
    const result = allActivities?.data.map((activity: any) => ({
      value: activity.id.toString(),
      label: activity.titulo,
    }));

    if (result) setActivityOptions(result);
  }, [allActivities, isLoadingActivities]);

  // Carregar questões existentes quando uma atividade for selecionada
  useEffect(() => {
    if (selectedActivityId && existingQuestions?.data) {
      loadExistingQuestions(existingQuestions.data);

      // Se existirem questões, carregar também o comando da primeira questão
      if (existingQuestions.data.length > 0) {
        try {
          const firstQuestion = existingQuestions.data[0];
          let parsedContent: any = {};

          if (typeof firstQuestion.conteudo === "string") {
            parsedContent = JSON.parse(firstQuestion.conteudo);
          } else if (typeof firstQuestion.conteudo === "object") {
            parsedContent = firstQuestion.conteudo;
          }

          if (parsedContent.comando) {
            form.setValue("comando", parsedContent.comando);
          }
        } catch (error) {
          console.warn(
            "⚠️ Erro ao extrair comando das questões existentes:",
            error,
          );
        }
      }
    } else if (!selectedActivityId) {
      resetDifficulties();
      form.setValue("comando", "");
    }
  }, [
    selectedActivityId,
    existingQuestions,
    loadExistingQuestions,
    resetDifficulties,
    form,
  ]);

  const canSubmit = () => {
    const formData = form.getValues();
    return (
      formData.activityId !== "" &&
      formData.comando.trim() !== "" &&
      difficulties.every(
        (diff) =>
          diff.questions.length > 0 &&
          diff.questions.every(
            (q) =>
              q.enunciado.trim() !== "" &&
              q.opcoes.length >= 2 && // Pelo menos duas opções
              q.opcoes.every((opt) => opt.texto.trim() !== "") && // Se a opção existir
              q.opcoes.some((opt) => opt.correta), // Se tiver pelo menos uma opção correta
          ),
      )
    );
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!canSubmit() || isActivityPending) {
      return;
    }

    setSubmitProgress({
      total: difficulties.length,
      current: 0,
      currentQuestion: "",
    });

    const allPayload = [];
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
            total: difficulties.length,
            current: currentQuestionIndex,
            currentQuestion: question.enunciado.substring(0, 50) + "...",
          });

          // Criar payload para esta questão específica
          const questionPayload = {
            activityId: Number(data.activityId),
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
          allPayload.push(questionPayload);
          await createQuestion(questionPayload);
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      // Sucesso - limpar o formulário
      form.reset();
      (resetDifficulties(), setSubmitProgress(null));
    } catch (error) {
      handleAxiosError(error as AxiosError, form, formSchema);
      setSubmitProgress(null);
    }

    try {
      const variables = {
        activityId: Number(data.activityId),
        data: {
          content: JSON.stringify({ allPayload }),
        },
      };
      await updateActivity(variables);
      form.reset();
    } catch (error) {
      console.error("Error updating activity:", error);
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
        <Form.Field
          form={form}
          name="activityId"
          render={({ field }) => (
            <Form.Select
              {...field}
              label="Atividade"
              placeholder={
                isLoadingActivities
                  ? "Carregando atividades..."
                  : "Em qual atividade essas questões serão adicionadas?"
              }
              options={activityOptions}
              disabled={isLoadingActivities || form.formState.isSubmitting}
            />
          )}
        />
        {/* Indicador de carregamento das questões */}
        {selectedActivityId && (
          <div className="text-sm text-gray-600">
            {existingQuestions?.data?.length
              ? `${existingQuestions.data.length} questões existentes carregadas`
              : "Nenhuma questão existente encontrada para esta atividade"}
          </div>
        )}{" "}
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
                  <span className="text-sm text-gray-500">
                    ({diff.questions.length} questões)
                  </span>
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
                    className={`space-y-3 rounded-md border p-4 ${
                      question.isExisting
                        ? "border-blue-200 bg-blue-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    {question.isExisting && (
                      <div className="mb-2 flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          Questão Existente
                        </span>
                      </div>
                    )}
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
              (!canSubmit() || isActivityPending) &&
                "cursor-not-allowed opacity-50",
            )}
            disabled={!canSubmit() || isActivityPending}
          >
            {isActivityPending ? "Criando Questões..." : "Criar Atividade"}
          </Form.Submit>

          {!canSubmit() && !isActivityPending && (
            <p className="text-destructive text-center text-sm">
              Selecione uma atividade, preencha o comando e certifique-se de que
              todas as questões têm pelo menos 2 opções preenchidas e pelo menos
              1 resposta correta marcada
            </p>
          )}
        </div>
      </Form.Main>
    </Form.Wrapper>
  );
}
