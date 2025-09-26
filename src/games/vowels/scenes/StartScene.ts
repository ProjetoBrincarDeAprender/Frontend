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
    this.effectManager.overlay(0.5);

    this.add
      .text(gameWidth / 2, gameHeight / 2 - 100, "Jogo das Vogais", {
        fontFamily: "Verdana, Geneva, sans-serif",
        fontSize: "64px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(10);

    const startText = this.add
      .text(gameWidth / 2, gameHeight / 2 + 50, "Clique para começar", {
        fontFamily: "Verdana, Geneva, sans-serif",
        fontSize: "22px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(10);

    this.effectManager.floatingElement(startText);

    this.input.once("pointerdown", () => {
      this.scene.start("vowelsGameScene");
    });
  }

  update() {}
}
