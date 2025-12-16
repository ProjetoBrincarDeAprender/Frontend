import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/forms/Root";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Difficulty = "Fácil" | "Médio" | "Difícil";

interface Question {
  id: string;
  enunciado: string;
  respostaCorreta: boolean;
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

export function TrueFalseForm({ className = "" }: { className?: string }) {
  const [difficulties, setDifficulties] = useState<DifficultyQuestions[]>([
    { difficulty: "Fácil", questions: [] },
  ]);

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
      respostaCorreta: true,
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
    value: string | boolean,
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

  const canSubmit = () => {
    return difficulties.every(
      (diff) =>
        diff.questions.length > 0 &&
        diff.questions.every((q) => q.enunciado.trim() !== ""),
    );
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!canSubmit()) {
      return;
    }

    const payload = {
      comando: data.comando,
      dificuldades: difficulties.map((diff) => ({
        nivel: diff.difficulty,
        questoes: diff.questions.map((q) => ({
          enunciado: q.enunciado,
          respostaCorreta: q.respostaCorreta,
        })),
      })),
    };

    console.log("Payload:", payload);

    // try {
    //   const response = await api.post("/activity/true-false", payload);
    // } catch (error) {
    //   console.error(error);
    // }
  };

  return (
    <Form.Wrapper className={`flex max-h-[85vh] flex-col ${className}`}>
      <Form.Title
        text="Questões Verdadeiro ou Falso"
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
                placeholder="Ex: Indique se a afirmação é verdadeira ou falsa"
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

                    <div className="space-y-2">
                      <Label>Resposta Correta:</Label>
                      <div className="flex gap-4">
                        <label className="flex cursor-pointer items-center gap-2">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            checked={question.respostaCorreta === true}
                            onChange={() =>
                              updateQuestion(
                                diffIndex,
                                qIndex,
                                "respostaCorreta",
                                true,
                              )
                            }
                            className="text-primary focus:ring-primary h-4 w-4"
                          />
                          <span className="text-sm font-medium">
                            Verdadeiro
                          </span>
                        </label>
                        <label className="flex cursor-pointer items-center gap-2">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            checked={question.respostaCorreta === false}
                            onChange={() =>
                              updateQuestion(
                                diffIndex,
                                qIndex,
                                "respostaCorreta",
                                false,
                              )
                            }
                            className="text-primary focus:ring-primary h-4 w-4"
                          />
                          <span className="text-sm font-medium">Falso</span>
                        </label>
                      </div>
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
          <Form.Submit
            className={cn(
              "bg-primary hover:bg-primary/90",
              !canSubmit() && "cursor-not-allowed opacity-50",
            )}
            disabled={!canSubmit()}
          >
            Criar Atividade
          </Form.Submit>

          {!canSubmit() && (
            <p className="text-destructive text-center text-sm">
              Todas as dificuldades devem ter pelo menos 1 questão preenchida
            </p>
          )}
        </div>
      </Form.Main>
    </Form.Wrapper>
  );
}
