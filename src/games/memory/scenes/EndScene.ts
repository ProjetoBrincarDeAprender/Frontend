export class MemoryEndScene extends Phaser.Scene {
  constructor() {
    super({ key: "MemoryEndScene" });
  }

  preload() {
    // Load assets for the end scene
  }

  create() {
    this.add
      .text(
        Math.floor(this.scale.width / 2),
        Math.floor(this.scale.height / 2),
        "Jogo Finalizado",
        { fontSize: "32px", color: "#000" },
      )
      .setOrigin(0.5, 0.5);
  }

  update() {
    // Update the end scene
  }
}
