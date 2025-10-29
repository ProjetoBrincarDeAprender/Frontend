import Phaser from "phaser";
import { AudioManager } from "../managers/AudioManager";
import { PreloadScene } from "./PreloadScene";

export class LevelCompletedScene extends PreloadScene {
  private backgroundKey: string;
  private backgroundPath: string;
  private dudaImagePath: string;
  private dudaImageKey: string;
  private nextLevelScene: string;
  private menuScene: string;
  private levelTitle: string;

  constructor(config?: {
    backgroundPath?: string;
    backgroundKey?: string;
    dudaImagePath?: string;
    dudaImageKey?: string;
    nextLevelScene?: string;
    menuScene?: string;
    levelTitle?: string;
  }) {
    super({ key: "LevelCompleteScene" });
    this.backgroundPath =
      config?.backgroundPath || "/assets/spaceGame/background.png";
    this.backgroundKey = config?.backgroundKey || "backgroundStart";
    this.dudaImagePath =
      config?.dudaImagePath || "/assets/common/duda/dudaClap.png";
    this.dudaImageKey = config?.dudaImageKey || "dudaClap";
    this.nextLevelScene = config?.nextLevelScene || "GameScene";
    this.menuScene = config?.menuScene || "StartScene";
    this.levelTitle = config?.levelTitle || "NÍVEL CONCLUÍDO!";
  }

  init() {
    new AudioManager(this);
  }

  // Método estático para criar uma instância com configuração específica
  static create(
    nextLevelScene?: string,
    menuScene?: string,
    backgroundPath?: string,
    backgroundKey?: string,
    dudaImagePath?: string,
    dudaImageKey?: string,
    levelTitle?: string,
  ): LevelCompletedScene {
    return new LevelCompletedScene({
      nextLevelScene,
      menuScene,
      backgroundPath,
      backgroundKey,
      dudaImagePath,
      dudaImageKey,
      levelTitle,
    });
  }

  preload() {
    super.preload();
    this.load.image("trophy", "/assets/common/trophy.png");
    this.load.image(this.dudaImageKey, this.dudaImagePath);
    this.load.image("star", "/assets/common/star.svg");
    this.load.image(this.backgroundKey, this.backgroundPath);

    this.load.audio("celebration", "/assets/common/sounds/complete.mp3");
  }
  create() {
    this.sound.play("celebration", { volume: 10 });

    this.createBackground();
    this.createCongratsMessage();
    this.createMainContent();
    this.createButtons();
  }

  private createBackground() {
    this.add
      .image(this.scale.width / 2, this.scale.height / 2, this.backgroundKey)
      .setScale(1.2);

    // Overlay escuro
    this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0x000000,
      0.6,
    );
  }
  private createCongratsMessage() {
    for (let i = 0; i < 7; i++) {
      const star = this.add
        .image(
          Phaser.Math.Between(50, this.scale.width - 50),
          Phaser.Math.Between(50, this.scale.height - 50),
          "star",
        )
        .setScale(0.3);

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

    const housingSymbols = ["⭐", "🎉"];
    for (let i = 0; i < 8; i++) {
      const symbol = this.add
        .text(
          Phaser.Math.Between(50, this.scale.width - 50),
          Phaser.Math.Between(50, this.scale.height - 50),
          housingSymbols[Phaser.Math.Between(0, housingSymbols.length - 1)],
          {
            fontSize: "40px",
            color: "#FFD700",
            fontStyle: "bold",
          },
        )
        .setOrigin(0.5);

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
  }
  private createMainContent() {
    this.add
      .text(400, 130, this.levelTitle, {
        fontFamily: "Comic Sans MS, Arial, sans-serif",
        fontSize: "42px",
        color: "#FFD700",
        fontStyle: "bold",
        stroke: "#2D4A9E",
        strokeThickness: 4,
        align: "center",
      })
      .setOrigin(0.5);

    const dudaClap = this.add
      .image(this.scale.width / 2, 310, this.dudaImageKey)
      .setScale(0.2);

    this.tweens.add({
      targets: dudaClap,
      y: 320,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }
  private createButtons() {
    const restartContainer = this.add.container(
      this.scale.width / 2 - 120,
      500,
    );

    // Sombra do botão (retângulo mais escuro atrás)
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.3);
    shadow.fillRoundedRect(-122, -38, 244, 84, 20);

    // Botão principal com bordas arredondadas
    const buttonGraphics = this.add.graphics();
    buttonGraphics.fillStyle(0x16a34a);
    buttonGraphics.fillRoundedRect(-120, -40, 240, 80, 20);

    // Texto do botão
    const restartText = this.add
      .text(0, 0, "PRÓXIMO NÍVEL", {
        fontFamily: "Arial Black",
        fontSize: "20px",
        color: "#FFFFFF",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Adicionar elementos ao container
    restartContainer.add([shadow, buttonGraphics, restartText]);

    // Configurar interatividade
    restartContainer.setInteractive(
      new Phaser.Geom.Rectangle(-120, -40, 240, 80),
      Phaser.Geom.Rectangle.Contains,
    );

    // Eventos de hover
    restartContainer.on("pointerover", () => {
      buttonGraphics.clear();
      buttonGraphics.fillStyle(0x22c55e);
      buttonGraphics.fillRoundedRect(-120, -40, 240, 80, 20);

      this.tweens.add({
        targets: restartContainer,
        scale: 1.05,
        duration: 150,
        ease: "Power2.easeOut",
        cursor: "pointer",
      });
    });

    restartContainer.on("pointerout", () => {
      buttonGraphics.clear();
      buttonGraphics.fillStyle(0x16a34a);
      buttonGraphics.fillRoundedRect(-120, -40, 240, 80, 20);

      this.tweens.add({
        targets: restartContainer,
        scale: 1,
        duration: 150,
        ease: "Power2.easeOut",
      });
    });

    // Evento de clique
    restartContainer.on("pointerdown", () => {
      this.tweens.add({
        targets: restartContainer,
        scale: 0.95,
        duration: 100,
        yoyo: true,
        ease: "Power2.easeInOut",
        onComplete: () => {
          // Vai para próximo nível
          if (this.nextLevelScene.startsWith("/")) {
            // Se começa com '/', é uma URL - redireciona
            window.location.href = this.nextLevelScene;
          } else {
            // Se não, é uma cena do Phaser - inicia a cena
            this.scene.start(this.nextLevelScene);
          }
        },
      });
    });

    // Botão principal com bordas arredondadas
    const backbuttonGraphics = this.add.graphics();
    backbuttonGraphics.fillStyle(0xff6b35);
    backbuttonGraphics.fillRoundedRect(-120, -40, 240, 80, 20);
    const backContainer = this.add.container(this.scale.width / 2 + 140, 500);

    // Texto do botão
    const backText = this.add
      .text(0, 0, "VOLTAR AO MENU", {
        fontFamily: "Arial Black",
        fontSize: "20px",
        color: "#FFFFFF",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Adicionar elementos ao container
    backContainer.add([shadow, backbuttonGraphics, backText]);

    // Configurar interatividade
    backContainer.setInteractive(
      new Phaser.Geom.Rectangle(-120, -40, 240, 80),
      Phaser.Geom.Rectangle.Contains,
    );

    // Eventos de hover
    backContainer.on("pointerover", () => {
      backbuttonGraphics.clear();
      backbuttonGraphics.fillStyle(0xff6b35);
      backbuttonGraphics.fillRoundedRect(-120, -40, 240, 80, 20);

      this.tweens.add({
        targets: backContainer,
        scale: 1.05,
        duration: 150,
        ease: "Power2.easeOut",
        cursor: "pointer",
      });
    });

    backContainer.on("pointerout", () => {
      backbuttonGraphics.clear();
      backbuttonGraphics.fillStyle(0xff6b35);
      backbuttonGraphics.fillRoundedRect(-120, -40, 240, 80, 20);

      this.tweens.add({
        targets: backContainer,
        scale: 1,
        duration: 150,
        ease: "Power2.easeOut",
      });
    });

    // Evento de clique
    backContainer.on("pointerdown", () => {
      this.tweens.add({
        targets: backContainer,
        scale: 0.95,
        duration: 100,
        yoyo: true,
        ease: "Power2.easeInOut",
        onComplete: () => {
          // Vai para o menu
          if (this.menuScene.startsWith("/")) {
            // Se começa com '/', é uma URL - redireciona
            window.location.href = this.menuScene;
          } else {
            // Se não, é uma cena do Phaser - inicia a cena
            this.scene.start(this.menuScene);
          }
        },
      });
    });
  }
}
