export default class Level {
  private name: string;
  private answer: string;

  constructor(name: string, answer: string) {
    this.name = name;
    this.answer = answer;
  }

  isCorrectLetter(letter: string): boolean {
    if (letter === this.answer) return true;
    return false;
  }

  getName() {
    return this.name;
  }

  getAnswer() {
    return this.answer;
  }
}
