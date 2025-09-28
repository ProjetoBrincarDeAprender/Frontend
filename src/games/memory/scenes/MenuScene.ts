export class MemoryMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MemoryMenuScene" });
  }

  preload() {
    this.load.image("defaultButton", "/assets/common/defaultButton.svg");
    this.load.image("hoverButton", "/assets/common/hoverButton.svg");
    this.load.image("clickedButton", "/assets/common/clickedButton.svg");
    this.load.image("play-icon", "/assets/memoryGame/play.png");
    this.load.image("exit-icon", "/assets/memoryGame/exit.png");
    this.load.image("mascot", "/assets/common/dudaSentada.png");
    this.load.image("star", "/assets/common/star.svg");
  }

  create() {
    this.add.image(this.scale.width / 2, 80, "mascot").setScale(0.3);

    this.add
      .text(this.scale.width / 2, 160, "Jogo da Memória", {
        fontFamily: "Comic Sans MS, Arial, sans-serif",
        fontSize: "40px",
        color: "#2D5EFF",
        fontStyle: "bold",
        stroke: "#2D5EF0",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    this.add
      .text(this.scale.width / 2, 210, "CLIQUE EM COMEÇAR PARA JOGAR!", {
        fontFamily: "Arial, sans-serif",
        fontSize: "24px",
        color: "#333",
        backgroundColor: "#96D6F3",
        padding: { left: 10, right: 10, top: 4, bottom: 4 },
      })
      .setOrigin(0.5);

    const playContainer = this.add.container(this.scale.width / 2 - 120, 300);
    const playButton = this.add.rectangle(0, 0, 200, 60, 0x2d5eff);
    const playIcon = this.add.image(-70, 0, "play-icon").setScale(0.08);
    const playText = this.add
      .text(10, 0, "COMEÇAR", {
        fontFamily: "Arial, sans-serif",
        fontSize: "18px",
        color: "#FFFFFF",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    playContainer.add([playButton, playIcon, playText]);
    playContainer.setInteractive(
      new Phaser.Geom.Rectangle(-100, -30, 200, 60),
      Phaser.Geom.Rectangle.Contains,
    );

    const exitContainer = this.add.container(this.scale.width / 2 + 120, 300);
    const exitButton = this.add.rectangle(0, 0, 200, 60, 0xff5555);
    const exitIcon = this.add.image(-70, 0, "exit-icon").setScale(0.08);
    const exitText = this.add
      .text(10, 0, "SAIR", {
        fontFamily: "Arial, sans-serif",
        fontSize: "18px",
        color: "#FFFFFF",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    exitContainer.add([exitButton, exitIcon, exitText]);
    exitContainer.setInteractive(
      new Phaser.Geom.Rectangle(-100, -30, 200, 60),
      Phaser.Geom.Rectangle.Contains,
    );

    playContainer.on("pointerover", () => {
      playButton.setFillStyle(0x4a7cff);
    });
    playContainer.on("pointerout", () => {
      playButton.setFillStyle(0x2d5eff);
    });
    playContainer.on("pointerdown", () => {
      const shouldReset = this.registry.get("resetGame") || false;
      this.registry.set("resetGame", false);

      if (shouldReset) {
        this.registry.set("currentLevel", 0);
      }

      this.scene.start("MemoryGameScene", { resetGame: shouldReset });
    });
    exitContainer.on("pointerover", () => {
      exitButton.setFillStyle(0xff7777);
    });
    exitContainer.on("pointerout", () => {
      exitButton.setFillStyle(0xff5555);
    });
    exitContainer.on("pointerdown", () => {
      window.history.back();
    });

    for (let i = 0; i < 5; i++) {
      this.add
        .image(this.scale.width / 2 - 80 + i * 40, 380, "star")
        .setScale(0.5);
    }
  }

  update() {}
}
