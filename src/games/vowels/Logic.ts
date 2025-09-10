import randomGenerator from "../common/utils/RandomGenerator";

export default class Logic {
  constructor() {}

  generateButtonsLetters(buttonsNumber: number = 1, answer: string) {
    const letterArray = new Array(buttonsNumber);
    for (let i = 0; i < buttonsNumber; i++) {
      let randomLetter = randomGenerator.randomCharacter();
      letterArray[i] = randomLetter;
    }
    const answerIndex = randomGenerator.randomIndex(buttonsNumber);
    letterArray[answerIndex] = answer;
    return letterArray;
  }
}
