import Phaser from "phaser";

export default class CreditsScene extends Phaser.Scene {
  constructor() {
    super("numbersCredits");
  }

  create() {
    // Fundo celebrativo
    this.add.rectangle(400, 300, 800, 600, 0xe8f5e8);

    // Estrelas decorativas
    for (let i = 0; i < 20; i++) {
      const x = Phaser.Math.Between(50, 750);
      const y = Phaser.Math.Between(50, 550);
      const star = this.add.text(x, y, "⭐", {
        fontSize: "24px",
      });

      // Animação das estrelas
      this.tweens.add({
        targets: star,
        scale: { from: 0.5, to: 1.5 },
        duration: Phaser.Math.Between(1000, 2000),
        yoyo: true,
        repeat: -1,
      });
    }

    // Mensagem principal
    this.add
      .text(400, 250, "🎉 Parabéns! 🎉", {
        color: "#4CAF50",
        fontSize: "48px",
        fontFamily: "Arial Black",
        stroke: "#FFFFFF",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    this.add
      .text(400, 320, "Você completou todas as sequências!", {
        color: "#2E7D32",
        fontSize: "28px",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    this.add
      .text(400, 380, "Muito bem! Continue aprendendo! 📚✨", {
        color: "#FF6F00",
        fontSize: "24px",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);
  }
}
