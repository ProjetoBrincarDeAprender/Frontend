import LevelManager from "./LevelManager";

export default class ClickedButtonLogic {
  private scene: Phaser.Scene;
  private levelManager: LevelManager;

  constructor(scene: Phaser.Scene, levelManager: LevelManager) {
    this.scene = scene;
    this.levelManager = levelManager;
  }

  public showQuestion(): void {
    const text = this.levelManager.getActualLevel().getQuestion();
    this.scene.add
      .text(400, 80, text, {
        font: "40px Arial",
        color: "#250e00ff",
      })
      .setOrigin(0.5, 0.5);
  }
}
