export class MemoryLevelCompleteScene extends Phaser.Scene {
  private currentLevel: number = 0;
  private isLastLevel: boolean = false;

  constructor() {
    super({ key: "MemoryLevelCompleteScene" });
  }

  init(data: { level: number; isLastLevel: boolean }) {
    this.currentLevel = data.level || 0;
    this.isLastLevel = data.isLastLevel || false;
  }

  preload() {
    this.load.image("trophy", "/assets/common/trophy.png");
    this.load.image("continue-icon", "/assets/memoryGame/play.png");
    this.load.image("menu-icon", "/assets/memoryGame/exit.png");
    this.load.image("defaultButton", "/assets/common/defaultButton.svg");
    this.load.image("hoverButton", "/assets/common/hoverButton.svg");
    this.load.image("clickedButton", "/assets/common/clickedButton.svg");
    this.load.image("background", "/assets/memoryGame/fundo.png");
  }

  create() {
    this.createBackground();

    this.add.image(this.scale.width / 2, 120, "trophy").setScale(0.3);

    const congratsText = this.isLastLevel
      ? "PARABÉNS!\nVOCÊ COMPLETOU TODOS OS NÍVEIS!"
      : "MUITO BEM!\nNÍVEL CONCLUÍDO!";
    this.add
      .text(this.scale.width / 2, 220, congratsText, {
        fontFamily: "Comic Sans MS, Arial, sans-serif",
        fontSize: "36px",
        color: "#2D5EFF",
        fontStyle: "bold",
        stroke: "#ffffff",
        strokeThickness: 4,
        align: "center",
      })
      .setOrigin(0.5);

    if (!this.isLastLevel) {
      this.add
        .text(
          this.scale.width / 2,
          300,
          `NÍVEL ${this.currentLevel + 1} COMPLETO!`,
          {
            fontFamily: "Arial, sans-serif",
            fontSize: "24px",
            color: "#FFFFFF",
            padding: { left: 15, right: 15, top: 8, bottom: 8 },
          },
        )
        .setOrigin(0.5);
    }

    this.createCelebrationEffect();

    if (this.isLastLevel) {
      this.createMenuButton();
    } else {
      this.createContinueButton();
      this.createMenuButton();
    }
  }

  private createCelebrationEffect() {
    for (let i = 0; i < 15; i++) {
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
        duration: Phaser.Math.Between(1000, 2000),
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    }
  }

  private createContinueButton() {
    const continueContainer = this.add.container(
      this.scale.width / 2 - 120,
      420,
    );
    const continueButton = this.add.rectangle(0, 0, 220, 70, 0x2d5eff);
    const continueIcon = this.add.image(-80, 0, "continue-icon").setScale(0.1);
    const continueText = this.add
      .text(20, 0, "PRÓXIMO NÍVEL", {
        fontFamily: "Arial, sans-serif",
        fontSize: "20px",
        color: "#FFFFFF",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    continueContainer.add([continueButton, continueIcon, continueText]);
    continueContainer.setInteractive(
      new Phaser.Geom.Rectangle(-110, -35, 220, 70),
      Phaser.Geom.Rectangle.Contains,
    );

    continueContainer.on("pointerover", () => {
      continueButton.setFillStyle(0x16a34a);
      this.tweens.add({
        targets: continueContainer,
        scale: 1.05,
        duration: 150,
        ease: "Power2.easeOut",
      });
    });

    continueContainer.on("pointerout", () => {
      continueButton.setFillStyle(0x22c55e);
      this.tweens.add({
        targets: continueContainer,
        scale: 1,
        duration: 150,
        ease: "Power2.easeOut",
      });
    });

    continueContainer.on("pointerdown", () => {
      this.tweens.add({
        targets: continueContainer,
        scale: 0.95,
        duration: 100,
        yoyo: true,
        ease: "Power2.easeInOut",
        onComplete: () => {
          this.registry.set("resetGame", false);
          this.scene.start("MemoryGameScene", { resetGame: false });
        },
      });
    });
  }

  private createMenuButton() {
    const menuContainer = this.add.container(
      this.isLastLevel ? this.scale.width / 2 : this.scale.width / 2 + 120,
      420,
    );
    const menuButton = this.add.rectangle(0, 0, 220, 70, 0xff6b35);
    const menuIcon = this.add.image(-80, 0, "menu-icon").setScale(0.1);
    const menuText = this.add
      .text(20, 0, "MENU PRINCIPAL", {
        fontFamily: "Arial, sans-serif",
        fontSize: "20px",
        color: "#FFFFFF",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    menuContainer.add([menuButton, menuIcon, menuText]);
    menuContainer.setInteractive(
      new Phaser.Geom.Rectangle(-110, -35, 220, 70),
      Phaser.Geom.Rectangle.Contains,
    );

    menuContainer.on("pointerover", () => {
      menuButton.setFillStyle(0xe55a2b);
      this.tweens.add({
        targets: menuContainer,
        scale: 1.05,
        duration: 150,
        ease: "Power2.easeOut",
      });
    });

    menuContainer.on("pointerout", () => {
      menuButton.setFillStyle(0xff6b35);
      this.tweens.add({
        targets: menuContainer,
        scale: 1,
        duration: 150,
        ease: "Power2.easeOut",
      });
    });

    menuContainer.on("pointerdown", () => {
      this.tweens.add({
        targets: menuContainer,
        scale: 0.95,
        duration: 100,
        yoyo: true,
        ease: "Power2.easeInOut",
        onComplete: () => {
          this.registry.set("resetGame", true);
          this.scene.start("MemoryMenuScene");
        },
      });
    });
  }

  update() {}

  private createBackground(): void {
    const background = this.add.image(400, 300, "background");
    const scaleX = this.cameras.main.width / background.width;
    const scaleY = this.cameras.main.height / background.height;
    const scale = Math.max(scaleX, scaleY);
    background.setScale(scale);
  }
}
