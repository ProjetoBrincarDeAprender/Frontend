import ButtonManager from "@/games/common/managers/ButtonManager";
import ButtonFactory from "@/games/common/factories/ButtonFactory";
import type VowelsLevel from "../logic/VowelsLevel";
import ButtonContentGenerator from "@/games/common/content/ButtonContentGenerator";
import LettersStrategy from "@/games/common/content/LetterStrategy";

export default class VowelsButtonService {
  private buttonManager: ButtonManager;
  private buttonFactory: ButtonFactory;

  constructor(buttonManager: ButtonManager, buttonFactory: ButtonFactory) {
    this.buttonManager = buttonManager;
    this.buttonFactory = buttonFactory;
  }

  createButtons(configs: any[], screenWidth: number) {
    return this.buttonFactory.createButtons(configs, screenWidth);
  }

  getButtons() {
    return this.buttonManager.getButtons();
  }

  setButtonTexts(level: VowelsLevel) {
    const buttonContentGenerator = new ButtonContentGenerator(
      new LettersStrategy(),
    );
    const answer = level.getAnswer();
    const buttonsNumber = this.buttonManager.getButtons().length;
    const buttonTexts = buttonContentGenerator.generate(buttonsNumber, answer);
    this.buttonManager.setButtonTexts(buttonTexts);
  }
}
