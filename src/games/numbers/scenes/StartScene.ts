import Phaser from "phaser";

export default class StartScene extends Phaser.Scene {
  constructor() {
    super("numbersStart");
  }

  preload() {
    this.load.image("numbersStartBg", "/assets/numbersGame/startScreen.png");
  }

  create() {
    // Fundo espacial
    this.add.image(400, 300, "numbersStartBg");

    // Texto principal centralizado
    this.add
      .text(400, 480, "Clique para iniciar o jogo", {
        fontSize: "32px",
        color: "#ffffff",
        fontFamily: "Georgia, serif",
        fontStyle: "bold",
        stroke: "#000080",
        strokeThickness: 6,
        shadow: {
          offsetX: 3,
          offsetY: 3,
          color: "rgba(0,0,0,0.9)",
          blur: 8,
          fill: true,
        },
      })
      .setOrigin(0.5);

    // Área clicável cobrindo toda a tela
    const clickArea = this.add.rectangle(400, 300, 800, 600, 0x000000, 0);
    clickArea.setInteractive();
    clickArea.on("pointerdown", () => {
      this.scene.start("numbersGameScene");
    });
  }

  update() {}
}
