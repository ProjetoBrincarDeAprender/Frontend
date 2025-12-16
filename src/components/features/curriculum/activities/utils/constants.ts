export const TEMPLATES = [
  { label: "Múltipla Escolha", value: "multiple_choice" },
  { label: "Verdadeiro ou Falso", value: "true_false" },
];

export const ACTIVITY_CONFIG = {
  DEFAULT_CONTENT: JSON.stringify({ text: "Sem Conteúdo..." }),
  DEFAULT_CREATOR_ID: 1,
  DEFAULT_MAX_QUESTIONS: 10,
  DEFAULT_SCHOOL_ID: 101,
} as const;
