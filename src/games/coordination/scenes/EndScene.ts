import Phaser from "phaser";

export default class CoordinationEndScene extends Phaser.Scene {
  constructor() {
    super({ key: "CoordinationEndScene" });
  }

  create() {
    this.add
      .text(400, 250, "Parabéns! Você completou todas as fases!", {
        fontSize: "28px",
        color: "#0f172a",
        fontFamily: "Arial Black",
      })
      .setOrigin(0.5);

    const btn = this.add
      .text(400, 340, "Mais jogos", {
        fontSize: "24px",
        color: "#1d4ed8",
        backgroundColor: "#fde68a",
        padding: { left: 16, right: 16, top: 8, bottom: 8 },
      })
      .setOrigin(0.5)
      .setInteractive({ cursor: "pointer" });

    btn.on("pointerdown", () => {
      window.location.href = "/games";
    });
  }
}
