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

  const addQuestion = useCallback((difficultyIndex: number) => {
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
                  qIdx === questionIndex ? { ...q, [field]: value } : q,
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
