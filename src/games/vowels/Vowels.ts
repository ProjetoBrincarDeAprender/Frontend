import { EventBus } from "../common/utils/EventBus";
import ButtonManager from "../common/ButtonManager";
import Phaser from "phaser";
import Level from "./Level";
import GameStats from "../common/GameStats";
import LevelManager from "../common/LevelManager";
import Logic from "./Logic";
import type Button from "../common/Button";

export default class Vowels extends Phaser.Scene {
  private image?: Phaser.GameObjects.Image;
  private gameStats: GameStats;
  private levelManager: LevelManager;
  private buttonManager: ButtonManager;
  private logic: Logic;

  constructor() {
    super("Vowels");

    const levels: Level[] = [];
    levels.push(new Level("abelha", "A"));
    levels.push(new Level("elefante", "E"));

    this.gameStats = new GameStats();
    this.levelManager = new LevelManager(levels);
    this.buttonManager = new ButtonManager(this);
    this.logic = new Logic();
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

    const firstImage: string = this.levelManager
      .getCurrentLevel()
      .getLevelName();
    this.image = this.add.image(400, 300, firstImage);
    console.log("Jogo das vogais carregado!");
  }

  update() {}

  setupLevel() {
    const answer: string = this.levelManager.getCurrentLevel().getAnswer();
    const buttonsNumber: number = this.buttonManager.buttons.length;
    const buttonTexts: string[] = this.logic.generateButtonsLetters(
      buttonsNumber,
      answer,
    );
    this.buttonManager.setButtonTexts(buttonTexts);
    this.buttonManager.addButtonsOnScene();

    this.buttonManager.buttons.forEach((button) => {
      button.once("pointerdown", () => {
        this.handleButtonClick(button);
      });
    });
  }

  handleButtonClick(button: Button) {
    let currentLevel: Level = this.levelManager.getCurrentLevel();
    const text: string = button.getButtonText();

    if (this.image) {
      if (currentLevel.isCorrectLetter(text)) {
        const currentIndex: number = this.levelManager.getCurrentIndex();

        this.gameStats.addHitTime(this.time.now);
        console.log(`Tempo: ${this.gameStats.hitTimes[currentIndex]}`);
        this.gameStats.resetInitialLevelTime(this.time.now);

        this.gameStats.addMissCount();
        console.log(`Erros: ${this.gameStats.missCounts[currentIndex]}`);
        this.gameStats.resetActualLevelMisses();

        this.levelManager.nextLevel();

        if (this.levelManager.isFinished()) {
          this.scene.start("vowelsCredits");
          return;
        }

        currentLevel = this.levelManager.getCurrentLevel();
        const answer: string = this.levelManager.getCurrentLevel().getAnswer();
        const buttonsNumber: number = this.buttonManager.buttons.length;

        this.image.setTexture(currentLevel.getLevelName());

        let buttonTexts = this.logic.generateButtonsLetters(
          buttonsNumber,
          answer,
        );
        this.buttonManager.setButtonTexts(buttonTexts);
      } else {
        this.gameStats.addMiss();
      }
    }
  }
}
