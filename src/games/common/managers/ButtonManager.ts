import Phaser from "phaser";
import Button from "../models/Button";
import RandomGenerator from "../utils/randomGenerator";

export default class ButtonManager {
  protected scene: Phaser.Scene;
  private buttons: Button[];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.buttons = [];
  }

  createButtons(
    positions: { x: number; y: number }[],
    textures: string[],
  ): void {
    this.buttons = positions.map((pos) => {
      const button = new Button(
        this.scene,
        pos.x,
        pos.y,
        textures[0], // Imagem padrão (defaultImage)
        textures[1], // Imagem hover (hoverImage)
        textures[2], // Imagem do clique (clickImage)
      );
      this.scene.add.existing(button);
      return button;
    });
  }

  getButtons(): Button[] {
    return this.buttons;
  }

  setButtonTexts(texts: string[]): void {
    this.buttons.forEach((button, index) => {
      button.setButtonText(texts[index]);
    });
  }

  generateButtonsLetters(buttonsNumber: number = 1, answer: string) {
    const letterArray = new Array(buttonsNumber);
    for (let i = 0; i < buttonsNumber; i++) {
      const randomLetter = RandomGenerator.randomCharacter();
      letterArray[i] = randomLetter;
    }
    const answerIndex = RandomGenerator.randomIndex(buttonsNumber);
    letterArray[answerIndex] = answer;
    return letterArray;
  }

  generateButtonsNumbers(buttonsNumber: number = 1, answer: string) {
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
