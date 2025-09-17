import { MemoryGameLogic } from "../logic/MemoryGameLogic";

export class MemoryGameScene extends Phaser.Scene {
  private logic: MemoryGameLogic;

  constructor() {
    super({ key: "MemoryGameScene" });
    this.logic = new MemoryGameLogic(this);
  }

  preload() {
    this.load.image("star", "/assets/common/star.svg");
  }

  create() {
    this.logic.createCards();
  }

  update() {
    if (this.logic.isGameFinished()) {
      this.scene.start("MemoryEndScene");
    }
    if (this.logic.isLevelFinished()) {
      this.scene.restart();
      this.logic.finishLevel();
    }
  }
}
