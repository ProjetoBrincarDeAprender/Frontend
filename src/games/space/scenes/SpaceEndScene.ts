import Phaser from "phaser";

export class SpaceEndScene extends Phaser.Scene {
  constructor() {
    super({ key: "SpaceEndScene" });
  }

  preload() {
    this.load.image("trophy", "/assets/common/trophy.png");
    this.load.image("restart-icon", "/assets/spaceGame/play.png");
    this.load.image("exit-icon", "/assets/spaceGame/exit.png");
    this.load.image("background", "/assets/spaceGame/background.png");
    this.load.image("star", "/assets/common/star.svg");
    this.load.image("planeta1", "/assets/spaceGame/planeta1.png");
    this.load.image("planeta2", "/assets/spaceGame/planeta2.png");
    this.load.image("planeta3", "/assets/spaceGame/planeta3.png");
    this.load.image("lua", "/assets/spaceGame/lua.png");
  }

  create() {
    this.createBackground();
    this.createSpaceElements();
    this.createMainContent();
    this.createButtons();
    this.createConfettiEffect();
  }

  private createBackground(): void {
    const background = this.add.image(400, 300, "background");
    const scaleX = this.cameras.main.width / background.width;
    const scaleY = this.cameras.main.height / background.height;
    const scale = Math.max(scaleX, scaleY);
    background.setScale(scale);

    // Overlay dourado para dar sensação de vitória
    this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0xffd700,
      0.3,
    );
  }

  private createSpaceElements(): void {
    // Planetas decorativos com animações
    const planet1 = this.add.image(80, 120, "planeta1").setScale(0.3);
    const planet2 = this.add.image(720, 150, "planeta2").setScale(0.25);
    const planet3 = this.add.image(100, 480, "planeta3").setScale(0.28);
    const moon = this.add.image(700, 500, "lua").setScale(0.2);

    // Animações suaves
    this.tweens.add({
      targets: planet1,
      rotation: Math.PI * 2,
      duration: 12000,
      repeat: -1,
      ease: "Linear",
    });

    this.tweens.add({
      targets: planet2,
      rotation: -Math.PI * 2,
      duration: 15000,
      repeat: -1,
      ease: "Linear",
    });

    this.tweens.add({
      targets: planet3,
      rotation: Math.PI * 2,
      duration: 18000,
      repeat: -1,
      ease: "Linear",
    });

    this.tweens.add({
      targets: moon,
      y: moon.y - 10,
      duration: 2500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  private createMainContent(): void {
    // Troféu principal com animação
    const trophy = this.add
      .image(this.scale.width / 2, 130, "trophy")
      .setScale(0.5);

    this.tweens.add({
      targets: trophy,
      scaleX: 0.55,
      scaleY: 0.55,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Texto principal
    this.add
      .text(
        this.scale.width / 2,
        240,
        "PARABÉNS!\nVOCÊ É UM(A) EXPLORADOR(A) ESPACIAL!",
        {
          fontSize: "36px",
          color: "#FFFFFF",
          fontFamily: "Comic Sans MS, Arial, sans-serif",
          fontStyle: "bold",
          stroke: "#2D5EFF",
          strokeThickness: 4,
          align: "center",
        },
      )
      .setOrigin(0.5);

    // Texto secundário
    this.add
      .text(
        this.scale.width / 2,
        340,
        "VOCÊ COMPLETOU TODOS OS DESAFIOS DO\nSISTEMA SOLAR COM SUCESSO!",
        {
          fontSize: "22px",
          color: "#000000",
          fontFamily: "Comic Sans MS, Arial, sans-serif",
          fontStyle: "bold",
          backgroundColor: "#FFFFFF",
          padding: { left: 20, right: 20, top: 12, bottom: 12 },
          align: "center",
        },
      )
      .setOrigin(0.5);
  }

  private createButtons(): void {
    // Botão Jogar Novamente
    const restartContainer = this.add.container(
      this.scale.width / 2 - 130,
      460,
    );
    const restartButton = this.add.rectangle(0, 0, 240, 80, 0x16a34a);
    const restartText = this.add
      .text(0, 0, "JOGAR NOVAMENTE", {
        fontFamily: "Comic Sans MS, Arial, sans-serif",
        fontSize: "20px",
        color: "#FFFFFF",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    restartContainer.add([restartButton, restartText]);
    restartContainer.setInteractive(
      new Phaser.Geom.Rectangle(-120, -40, 240, 80),
      Phaser.Geom.Rectangle.Contains,
    );

    restartContainer.on("pointerover", () => {
      restartButton.setFillStyle(0x22c55e);
      this.tweens.add({
        targets: restartContainer,
        scale: 1.05,
        duration: 150,
        ease: "Power2.easeOut",
      });
    });

    restartContainer.on("pointerout", () => {
      restartButton.setFillStyle(0x16a34a);
      this.tweens.add({
        targets: restartContainer,
        scale: 1,
        duration: 150,
        ease: "Power2.easeOut",
      });
    });

    restartContainer.on("pointerdown", () => {
      this.tweens.add({
        targets: restartContainer,
        scale: 0.95,
        duration: 100,
        yoyo: true,
        ease: "Power2.easeInOut",
        onComplete: () => {
          // Resetar progresso e voltar ao menu
          this.registry.set("currentSpaceProgress", {
            levelIndex: 0,
            questionIndex: 0,
          });
          this.scene.start("SpaceMenuScene");
        },
      });
    });

    // Botão Sair para Página de Games
    const exitContainer = this.add.container(this.scale.width / 2 + 130, 460);
    const exitButton = this.add.rectangle(0, 0, 240, 80, 0xff6b35);
    const exitText = this.add
      .text(0, 0, "OUTROS JOGOS", {
        fontFamily: "Comic Sans MS, Arial, sans-serif",
        fontSize: "20px",
        color: "#FFFFFF",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    exitContainer.add([exitButton, exitText]);
    exitContainer.setInteractive(
      new Phaser.Geom.Rectangle(-120, -40, 240, 80),
      Phaser.Geom.Rectangle.Contains,
    );

    exitContainer.on("pointerover", () => {
      exitButton.setFillStyle(0xe55a2b);
      this.tweens.add({
        targets: exitContainer,
        scale: 1.05,
        duration: 150,
        ease: "Power2.easeOut",
      });
    });

    exitContainer.on("pointerout", () => {
      exitButton.setFillStyle(0xff6b35);
      this.tweens.add({
        targets: exitContainer,
        scale: 1,
        duration: 150,
        ease: "Power2.easeOut",
      });
    });

    exitContainer.on("pointerdown", () => {
      this.tweens.add({
        targets: exitContainer,
        scale: 0.95,
        duration: 100,
        yoyo: true,
        ease: "Power2.easeInOut",
        onComplete: () => {
          // Resetar progresso e sair para página de games
          this.registry.set("currentSpaceProgress", {
            levelIndex: 0,
            questionIndex: 0,
          });
          window.history.back();
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

    // Estrelas cintilantes
    for (let i = 0; i < 15; i++) {
      const star = this.add
        .image(
          Phaser.Math.Between(50, this.scale.width - 50),
          Phaser.Math.Between(50, this.scale.height - 50),
          "star",
        )
        .setScale(Phaser.Math.Between(0.3, 0.6));

      this.tweens.add({
        targets: star,
        alpha: 0.2,
        scale: star.scale * 0.3,
        duration: Phaser.Math.Between(1500, 3500),
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
        delay: Phaser.Math.Between(0, 2000),
      });
    }
  }

  update() {}
}
