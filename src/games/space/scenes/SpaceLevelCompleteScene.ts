export class SpaceLevelCompleteScene extends Phaser.Scene {
  private currentLevel: number = 0;
  private difficulty: string = "";
  private isLastLevel: boolean = false;

  constructor() {
    super({ key: "SpaceLevelCompleteScene" });
  }

  init(data: { level: number; difficulty: string; isLastLevel: boolean }) {
    this.currentLevel = data.level || 0;
    this.difficulty = data.difficulty || "";
    this.isLastLevel = data.isLastLevel || false;
  }

  preload() {
    this.load.image("trophy", "/assets/common/trophy.png");
    this.load.image("continue-icon", "/assets/spaceGame/play.png");
    this.load.image("menu-icon", "/assets/spaceGame/exit.png");
    this.load.image(
      "defaultButton",
      "/assets/common/buttons/rectangleBlueDefault.svg",
    );
    this.load.image(
      "hoverButton",
      "/assets/common/buttons/rectangleBlueHover.svg",
    );
    this.load.image(
      "clickedButton",
      "/assets/common/buttons/rectangleBlueClicked.svg",
    );
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

    this.add.image(this.scale.width / 2, 120, "trophy").setScale(0.3);

    const congratsText = this.isLastLevel
      ? "PARABÉNS!\nVOCÊ COMPLETOU TODOS OS NÍVEIS!"
      : "MUITO BEM!\nNÍVEL CONCLUÍDO!";
    this.add
      .text(this.scale.width / 2, 220, congratsText, {
        fontFamily: "Comic Sans MS, Arial, sans-serif",
        fontSize: "36px",
        color: "#FFFFFF",
        fontStyle: "bold",
        stroke: "#2D5EFF",
        strokeThickness: 4,
        align: "center",
      })
      .setOrigin(0.5);

    if (!this.isLastLevel) {
      const difficultyName =
        this.difficulty.charAt(0).toUpperCase() + this.difficulty.slice(1);
      this.add
        .text(
          this.scale.width / 2,
          300,
          `NÍVEL ${difficultyName.toUpperCase()} COMPLETO!`,
          {
            fontFamily: "Comic Sans MS, Arial, sans-serif",
            fontSize: "24px",
            color: "#FFFFFF",
            fontStyle: "bold",
            stroke: "#000000",
            strokeThickness: 2,
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

  private createBackground(): void {
    const background = this.add.image(400, 300, "background");
    const scaleX = this.cameras.main.width / background.width;
    const scaleY = this.cameras.main.height / background.height;
    const scale = Math.max(scaleX, scaleY);
    background.setScale(scale);
  }

  private createSpaceElements(): void {
    // Adicionar planetas decorativos com animações
    const planet1 = this.add.image(100, 150, "planeta1").setScale(0.4);
    const planet2 = this.add.image(700, 180, "planeta2").setScale(0.3);
    const planet3 = this.add.image(80, 450, "planeta3").setScale(0.35);
    const moon = this.add.image(720, 480, "lua").setScale(0.25);

    // Animações de rotação suave
    this.tweens.add({
      targets: planet1,
      rotation: Math.PI * 2,
      duration: 8000,
      repeat: -1,
      ease: "Linear",
    });

    this.tweens.add({
      targets: planet2,
      rotation: -Math.PI * 2,
      duration: 10000,
      repeat: -1,
      ease: "Linear",
    });

    this.tweens.add({
      targets: planet3,
      rotation: Math.PI * 2,
      duration: 12000,
      repeat: -1,
      ease: "Linear",
    });

    // Animação de flutuação para a lua
    this.tweens.add({
      targets: moon,
      y: moon.y - 15,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  private createCelebrationEffect() {
    // Estrelas cintilantes
    for (let i = 0; i < 20; i++) {
      const star = this.add
        .image(
          Phaser.Math.Between(50, this.scale.width - 50),
          Phaser.Math.Between(50, this.scale.height - 50),
          "star",
        )
        .setScale(Phaser.Math.Between(0.2, 0.4));

      this.tweens.add({
        targets: star,
        alpha: 0.3,
        scale: star.scale * 0.5,
        duration: Phaser.Math.Between(1000, 3000),
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
        delay: Phaser.Math.Between(0, 2000),
      });
    }

    // Efeito de partículas no troféu
    const trophy = this.children.getByName("trophy");
    if (trophy) {
      this.tweens.add({
        targets: trophy,
        scaleX: 0.35,
        scaleY: 0.35,
        duration: 1500,
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
    const continueButton = this.add.rectangle(0, 0, 220, 70, 0x16a34a);
    const continueText = this.add
      .text(0, 0, "PRÓXIMO NÍVEL", {
        fontFamily: "Comic Sans MS, Arial, sans-serif",
        fontSize: "20px",
        color: "#FFFFFF",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    continueContainer.add([continueButton, continueText]);
    continueContainer.setInteractive(
      new Phaser.Geom.Rectangle(-110, -35, 220, 70),
      Phaser.Geom.Rectangle.Contains,
    );

    continueContainer.on("pointerover", () => {
      continueButton.setFillStyle(0x22c55e);
      this.tweens.add({
        targets: continueContainer,
        scale: 1.05,
        duration: 150,
        ease: "Power2.easeOut",
      });
    });

    continueContainer.on("pointerout", () => {
      continueButton.setFillStyle(0x16a34a);
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
          // Avançar para o próximo nível ao continuar
          const currentProgress = this.registry.get("currentSpaceProgress") || {
            levelIndex: 0,
            questionIndex: 0,
          };
          this.registry.set("currentSpaceProgress", {
            levelIndex: currentProgress.levelIndex + 1,
            questionIndex: 0,
          });
          this.scene.start("SpaceGameScene", { continueFromLevel: true });
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
    const menuText = this.add
      .text(0, 0, "MENU PRINCIPAL", {
        fontFamily: "Comic Sans MS, Arial, sans-serif",
        fontSize: "20px",
        color: "#FFFFFF",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    menuContainer.add([menuButton, menuText]);
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
          if (this.isLastLevel) {
            // Se é o último nível, ir para a cena de finalização
            this.scene.start("SpaceEndScene");
          } else {
            // Se não é o último nível, voltar para o menu
            this.registry.set("currentSpaceProgress", {
              levelIndex: 0,
              questionIndex: 0,
            });
            this.scene.start("SpaceMenuScene");
          }
        },
      });
    });
  }

  update() {}
}
