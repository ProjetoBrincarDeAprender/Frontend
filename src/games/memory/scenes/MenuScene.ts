import ButtonManager from "@/games/common/managers/ButtonManager";

export class MemoryMenuScene extends Phaser.Scene {
  private readonly buttonManager: ButtonManager;

  constructor() {
    super({ key: "MemoryMenuScene" });

    this.buttonManager = new ButtonManager(this);
  }

  preload() {
    this.load.image("menu-icon", "/assets/memoryGame/memoryCardIcon.png");
    this.load.image("defaultButton", "/assets/common/defaultButton.svg");
    this.load.image("hoverButton", "/assets/common/hoverButton.svg");
    this.load.image("clickedButton", "/assets/common/clickedButton.svg");
  }

  create() {
    this.add
      .image(Math.floor(this.scale.width / 2), 100, "menu-icon")
      .setScale(0.2);
    this.add
      .text(Math.floor(this.scale.width / 2), 150, "Jogo da Memoria", {
        fontSize: "2rem",
        color: "#000",
      })
      .setOrigin(0.5, 0);

    this.buttonManager.createButtons(
      [
        { x: 350, y: 300 },
        { x: 450, y: 300 },
      ],
      ["defaultButton", "hoverButton", "clickedButton"],
      ["Começar", "Sair"],
      [16, 16],
    );

    this.buttonManager.getButtons()[0].on("pointerdown", () => {
      this.scene.start("MemoryGameScene");
    });

    this.buttonManager.getButtons()[1].on("pointerdown", () => {
      window.history.back();
    });
  }

  update() {
    // Update the main menu
  }
}
