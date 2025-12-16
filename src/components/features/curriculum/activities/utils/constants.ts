export abstract class constants {
  static readonly DEFAULT_CREATOR_ID = 1;
  static readonly DEFAULT_MAX_QUESTIONS = 10;
  static readonly DEFAULT_SCHOOL_ID = 101;

  static readonly TEMPLATES = [
    { label: "Múltipla Escolha", value: "multiple_choice" },
    { label: "Verdadeiro ou Falso", value: "true_false" },
  ];
}
