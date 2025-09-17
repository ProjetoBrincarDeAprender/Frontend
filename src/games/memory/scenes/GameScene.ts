import { MemoryGameLogic } from "../logic/MemoryGameLogic";

export class MemoryGameScene extends Phaser.Scene {
  private logic: MemoryGameLogic;

  constructor() {
    super({ key: "MemoryGameScene" });
    this.logic = new MemoryGameLogic(this);
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
    this.logic.createCards();
  }

  update() {
    if (this.logic.isLevelFinished()) {
      this.logic.finishLevel();
      this.scene.restart();
    }
    if (this.logic.isGameFinished()) {
      this.scene.stop(this.scene.key);
      this.scene.start("MemoryEndScene");
    }
  }
}
