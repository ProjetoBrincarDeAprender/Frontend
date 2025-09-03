export default class Level {
  name: string;
  answer: string;

  constructor(name: string, answer: string) {
    this.name = name;
    this.answer = answer;
  }

  isCorrectAnswer(clickedLetter: string) {
    if (clickedLetter === this.answer) return true;
    return false;
  }
}
