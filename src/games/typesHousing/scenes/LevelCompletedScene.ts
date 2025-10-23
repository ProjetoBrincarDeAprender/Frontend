import Phaser from 'phaser';

export class LevelCompletedScene extends Phaser.Scene {
  private score: number = 0;
  private currentLevel: number = 0;
  private isLastLevel: boolean = false;

  constructor() {
    super({ key: 'LevelCompletedScene' });
  }

  init(data: { score: number; gameType: string; isLastLevel?: boolean; currentLevel?: number }) {
    this.score = data.score || 0;
    this.currentLevel = data.currentLevel || 0;
    this.isLastLevel = data.isLastLevel || false;
  }

  preload() {
    if (!this.textures.exists("trophy")) {
      this.load.image("trophy", "/assets/common/trophy.png");
    }
    if (!this.textures.exists("star")) {
      this.load.image("star", "/assets/common/star.svg");
    }
    if (!this.textures.exists("dudaClap")) {
      this.load.image("dudaClap", "/assets/common/duda/dudaClap.png");
    }
    this.load.audio('celebration', '/assets/common/sounds/complete.mp3');

  }

  create() {
   
    this.sound.play('celebration', { volume: 10 });
    

    this.add.image(this.scale.width / 2, this.scale.height / 2, "backgroundStart").setScale(1.2);    
    // Overlay escuro
    this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0x000000,
      0.6
    );

    this.add.image(this.scale.width / 2, 120, "trophy").setScale(0.3);

    const congratsText = this.isLastLevel
      ? "PARABÉNS!\nVocê completou o jogo!"
      : "MUITO BEM!\nNível completado!";
    
    this.add
      .text(this.scale.width / 2, 220, congratsText, {
        fontFamily: "Comic Sans MS, Arial, sans-serif",
        fontSize: "36px",
        color: "#FFD700",
        fontStyle: "bold",
        stroke: "#2D4A9E",
        strokeThickness: 4,
        align: "center",
      })
      .setOrigin(0.5);

    const dudaClap = this.add.image(this.scale.width / 2, 350, "dudaClap").setScale(0.2);
    
    this.tweens.add({
      targets: dudaClap,
      y: 360,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    this.createCelebrationEffect();

    if (this.isLastLevel) {
      this.createMenuButton();
    } else {
      this.createContinueButton();
      this.createMenuButton();
    }
  }

  private createCelebrationEffect() {
    for (let i = 0; i < 10; i++) {
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

    const housingSymbols = ["🏠", "🏰", "🏡", "⭐", "🎉"];
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
          }
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

  private createContinueButton() {
    const continueContainer = this.add.container(
      this.scale.width / 2 - 120,
      500,
    );
    
    const continueButton = this.add.rectangle(0, 0, 220, 70, 0x22c55e);
    continueButton.setStrokeStyle(3, 0xffffff);
    
    const continueText = this.add
      .text(0, 0, "Próximo Nível", {
        fontFamily: "Arial, sans-serif",
        fontSize: "22px",
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
          this.scene.start("GameScene", {
            currentLevel: this.currentLevel,
            score: this.score
          });
        },
      });
    });
  }

  private createMenuButton() {
    const menuContainer = this.add.container(
      this.isLastLevel ? this.scale.width / 2 : this.scale.width / 2 + 120,
      500,
    );
    
    const menuButton = this.add.rectangle(0, 0, 220, 70, 0xff6b35);
    menuButton.setStrokeStyle(3, 0xffffff);
    
    const menuText = this.add
      .text(0, 0, "Voltar ao Menu", {
        fontFamily: "Arial, sans-serif",
        fontSize: "22px",
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
          window.location.href = "/games";
        },
      });
    });
  }

  update() {}
}