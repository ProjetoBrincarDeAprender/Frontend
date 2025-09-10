export default class Level {
  private levelName: string;
  private answer: string;

  constructor(name: string, answer: string) {
    this.levelName = name;
    this.answer = answer;
  }

  isCorrectLetter(letter: string): boolean {
    if (letter === this.answer) return true;
    return false;
  }

  getLevelName() {
    return this.levelName;
  }

  getAnswer() {
    return this.answer;
  }
}
