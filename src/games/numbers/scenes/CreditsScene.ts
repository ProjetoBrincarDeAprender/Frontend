import Phaser from "phaser";

export default class CreditsScene extends Phaser.Scene {
  constructor() {
    super("numbersCredits");
  }

  create() {
    // Imagem de fundo
    const background = this.add.image(400, 300, "numbersBackground");
    background.setDisplaySize(800, 600);

    // Container com blur e opacidade baixa
    const container = this.add.graphics();
    container.fillStyle(0xffffff, 0.5); // Mais opaco para celebração
    container.fillRoundedRect(50, 50, 700, 500, 25);
    container.lineStyle(3, 0x4caf50, 0.8); // Borda verde celebrativa
    container.strokeRoundedRect(50, 50, 700, 500, 25);

    // Estrelas decorativas
    for (let i = 0; i < 20; i++) {
      const x = Phaser.Math.Between(80, 720);
      const y = Phaser.Math.Between(80, 520);
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

    // Mensagem principal em CAPSLOCK
    this.add
      .text(400, 220, "PARABÉNS!", {
        color: "#4CAF50",
        fontSize: "56px",
        fontFamily: "Arial Black",
        stroke: "#FFFFFF",
        strokeThickness: 5,
        shadow: {
          offsetX: 3,
          offsetY: 3,
          color: "rgba(0,0,0,0.5)",
          blur: 4,
          fill: true,
        },
      })
      .setOrigin(0.5);

    this.add
      .text(400, 300, "VOCÊ COMPLETOU TODAS AS SEQUÊNCIAS!", {
        color: "#2E7D32",
        fontSize: "28px",
        fontFamily: "Arial Black",
        stroke: "#FFFFFF",
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    this.add
      .text(400, 380, "MUITO BEM! CONTINUE APRENDENDO!", {
        color: "#FF6F00",
        fontSize: "26px",
        fontFamily: "Arial Black",
        stroke: "#FFFFFF",
        strokeThickness: 3,
      })
      .setOrigin(0.5);
  }
}
