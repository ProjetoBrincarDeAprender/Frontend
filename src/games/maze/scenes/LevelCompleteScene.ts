import { AudioManager } from "@/games/common/managers/AudioManager";
import Phaser from "phaser";

export class MazeLevelCompleteScene extends Phaser.Scene {
  private nextLevel: number = 0;

  constructor() {
    super({ key: "MazeLevelCompleteScene" });
  }

  init(data: { nextLevel?: number } = {}) {
    this.nextLevel = data.nextLevel ?? 0;
    new AudioManager(this);
  }

  preload() {
    this.load.image("star", "/assets/common/star.svg");
    this.load.image("dudaClap", "/assets/common/duda/dudaClap.png");
    this.load.audio("celebration", "/assets/common/sounds/complete.mp3");
  }

  create() {
    this.sound.play("celebration", { volume: 10 });

    // Fundo
    const g = this.add.graphics();
    g.fillGradientStyle(0xe0f6ff, 0xe0f6ff, 0xc5e3f6, 0xc5e3f6, 1);
    g.fillRect(0, 0, 800, 600);

    // Overlay escuro
    this.add.rectangle(400, 300, 800, 600, 0x000000, 0.6);

    // Estrelas decorativas
    for (let i = 0; i < 7; i++) {
      const star = this.add.image(
        Phaser.Math.Between(50, 750),
        Phaser.Math.Between(50, 550),
        "star",
      );
      star.setScale(0.3);

      this.tweens.add({
        targets: star,
        alpha: 0.3,
        scale: 0.1,
        rotation: Math.PI * 2,
        duration: Phaser.Math.Between(1000, 2000),
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    }

    // Emojis de celebração
    const housingSymbols = ["⭐", "🎉"];
    for (let i = 0; i < 8; i++) {
      const symbol = this.add.text(
        Phaser.Math.Between(50, 750),
        Phaser.Math.Between(50, 550),
        housingSymbols[Phaser.Math.Between(0, housingSymbols.length - 1)],
        {
          fontSize: "40px",
          color: "#FFD700",
          fontStyle: "bold",
        },
      );
      symbol.setOrigin(0.5);

      this.tweens.add({
        targets: symbol,
        y: symbol.y - 30,
        alpha: 0.3,
        scale: 0.5,
        rotation: Math.PI,
        duration: Phaser.Math.Between(1500, 2500),
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    }

    // Título
    this.add
      .text(400, 130, "NÍVEL CONCLUÍDO!", {
        fontFamily: "Comic Sans MS, Arial, sans-serif",
        fontSize: "42px",
        color: "#FFD700",
        fontStyle: "bold",
        stroke: "#2D4A9E",
        strokeThickness: 4,
        align: "center",
      })
      .setOrigin(0.5);

    // Duda aplaudindo
    const dudaClap = this.add.image(400, 310, "dudaClap").setScale(0.2);

    this.tweens.add({
      targets: dudaClap,
      y: 320,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Botão Próximo Nível
    this.createNextButton();

    // Botão Voltar ao Menu
    this.createBackButton();
  }

  private createNextButton() {
    const container = this.add.container(280, 500);

    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.3);
    shadow.fillRoundedRect(-122, -38, 244, 84, 20);

    const buttonGraphics = this.add.graphics();
    buttonGraphics.fillStyle(0x16a34a);
    buttonGraphics.fillRoundedRect(-120, -40, 240, 80, 20);

    const text = this.add
      .text(0, 0, "PRÓXIMO NÍVEL", {
        fontFamily: "Arial Black",
        fontSize: "20px",
        color: "#FFFFFF",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    container.add([shadow, buttonGraphics, text]);

    container.setInteractive(
      new Phaser.Geom.Rectangle(-120, -40, 240, 80),
      Phaser.Geom.Rectangle.Contains,
    );

    container.on("pointerover", () => {
      buttonGraphics.clear();
      buttonGraphics.fillStyle(0x22c55e);
      buttonGraphics.fillRoundedRect(-120, -40, 240, 80, 20);
      this.tweens.add({
        targets: container,
        scale: 1.05,
        duration: 150,
        ease: "Power2.easeOut",
      });
    });

    container.on("pointerout", () => {
      buttonGraphics.clear();
      buttonGraphics.fillStyle(0x16a34a);
      buttonGraphics.fillRoundedRect(-120, -40, 240, 80, 20);
      this.tweens.add({
        targets: container,
        scale: 1,
        duration: 150,
        ease: "Power2.easeOut",
      });
    });

    container.on("pointerdown", () => {
      this.tweens.add({
        targets: container,
        scale: 0.95,
        duration: 100,
        yoyo: true,
        ease: "Power2.easeInOut",
        onComplete: () => {
          // Vai para o próximo nível
          this.scene.start("MazeGameScene", { startLevel: this.nextLevel });
        },
      });
    });
  }

  private createBackButton() {
    const container = this.add.container(520, 500);

    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.3);
    shadow.fillRoundedRect(-122, -38, 244, 84, 20);

    const buttonGraphics = this.add.graphics();
    buttonGraphics.fillStyle(0xff6b35);
    buttonGraphics.fillRoundedRect(-120, -40, 240, 80, 20);

    const text = this.add
      .text(0, 0, "VOLTAR AO MENU", {
        fontFamily: "Arial Black",
        fontSize: "20px",
        color: "#FFFFFF",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    container.add([shadow, buttonGraphics, text]);

    container.setInteractive(
      new Phaser.Geom.Rectangle(-120, -40, 240, 80),
      Phaser.Geom.Rectangle.Contains,
    );

    container.on("pointerover", () => {
      buttonGraphics.clear();
      buttonGraphics.fillStyle(0xff6b35);
      buttonGraphics.fillRoundedRect(-120, -40, 240, 80, 20);
      this.tweens.add({
        targets: container,
        scale: 1.05,
        duration: 150,
        ease: "Power2.easeOut",
      });
    });

    container.on("pointerout", () => {
      buttonGraphics.clear();
      buttonGraphics.fillStyle(0xff6b35);
      buttonGraphics.fillRoundedRect(-120, -40, 240, 80, 20);
      this.tweens.add({
        targets: container,
        scale: 1,
        duration: 150,
        ease: "Power2.easeOut",
      });
    });

    container.on("pointerdown", () => {
      this.tweens.add({
        targets: container,
        scale: 0.95,
        duration: 100,
        yoyo: true,
        ease: "Power2.easeInOut",
        onComplete: () => {
          this.scene.start("StartScene");
        },
      });
    });
  }
}
