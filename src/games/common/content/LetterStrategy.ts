import RandomGenerator from "../utils/randomGenerator";
import type ButtonGenerationStrategy from "./ButtonGenerationStrategy";

export default class LettersStrategy implements ButtonGenerationStrategy {
  generate(buttonQuantity: number, answer: string): string[] {
    const letterArray: string[] = [];
    for (let i = 0; i < buttonQuantity; i++) {
      const excludeArray = [...letterArray, answer];
      const randomLetter = RandomGenerator.randomCharacter(excludeArray);
      letterArray.push(randomLetter);
    }
    const answerIndex = RandomGenerator.randomIndex(buttonQuantity);
    letterArray[answerIndex] = answer;
    return letterArray;
  }
}
