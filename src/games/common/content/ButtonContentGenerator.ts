import RandomGenerator from "../utils/randomGenerator";

export default class ButtonContentGenerator {
  static generateButtonsLetters(buttonsNumber: number = 1, answer: string) {
    const letterArray: string[] = [];
    for (let i = 0; i < buttonsNumber; i++) {
      const excludeArray = [...letterArray, answer];
      const randomLetter = RandomGenerator.randomCharacter(excludeArray);
      letterArray.push(randomLetter);
    }
    const answerIndex = RandomGenerator.randomIndex(buttonsNumber);
    letterArray[answerIndex] = answer;
    return letterArray;
  }

  static generateButtonsNumbers(buttonsNumber: number = 1, answer: string) {
    const numberArray = new Array(buttonsNumber);
    const answerNum = parseInt(answer);
    const usedNumbers = new Set<string>();

    // Adiciona a resposta correta ao conjunto de números usados
    usedNumbers.add(answer);

    for (let i = 0; i < buttonsNumber; i++) {
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
    const answerIndex = RandomGenerator.randomIndex(buttonsNumber);
    numberArray[answerIndex] = answer;
    return numberArray;
  }
}
