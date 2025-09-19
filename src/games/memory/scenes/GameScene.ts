import { MemoryGameLogic } from "../logic/MemoryGameLogic";

export class MemoryGameScene extends Phaser.Scene {
  private logic!: MemoryGameLogic;

  constructor() {
    super({ key: "MemoryGameScene" });
  }

  init(data: { resetGame?: boolean } = {}) {
    this.logic = new MemoryGameLogic(this);

    if (data.resetGame) {
      this.logic.resetGame();
      this.registry.set("currentLevel", 0);
    } else {
      const savedLevel = this.registry.get("currentLevel");
      if (savedLevel !== undefined && savedLevel > 0) {
        this.logic.setCurrentLevelFromRegistry(savedLevel);
      }
    }
  }
  preload() {
    this.load.image("star", "/assets/common/star.svg");
    this.load.image("card-0", "/assets/memoryGame/banguela.png");
    this.load.image("card-1", "/assets/memoryGame/peppa.png");
    this.load.image("card-2", "/assets/memoryGame/gato.png");
    this.load.image("card-3", "/assets/memoryGame/papagaio.png");
    this.load.image("card-4", "/assets/memoryGame/cavalo.png");
  }

  create() {
    this.logic.initializeLevel();
    this.logic.createCards();
  }

  update() {
    if (this.logic.isLevelFinished()) {
      const currentLevel = this.logic.getCurrentLevel();

      this.logic.finishLevel();

      const isGameFinished = this.logic.isGameFinished();

      this.registry.set("currentLevel", this.logic.getCurrentLevel());

      if (isGameFinished) {
        this.scene.start("MemoryEndScene");
      } else {
        this.scene.start("MemoryLevelCompleteScene", {
          level: currentLevel,
          isLastLevel: false,
        });
      }
    }
  }
}
