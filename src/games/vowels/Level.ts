import randomGenerator from "../common/utils/RandomGenerator";

export default class Level {
  private name: string;
  private answer: string;

  constructor(name: string, answer: string) {
    this.name = name;
    this.answer = answer;
  }

  isCorrectLetter(clickedLetter: string) {
    if (clickedLetter === this.answer) return true;
    return false;
  }

  defineButtonsLetters(buttonsNumber: number = 1) {
    let letterArray = new Array(buttonsNumber);
    for (let i = 0; i < buttonsNumber; i++) {
      let randomLetter = randomGenerator.randomCharacter();
      letterArray[i] = randomLetter;
    }
    const answerIndex = randomGenerator.randomIndex(buttonsNumber);
    letterArray[answerIndex] = this.answer;
    return letterArray;
  }

  getName() {
    return this.name;
  }

  getAnswer() {
    return this.answer;
  }
}
