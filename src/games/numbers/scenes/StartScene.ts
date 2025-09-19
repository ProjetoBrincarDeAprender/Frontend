import Phaser from "phaser";

export default class StartScene extends Phaser.Scene {
  constructor() {
    super("numbersStart");
  }

  preload() {}

  create() {
    this.add
      .text(400, 300, "Jogo de Sequência Numérica", {
        fontSize: "36px",
        color: "#2196F3",
        fontFamily: "Arial Black",
      })
      .setOrigin(0.5);

    const startButton = this.add
      .text(400, 400, "INICIAR", {
        fontSize: "24px",
        color: "#ffffff",
        backgroundColor: "#4CAF50",
        padding: { x: 30, y: 15 },
      })
      .setOrigin(0.5);

    startButton.setInteractive();
    startButton.on("pointerdown", () => {
      this.scene.start("numbersGameScene");
    });
  }

  update() {}
}
