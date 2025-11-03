export const LevelType = {
  MULTIPLE_CHOICE: 'multiple_choice',
  INPUT: 'input',
  THREE_NUMBERS: 'three_numbers'
} as const;

export type LevelType = typeof LevelType[keyof typeof LevelType];

export default class MathLevel {
  public number1: number;
  public number2: number;
  public number3?: number;
  public answer: number;
  public type: LevelType;
  public choices?: number[]; 

  constructor(number1: number, number2: number, type: LevelType = LevelType.INPUT, number3?: number) {
    this.number1 = number1;
    this.number2 = number2;
    this.number3 = number3;
    this.answer = number3 ? number1 + number2 + number3 : number1 + number2;
    this.type = type;
    
    if (type === LevelType.MULTIPLE_CHOICE || type === LevelType.THREE_NUMBERS) {
      this.choices = this.generateChoices();
    }
  }

  private generateChoices(): number[] {
    const correctAnswer = this.answer;
    const choices = [correctAnswer];
    
    // Para soma de 3 números, gerar opções em uma faixa maior
    const maxRange = this.number3 ? 15 : 10;
    
    while (choices.length < 3) {
      const incorrectOption = Math.floor(Math.random() * maxRange) + 1;
      if (!choices.includes(incorrectOption)) {
        choices.push(incorrectOption);
      }
    }
    
    return choices.sort(() => Math.random() - 0.5);
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
    return this.type === LevelType.MULTIPLE_CHOICE || this.type === LevelType.THREE_NUMBERS;
  }

  isThreeNumbers(): boolean {
    return this.type === LevelType.THREE_NUMBERS;
  }

  isCorrect(value: number): boolean {
    return value === this.answer;
  }
}
