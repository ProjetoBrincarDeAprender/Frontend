import { EventBus } from "../common/utils/EventBus";
import ButtonManager from "../common/ButtonManager";
import Phaser from "phaser";
import Level from "./Level";
import GameStats from "../common/GameStats";
import LevelManager from "../common/LevelManager";

export default class Vowels extends Phaser.Scene {
  private image?: Phaser.GameObjects.Image;
  private gameStats: GameStats;
  private levelManager: LevelManager;
  private buttonManager: ButtonManager;

  constructor() {
    super("Vowels");

    const levels: Level[] = [];
    levels.push(new Level("abelha", "A"));
    levels.push(new Level("elefante", "E"));

    this.gameStats = new GameStats();
    this.levelManager = new LevelManager(levels);
    this.buttonManager = new ButtonManager(this);
  }

  preload() {
    this.load.image("abelha", "/assets/vowelsGame/abelha.svg");
    this.load.image("elefante", "/assets/vowelsGame/elefante.svg");

    this.load.image("defaultButton", "/assets/common/defaultButton.svg");
    this.load.image("hoverButton", "/assets/common/hoverButton.svg");
    this.load.image("clickedButton", "/assets/common/clickedButton.svg");
  }

  create() {
    let letterArray = this.levelManager
      .getCurrentLevel()
      .defineButtonsLetters(3);

    this.buttonManager.createButtons(
      [
        { x: 200, y: 500 },
        { x: 400, y: 500 },
        { x: 600, y: 500 },
      ],
      ["defaultButton", "hoverButton", "clickedButton"],
    );

    this.buttonManager.setButtonTexts(letterArray);

    this.add.existing(this.buttonManager.buttons[0]);
    this.add.existing(this.buttonManager.buttons[1]);
    this.add.existing(this.buttonManager.buttons[2]);

    this.buttonManager.buttons[0].on("pointerdown", () => {
      this.changeLevel(this.buttonManager.buttons[0].getButtonText());
    });

    this.buttonManager.buttons[1].on("pointerdown", () => {
      this.changeLevel(this.buttonManager.buttons[1].getButtonText());
    });

    this.buttonManager.buttons[2].on("pointerdown", () => {
      this.changeLevel(this.buttonManager.buttons[2].getButtonText());
    });

    const firstImage = this.levelManager.getCurrentLevel().getName();
    this.image = this.add.image(400, 300, firstImage);

    EventBus.emit("current-scene-ready", "O jogo das vogais foi carregado!");
  }

  update() {}

  changeLevel(letter: string) {
    let currentLevel: Level = this.levelManager.getCurrentLevel();

    if (this.image) {
      // Se é a resposta correta do nível em que estamos nesse momento
      if (currentLevel.isCorrectLetter(letter)) {
        this.gameStats.addHitTime(this.time.now);
        console.log(`Tempo: ${this.gameStats.hitTimes}`);
        this.gameStats.resetInitialLevelTime(this.time.now);

        this.gameStats.addMissCount();
        console.log(`Erros: ${this.gameStats.missCounts}`);
        this.gameStats.resetActualLevelMisses();

        this.levelManager.nextLevel();

        if (this.levelManager.isFinished()) {
          this.scene.start("vowelsCredits");
          return;
        }

        currentLevel = this.levelManager.getCurrentLevel();

        this.image.setTexture(currentLevel.getName());

        let letterArray = currentLevel.defineButtonsLetters(3);
        this.buttonManager.setButtonTexts(letterArray);
      } else {
        this.gameStats.addMiss();
      }
    }
  }
}
