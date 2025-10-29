import Phaser from "phaser";
import { AudioManager } from "../managers/AudioManager";

export class EndScene extends Phaser.Scene {
  private restartSceneName: string;
  private backgroundKey: string;
  private backgroundPath: string;
  private subtitleMessage: string;
  private dudaImagePath: string;
  private dudaImageKey: string;

  constructor(config?: {
    restartScene?: string;
    backgroundPath?: string;
    backgroundKey?: string;
    subtitleMessage?: string;
    dudaImagePath?: string;
    dudaImageKey?: string;
  }) {
    super({ key: "EndScene" });
    this.restartSceneName = config?.restartScene || "/games";
    this.backgroundPath =
      config?.backgroundPath || "/assets/spaceGame/background.png";
    this.backgroundKey = config?.backgroundKey || "background";
    this.subtitleMessage = config?.subtitleMessage || "VOCÊ COMPLETOU O JOGO!";
    this.dudaImagePath =
      config?.dudaImagePath || "/assets/common/duda/dudaClap.png";
    this.dudaImageKey = config?.dudaImageKey || "dudaClap";
  }

  init() {
    new AudioManager(this);
  }

  // Método estático para criar uma instância com configuração específica
  static create(
    restartScene?: string,
    backgroundPath?: string,
    backgroundKey?: string,
    subtitleMessage?: string,
    dudaImagePath?: string,
    dudaImageKey?: string,
  ): EndScene {
    return new EndScene({
      restartScene,
      backgroundPath,
      backgroundKey,
      subtitleMessage,
      dudaImagePath,
      dudaImageKey,
    });
  }

  preload() {
    this.load.image("trophy", "/assets/common/trophy.png");
    this.load.image(this.dudaImageKey, this.dudaImagePath);
    this.load.image("congrats", "/assets/common/congrats.svg");

    // Carrega o background dinâmico baseado nos parâmetros
    this.load.image(this.backgroundKey, this.backgroundPath);

    //Audios
    this.load.audio("celebration", "/assets/common/sounds/complete.mp3");
  }
  create() {
    this.sound.play("celebration", { volume: 0.7 });

    this.createBackground();
    this.createMainContent();
    this.createRestartButton();
    this.createConfettiEffect();
  }

  private createBackground(): void {
    const bg = this.add.image(
      this.scale.width / 2,
      this.scale.height / 2,
      this.backgroundKey,
    );

    // Calcular escala para preencher a tela sem zoom excessivo
    const scaleX = this.scale.width / bg.width;
    const scaleY = this.scale.height / bg.height;
    const scale = Math.max(scaleX, scaleY);
    bg.setScale(scale);

    // Overlay escuro por cima do background
    this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0x000000,
      0.6,
    );
  }

  private createMainContent(): void {
    // Mensagem de parabéns
    this.add.image(this.scale.width / 2, 250, "congrats").setScale(0.5);

    // Troféu com animação
    const trophy = this.add.image(100, 340, "trophy").setScale(0.2);

    this.tweens.add({
      targets: trophy,
      y: 350,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Subtítulo personalizável
    this.add
      .text(this.scale.width / 2, 350, this.subtitleMessage, {
        fontSize: "28px",
        color: "#ffffff",
        fontFamily: "Arial",
        fontStyle: "bold",
        stroke: "#2D4A9E",
        strokeThickness: 4,
        align: "center",
      })
      .setOrigin(0.5);

    // Duda aplaudindo com imagem personalizável
    const dudaClap = this.add.image(700, 370, this.dudaImageKey).setScale(0.2);

    this.tweens.add({
      targets: dudaClap,
      y: 380,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  private createRestartButton(): void {
    // Container principal do botão
    const restartContainer = this.add.container(this.scale.width / 2, 470);

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
      .text(0, 0, "JOGAR NOVAMENTE", {
        fontFamily: "Arial",
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
          // Vai para a cena especificada ou para /games se não especificado
          if (this.restartSceneName.startsWith("/")) {
            // Se começa com '/', é uma URL - redireciona
            window.location.href = this.restartSceneName;
          } else {
            // Se não, é uma cena do Phaser - inicia a cena
            this.scene.start(this.restartSceneName);
          }
        },
      });
    });
  }

  private createConfettiEffect(): void {
    // Confetti colorido caindo
    for (let i = 0; i < 30; i++) {
      const colors = [
        0xffd700, 0xff6b35, 0x2d5eff, 0x16a34a, 0xff1744, 0x9c27b0,
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];

      const confetti = this.add.rectangle(
        Phaser.Math.Between(0, this.scale.width),
        -50,
        Phaser.Math.Between(8, 15),
        Phaser.Math.Between(8, 15),
        color,
      );

      this.tweens.add({
        targets: confetti,
        y: this.scale.height + 50,
        x: confetti.x + Phaser.Math.Between(-100, 100),
        rotation: Phaser.Math.Between(0, 6.28),
        duration: Phaser.Math.Between(2000, 5000),
        delay: Phaser.Math.Between(0, 3000),
        repeat: -1,
        ease: "Linear",
      });
    }
  }
}
