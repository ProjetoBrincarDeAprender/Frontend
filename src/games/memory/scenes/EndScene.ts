export class MemoryEndScene extends Phaser.Scene {
  constructor() {
    super({ key: "MemoryEndScene" });
  }

  preload() {
    this.load.image("trophy", "/assets/common/trophy.png");
    this.load.image("menu-icon", "/assets/memoryGame/home.png");
  }

  create() {
    // Fundo de vitória
    this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0xffd700,
    );

    // Troféu de vitória
    this.add.image(this.scale.width / 2, 120, "trophy").setScale(0.4);

    // Texto de parabenização final
    this.add
      .text(this.scale.width / 2, 220, "PARABÉNS!\nVOCÊ É CAMPEÃ(O)!", {
        fontSize: "40px",
        color: "#2D5EFF",
        fontFamily: "Comic Sans MS, Arial, sans-serif",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5, 0.5);

    this.add
      .text(
        this.scale.width / 2,
        320,
        "VOCÊ COMPLETOU TODOS OS NÍVEIS DO\nJOGO DA MEMÓRIA COM SUCESSO!",
        {
          fontSize: "24px",
          color: "#333",
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#96D6F3",
          padding: { left: 15, right: 15, top: 10, bottom: 10 },
          align: "center",
        },
      )
      .setOrigin(0.5, 0.5);

    const menuContainer = this.add.container(this.scale.width / 2, 450);
    const menuButton = this.add.rectangle(0, 0, 250, 80, 0xff6b35);
    const menuIcon = this.add.image(-90, 0, "menu-icon").setScale(0.12);
    const menuText = this.add
      .text(20, 0, "VOLTA AO MENU", {
        fontFamily: "Arial, sans-serif",
        fontSize: "22px",
        color: "#FFFFFF",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    menuContainer.add([menuButton, menuIcon, menuText]);
    menuContainer.setInteractive(
      new Phaser.Geom.Rectangle(-125, -40, 250, 80),
      Phaser.Geom.Rectangle.Contains,
    );

    menuContainer.on("pointerdown", () => {
      this.tweens.add({
        targets: menuContainer,
        scale: 0.95,
        duration: 100,
        yoyo: true,
        onComplete: () => {
          this.registry.set("resetGame", true);
          this.scene.start("MemoryMenuScene");
        },
      });
    });

    this.createConfettiEffect();
  }

  private createConfettiEffect() {
    for (let i = 0; i < 20; i++) {
      const confetti = this.add.rectangle(
        Phaser.Math.Between(0, this.scale.width),
        -50,
        10,
        10,
        Phaser.Math.Between(0x000000, 0xffffff),
      );

      this.tweens.add({
        targets: confetti,
        y: this.scale.height + 50,
        rotation: Phaser.Math.Between(0, 6.28),
        duration: Phaser.Math.Between(2000, 4000),
        delay: Phaser.Math.Between(0, 2000),
        repeat: -1,
      });
    }
  }

  update() {}
}
