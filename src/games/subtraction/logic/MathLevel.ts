export const LevelType = {
  MULTIPLE_CHOICE: "multiple_choice",
  INPUT: "input",
  THREE_NUMBERS: "three_numbers",
} as const;

export type LevelType = (typeof LevelType)[keyof typeof LevelType];

// Versão para subtração (estrutura idêntica à de soma, mudando operação)
export default class SubtractionLevel {
  public number1: number;
  public number2: number;
  public number3?: number;
  public answer: number;
  public type: LevelType;
  public choices?: number[];

  constructor(
    number1: number,
    number2: number,
    type: LevelType = LevelType.INPUT,
    number3?: number,
  ) {
    this.number1 = number1;
    this.number2 = number2;
    this.number3 = number3;
    // Para três números usamos (number1 - number2 - number3); caso contrário (number1 - number2)
    this.answer =
      number3 !== undefined ? number1 - number2 - number3 : number1 - number2;
    this.type = type;

    if (
      type === LevelType.MULTIPLE_CHOICE ||
      type === LevelType.THREE_NUMBERS
    ) {
      this.choices = this.generateChoices();
    }
  }

  private generateChoices(): number[] {
    const correctAnswer = this.answer;
    const choices = [correctAnswer];
    // Gerar opções próximas da resposta correta (todas não-negativas)
    const range = 5;

    while (choices.length < 3) {
      const offset = Math.floor(Math.random() * range * 2) - range;
      const incorrectOption = correctAnswer + offset;
      // Garantir que a opção não seja negativa e não esteja duplicada
      if (incorrectOption >= 0 && !choices.includes(incorrectOption)) {
        choices.push(incorrectOption);
      }
    }

    return choices.sort(() => Math.random() - 0.5);
  }

  // Cria um nível a partir de uma definição explícita (num1, num2, answer e opções)
  static fromDefinition(def: {
    num1: number;
    num2: number;
    answer: number;
    options?: number[];
  }): SubtractionLevel {
    const type: LevelType =
      def.options && def.options.length
        ? LevelType.MULTIPLE_CHOICE
        : LevelType.INPUT;
    const lvl = new SubtractionLevel(def.num1, def.num2, type);
    // Força answer e choices conforme a definição
    lvl.answer = def.answer;
    if (def.options && def.options.length) {
      const hasAnswer = def.options.includes(def.answer);
      lvl.choices = hasAnswer ? [...def.options] : [...def.options, def.answer];
      // Embaralhar
      lvl.choices = lvl.choices.sort(() => Math.random() - 0.5);
    }
    return lvl;
  }

  getNumber1(): number {
    return this.number1;
  }
  getNumber2(): number {
    return this.number2;
  }
  getNumber3(): number | undefined {
    return this.number3;
  }
  getAnswer(): number {
    return this.answer;
  }
  getType(): LevelType {
    return this.type;
  }
  getChoices(): number[] | undefined {
    return this.choices;
  }
  isMultipleChoice(): boolean {
    return (
      this.type === LevelType.MULTIPLE_CHOICE ||
      this.type === LevelType.THREE_NUMBERS
    );
  }
  isThreeNumbers(): boolean {
    return this.type === LevelType.THREE_NUMBERS;
  }
  isCorrect(value: number): boolean {
    return value === this.answer;
  }
}
