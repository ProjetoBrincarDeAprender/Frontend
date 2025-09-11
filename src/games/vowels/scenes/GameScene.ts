import ButtonManager from "../../common/managers/ButtonManager";
import Phaser from "phaser";
import Level from "../../common/models/Level";
import LevelManager from "@/games/common/managers/LevelManager";
import Logic from "../logic/Logic";

export default class Vowels extends Phaser.Scene {
  private image?: Phaser.GameObjects.Image;
  private levelManager: LevelManager;
  private buttonManager: ButtonManager;
  private logic: Logic;

  constructor() {
    super("Vowels");

    const levels: Level[] = [];
    levels.push(new Level("abelha", "A"));
    levels.push(new Level("elefante", "E"));

    this.levelManager = new LevelManager(levels);
    this.buttonManager = new ButtonManager(this);
    this.logic = new Logic(this, this.levelManager);
  }

  preload() {
    this.load.image("abelha", "/assets/vowelsGame/abelha.svg");
    this.load.image("elefante", "/assets/vowelsGame/elefante.svg");

    this.load.image("defaultButton", "/assets/common/defaultButton.svg");
    this.load.image("hoverButton", "/assets/common/hoverButton.svg");
    this.load.image("clickedButton", "/assets/common/clickedButton.svg");
  }

  create() {
    const positions: { x: number; y: number }[] = [
      { x: 200, y: 500 },
      { x: 400, y: 500 },
      { x: 600, y: 500 },
    ];
    const textures: string[] = [
      "defaultButton",
      "hoverButton",
      "clickedButton",
    ];
    this.buttonManager.createButtons(positions, textures);
    this.setupLevel();

    const firstImage: string = this.levelManager.getCurrentLevel().getName();
    this.image = this.add.image(400, 300, firstImage);
    console.log("Jogo das vogais carregado!");
  }

  update() {}

  setupLevel() {
    const answer: string = this.levelManager.getCurrentLevel().getAnswer();
    const buttonsNumber: number = this.buttonManager.getButtons().length;
    const buttonTexts: string[] = this.logic.generateButtonsLetters(
      buttonsNumber,
      answer,
    );
    this.buttonManager.setButtonTexts(buttonTexts);

    this.buttonManager.getButtons().forEach((button) => {
      button.off("pointerdown");
      button.on("pointerdown", () => {
        const result = this.logic.handleAnswer(button, this.time.now);

        this.time.delayedCall(1000, () => {
          if (result.correct) {
            if (result.finished) {
              this.scene.start("vowelsCredits");
            } else {
              this.prepareNextLevel();
            }
          }
        });
      });
    });
  }

  prepareNextLevel() {
    let currentLevel: Level = this.levelManager.getCurrentLevel();

    this.image ? this.image.setTexture(currentLevel.getName()) : null;

    const buttonsNumber: number = this.buttonManager.getButtons().length;
    const buttonTexts = this.logic.generateButtonTexts(buttonsNumber);
    this.buttonManager.setButtonTexts(buttonTexts);
  }
}
