import ButtonManager from "@/games/common/managers/ButtonManager";
import EffectManager from "@/games/common/managers/EffectManager";
import Phaser from "phaser";

export default class Vowels extends Phaser.Scene {
  private buttonManager: ButtonManager;
  private effectManager: EffectManager;

  constructor() {
    super("vowelsStart");
    this.buttonManager = new ButtonManager(this);
    this.effectManager = new EffectManager(this);
  }

  preload() {
    this.load.image(
      "backgroundStart",
      "/assets/vowelsGame/images/backgroundMain.jpeg",
    );
    this.load.image(
      "hoverButtonRectangle",
      "/assets/common/hoverButtonRectangle.svg",
    );
    this.load.image(
      "defaultButtonRectangle",
      "/assets/common/defaultButtonRectangle.svg",
    );
    this.load.image(
      "clickedButtonRectangle",
      "/assets/common/clickedButtonRectangle.svg",
    );
    this.load.image(
      "defaultRectangleRed",
      "/assets/common/defaultRectangleRed.svg",
    );
    this.load.image(
      "hoverRectangleRed",
      "/assets/common/hoverRectangleRed.svg",
    );
    this.load.image(
      "clickedRectangleRed",
      "/assets/common/clickedRectangleRed.svg",
    );
  }

  create() {
    const gameWidth = this.cameras.main.width;
    const gameHeight = this.cameras.main.height;

    this.createBackground();

    this.add
      .text(gameWidth / 2, gameHeight / 2 - 100, "Jogo das Vogais", {
        color: "#ffffff",
        fontFamily: "Verdana, Geneva, sans-serif",
        fontSize: "64px",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(10);

    const startButton = this.buttonManager.createButton(
      { x: gameWidth / 2, y: gameHeight / 2 + 60 },
      [
        "defaultButtonRectangle",
        "hoverButtonRectangle",
        "clickedButtonRectangle",
      ],
      "▶ Iniciar",
      40,
    );

    const exitButton = this.buttonManager.createButton(
      { x: gameWidth / 2, y: gameHeight / 2 + 140 },
      ["defaultRectangleRed", "hoverRectangleRed", "clickedRectangleRed"],
      "Sair",
      40,
      0.7,
    );

    startButton.setInteractive().on("pointerup", () => {
      this.scene.start("vowelsGameScene");
    });

    exitButton.setInteractive().on("pointerup", () => {
      window.history.back();
    });
  }

  update() {}

  private createBackground(): void {
    const background = this.add.image(400, 300, "backgroundStart");
    const scaleX = this.cameras.main.width / background.width;
    const scaleY = this.cameras.main.height / background.height;
    const scale = Math.max(scaleX, scaleY);
    background.setScale(scale);
    this.effectManager.overlay(0.3);
  }
}
