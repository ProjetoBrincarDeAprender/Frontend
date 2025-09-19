export default class MathLevel {
  public number1: number;
  public number2: number;
  public answer: number;

  constructor(number1: number, number2: number) {
    this.number1 = number1;
    this.number2 = number2;
    this.answer = number1 + number2;
  }

  getNumber1(): number {
    return this.number1;
  }

  getNumber2(): number {
    return this.number2;
  }

  getAnswer(): number {
    return this.answer;
  }

  isCorrect(value: number): boolean {
    return value === this.answer;
  }
}
