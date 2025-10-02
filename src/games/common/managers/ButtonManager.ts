import Phaser from "phaser";
import Button from "../models/Button";
import RandomGenerator from "../utils/randomGenerator";

interface ButtonConfig {
  positions: { x: number; y: number };
  textures: {
    default: string;
    hover?: string;
    clicked?: string;
  };
  text?: string;
  fontSize?: number;
  scale?: number;
}

export default class ButtonManager {
  protected scene: Phaser.Scene;
  private buttons: Button[];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.buttons = [];
  }

  createButtons(config: ButtonConfig[]): Button[] {
    const newButtons: Button[] = [];

    for (let i = 0; i < config.length; i++) {
      const newButton: Button = this.createButton({
        positions: config[i].positions,
        textures: config[i].textures,
        text: config[i].text,
        fontSize: config[i].fontSize,
        scale: config[i].scale,
      });
      newButtons.push(newButton);
    }

    this.buttons = newButtons;
    return newButtons;
  }

  createButton({
    positions,
    textures,
    text,
    fontSize,
    scale = 1,
  }: ButtonConfig): Button {
    const button = new Button(
      this.scene,
      positions.x,
      positions.y,
      textures.default, // Imagem padrão (defaultImage)
      textures.hover, // Imagem hover (hoverImage)
      textures.clicked, // Imagem do clique (clickImage)
      text ? text : "", // Texto do botão (buttonText)
      fontSize ? fontSize : undefined, // Tamanho da fonte padrão (defaultFontSize)
    );
    this.scene.add.existing(button).setScale(scale);
    return button;
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
