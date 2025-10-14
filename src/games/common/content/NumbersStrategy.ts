import RandomGenerator from "../utils/randomGenerator";
import type ButtonGenerationStrategy from "./ButtonGenerationStrategy";

export default class NumbersStrategy implements ButtonGenerationStrategy {
  generate(buttonQuantity: number, answer: string): string[] {
    const numberArray = new Array(buttonQuantity);
    const answerNum = parseInt(answer);
    const usedNumbers = new Set<string>();

    // Adiciona a resposta correta ao conjunto de números usados
    usedNumbers.add(answer);

    for (let i = 0; i < buttonQuantity; i++) {
      let randomNumber: number;
      let randomNumberStr: string;

      // Gera números únicos até encontrar um que não foi usado
      do {
        const randomOffset = RandomGenerator.randomIndex(10) - 5; // -5 a 4
        randomNumber = answerNum + randomOffset;
        if (randomNumber < 0) randomNumber = Math.abs(randomNumber);
        randomNumberStr = randomNumber.toString();
      } while (usedNumbers.has(randomNumberStr));

      // Adiciona o número gerado ao conjunto e ao array
      usedNumbers.add(randomNumberStr);
      numberArray[i] = randomNumberStr;
    }

    // Coloca a resposta correta em uma posição aleatória
    const answerIndex = RandomGenerator.randomIndex(buttonQuantity);
    numberArray[answerIndex] = answer;
    return numberArray;
  }
}
