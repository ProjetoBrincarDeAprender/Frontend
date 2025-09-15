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
    texts?: string[],
    fontSizes?: number[],
  ): void {
    this.buttons = positions.map((pos, index) => {
      const button = new Button(
        this.scene,
        pos.x,
        pos.y,
        textures[0], // Imagem padrão (defaultImage)
        textures[1], // Imagem hover (hoverImage)
        textures[2], // Imagem do clique (clickImage)
        texts ? texts[index] : "", // Texto do botão (buttonText)
        fontSizes ? fontSizes[index] : undefined, // Tamanho da fonte padrão (defaultFontSize)
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
}
