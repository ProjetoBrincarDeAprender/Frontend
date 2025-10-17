import ButtonManager from "@/games/common/managers/ButtonManager";
import ButtonFactory from "@/games/common/factories/ButtonFactory";
import ButtonContentGenerator from "@/games/common/content/ButtonContentGenerator";
import LettersStrategy from "@/games/common/content/LetterStrategy";
import type Level from "@/games/common/models/Level";

export default class VowelsButtonService<T extends Level> {
  private buttonManager: ButtonManager;
  private buttonFactory: ButtonFactory;

  constructor(buttonManager: ButtonManager, buttonFactory: ButtonFactory) {
    this.buttonManager = buttonManager;
    this.buttonFactory = buttonFactory;
  }

  createButtons(
    configs: any[],
    screenWidth: number,
    y: number = 500,
    nonInteractive: boolean = false,
  ) {
    return this.buttonFactory.createButtons(
      configs,
      screenWidth,
      y,
      nonInteractive,
    );
  }

  getButtons() {
    return this.buttonManager.getButtons();
  }

  setButtonTexts(level: T, options?: string[]): void {
    if (options) {
      this.buttonManager.setButtonTexts(options);
    } else {
      const buttonContentGenerator = new ButtonContentGenerator(
        new LettersStrategy(),
      );
      const answer = level.getAnswer();
      const buttonsNumber = this.buttonManager.getButtons().length;
      const buttonTexts = buttonContentGenerator.generate(
        buttonsNumber,
        answer,
      );
      this.buttonManager.setButtonTexts(buttonTexts);
    }
  }
}
