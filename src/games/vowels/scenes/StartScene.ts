import EffectManager from "@/games/common/managers/EffectManager";
import Phaser from "phaser";

export default class Vowels extends Phaser.Scene {
  private effectManager: EffectManager;

  constructor() {
    super("vowelsStart");
    this.effectManager = new EffectManager(this);
  }

  preload() {
    this.load.image("startScreen", "/assets/vowelsGame/startScreen.png");
  }

  create() {
    const gameWidth = this.cameras.main.width;
    const gameHeight = this.cameras.main.height;
    this.add.image(gameWidth / 2, gameHeight / 2, "startScreen");
    this.add.rectangle(
      gameWidth / 2,
      gameHeight / 2,
      gameWidth,
      gameHeight,
      0x000000,
      0.5,
    );

    const text = this.add
      .text(gameWidth / 2, gameHeight / 2, "Clique para começar", {
        fontFamily: "Verdana, Geneva, sans-serif",
        fontSize: "22px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(10);

    this.effectManager.floatingElement(text);

    this.input.once("pointerdown", () => {
      this.scene.start("vowelsGameScene");
    });
  }

  update() {}
}
