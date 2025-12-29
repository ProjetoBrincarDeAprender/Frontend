import { useCallback, useState } from "react";

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
  isExisting?: boolean; // Flag para identificar se é uma questão existente
}

interface DifficultyQuestions {
  difficulty: Difficulty;
  questions: Question[];
}

interface UseDifficultyManagerReturn {
  difficulties: DifficultyQuestions[];

  addDifficulty: () => void;
  removeDifficulty: (difficultyIndex: number) => void;
  resetDifficulties: () => void;
  loadExistingQuestions: (questions: any[]) => void;

  addQuestion: (difficultyIndex: number) => void;
  removeQuestion: (difficultyIndex: number, questionIndex: number) => void;
  updateQuestion: (
    difficultyIndex: number,
    questionIndex: number,
    field: keyof Question,
    value: string | Option[],
  ) => void;

  addOption: (difficultyIndex: number, questionIndex: number) => void;
  removeOption: (
    difficultyIndex: number,
    questionIndex: number,
    optionIndex: number,
  ) => void;
  updateOption: (
    difficultyIndex: number,
    questionIndex: number,
    optionIndex: number,
    field: keyof Option,
    value: string | boolean,
  ) => void;

  //   canAddDifficulty: boolean;
  getTotalQuestions: () => number;
  getDifficultyId: (difficulty: any) => number;
}

export function useDifficultyManager(): UseDifficultyManagerReturn {
  const [difficulties, setDifficulties] = useState<DifficultyQuestions[]>([
    { difficulty: "Fácil", questions: [] },
  ]);

  const addDifficulty = useCallback(() => {
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
  }, [difficulties.length]);

  const removeDifficulty = useCallback(
    (index: number) => {
      if (difficulties.length > 1) {
        setDifficulties(difficulties.filter((_, i) => i !== index));
      }
    },
    [difficulties.length],
  );

  const resetDifficulties = useCallback(() => {
    setDifficulties([{ difficulty: "Fácil", questions: [] }]);
  }, []);

  const loadExistingQuestions = useCallback((questions: any[]) => {
    console.log("📚 Carregando questões existentes:", questions.length);

    if (!questions || questions.length === 0) {
      setDifficulties([{ difficulty: "Fácil", questions: [] }]);
      return;
    }

    // Organizar questões por nível de dificuldade
    const questionsByDifficulty: { [key: number]: any[] } = {
      1: [], // Fácil
      2: [], // Médio
      3: [], // Difícil
    };

    questions.forEach((question) => {
      const difficultyId = question.nivelDificuldadeId || 1;
      if (!questionsByDifficulty[difficultyId]) {
        questionsByDifficulty[difficultyId] = [];
      }
      questionsByDifficulty[difficultyId].push(question);
    });

    // Converter para o formato do formulário
    const newDifficulties: DifficultyQuestions[] = [];

    // Adicionar níveis de dificuldade que têm questões
    Object.entries(questionsByDifficulty).forEach(
      ([difficultyId, questionsForDifficulty]) => {
        if (questionsForDifficulty.length > 0) {
          const difficultyName = getDifficultyNameById(Number(difficultyId));

          const formattedQuestions = questionsForDifficulty.map((question) => {
            let parsedContent: any = {};

            try {
              if (typeof question.conteudo === "string") {
                parsedContent = JSON.parse(question.conteudo);
              } else if (typeof question.conteudo === "object") {
                parsedContent = question.conteudo;
              }
            } catch (error) {
              console.warn(
                "Erro ao fazer parse do conteúdo da questão:",
                error,
              );
              parsedContent = { enunciado: "", opcoes: [] };
            }

            return {
              id: question.id?.toString() || `${Date.now()}-${Math.random()}`,
              enunciado: parsedContent.enunciado || "",
              isExisting: true, // Marcar como questão existente
              opcoes: (parsedContent.opcoes || []).map(
                (opcao: any, index: number) => ({
                  id: `${question.id || Date.now()}-${index}`,
                  texto: opcao.texto || "",
                  correta: opcao.correta || false,
                }),
              ),
            };
          });

          newDifficulties.push({
            difficulty: difficultyName,
            questions: formattedQuestions,
          });
        }
      },
    );

    // Se não houver questões, inicializar com nível Fácil vazio
    if (newDifficulties.length === 0) {
      newDifficulties.push({ difficulty: "Fácil", questions: [] });
    }

    console.log(
      "✅ Questões carregadas por dificuldade:",
      newDifficulties.map((d) => ({
        difficulty: d.difficulty,
        questionsCount: d.questions.length,
        existingQuestions: d.questions.filter((q) => q.isExisting).length,
      })),
    );

    setDifficulties(newDifficulties);
  }, []);

  const getDifficultyNameById = (id: number): Difficulty => {
    switch (id) {
      case 1:
        return "Fácil";
      case 2:
        return "Médio";
      case 3:
        return "Difícil";
      default:
        return "Fácil";
    }
  };

  const addQuestion = useCallback((difficultyIndex: number) => {
    const newQuestion: Question = {
      id: `${Date.now()}-${Math.random()}`,
      enunciado: "",
      isExisting: false, // Marcar como questão nova
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
  }, []);

  const removeQuestion = useCallback(
    (difficultyIndex: number, questionIndex: number) => {
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
    },
    [],
  );

  const updateQuestion = useCallback(
    (
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
                  qIdx === questionIndex
                    ? {
                        ...q,
                        [field]: value,
                        // Se era uma questão existente e está sendo modificada, manter a flag isExisting
                        // para que seja atualizada e não criada novamente
                      }
                    : q,
                ),
              }
            : diff,
        ),
      );
    },
    [],
  );

  const addOption = useCallback(
    (difficultyIndex: number, questionIndex: number) => {
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
    },
    [],
  );

  const removeOption = useCallback(
    (difficultyIndex: number, questionIndex: number, optionIndex: number) => {
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
    },
    [],
  );

  const updateOption = useCallback(
    (
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
                        // Manter a flag isExisting para questões modificadas
                      }
                    : q,
                ),
              }
            : diff,
        ),
      );
    },
    [],
  );

  const getTotalQuestions = useCallback(() => {
    return difficulties.reduce(
      (total, diff) => total + diff.questions.length,
      0,
    );
  }, []);

  const getDifficultyId = (difficulty: any): number => {
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

  return {
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

    getTotalQuestions,
    getDifficultyId,
  };
}
