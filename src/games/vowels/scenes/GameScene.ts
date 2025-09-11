import ButtonManager from "../../common/managers/ButtonManager";
import Logic from "../logic/Logic";
import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  private buttonManager: ButtonManager;
  private logic: Logic;

  constructor() {
    super("Vowels");

    this.buttonManager = new ButtonManager(this);
    this.logic = new Logic(this);
  }

  preload() {
    this.load.image("abelha", "/assets/vowelsGame/abelha.svg");
    this.load.image("elefante", "/assets/vowelsGame/elefante.svg");
    this.load.image("star", "/assets/common/star.svg");
    this.load.image("defaultButton", "/assets/common/defaultButton.svg");
    this.load.image("hoverButton", "/assets/common/hoverButton.svg");
    this.load.image("clickedButton", "/assets/common/clickedButton.svg");
  }

  create() {
    const buttonPositions: { x: number; y: number }[] = [
      { x: 200, y: 500 },
      { x: 400, y: 500 },
      { x: 600, y: 500 },
    ];
    const buttonTextures: string[] = [
      "defaultButton",
      "hoverButton",
      "clickedButton",
    ];
    this.buttonManager.createButtons(buttonPositions, buttonTextures);
    this.logic.createImage(this.logic.accessCurrentLevel().getName());
    this.setupLevel();

    console.log("Jogo das vogais carregado!");
  }

  update() {}

  setupLevel() {
    const answer: string = this.logic.accessCurrentLevel().getAnswer();
    const buttonsNumber: number = this.buttonManager.getButtons().length;
    const buttonTexts: string[] = this.logic.generateButtonsLetters(
      buttonsNumber,
      answer,
    );
    this.buttonManager.setButtonTexts(buttonTexts);
    this.logic.setImageTexture(this.logic.accessCurrentLevel().getName());

    this.buttonManager.getButtons().forEach((button) => {
      button.off("pointerdown");
      button.on("pointerdown", () => {
        const result = this.logic.handleAnswer(button, this.time.now, "star");

        this.time.delayedCall(1000, () => {
          if (result.correct) {
            if (result.finished) {
              this.scene.start("vowelsCredits");
            } else {
              this.logic.nextLevel(this.buttonManager);
            }
          }
        });
      });
    });
  }
}
