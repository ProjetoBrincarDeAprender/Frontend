import ButtonFactory from "@/games/common/factories/ButtonFactory";
import { BgManager } from "@/games/common/managers/BgManager";
import ButtonManager from "@/games/common/managers/ButtonManager";
import EffectManager from "@/games/common/managers/EffectManager";

export class MemoryMenuScene extends Phaser.Scene {
  private buttonManager!: ButtonManager;
  private buttonFactory!: ButtonFactory;
  private bgManager!: BgManager;
  private effectManager!: EffectManager;

  constructor() {
    super({ key: "MemoryMenuScene" });
    this.buttonManager = new ButtonManager(this);
    this.buttonFactory = new ButtonFactory(this.buttonManager);
    this.bgManager = new BgManager(this);
    this.effectManager = new EffectManager(this);
  }

  preload() {
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
    this.load.image("play-icon", "/assets/memoryGame/play.png");
    this.load.image("exit-icon", "/assets/memoryGame/exit.png");
    this.load.image("mascot", "/assets/common/dudaSentada.png");
    this.load.image("star", "/assets/common/star.svg");
    this.load.image("background", "/assets/memoryGame/fundo.png");

    // background elements
    this.load.image("element1", "/assets/memoryGame/bgElements/bunny.png");
    this.load.image("element2", "/assets/memoryGame/bgElements/cat.png");
    this.load.image("element3", "/assets/memoryGame/bgElements/moon.png");
    this.load.image("element4", "/assets/memoryGame/bgElements/star.png");
    this.load.image("element5", "/assets/memoryGame/bgElements/planet1.png");
    this.load.image("element6", "/assets/memoryGame/bgElements/planet2.png");
  }

  create() {
    this.createBackground();

    this.add
      .text(this.scale.width / 2, 160, "Jogo da Memória", {
        fontFamily: "Comic Sans MS, Arial, sans-serif",
        fontSize: "40px",
        color: "#2D5EFF",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(this.scale.width / 2, 210, "CLIQUE EM INICIAR PARA JOGAR!", {
        fontFamily: "Arial, sans-serif",
        fontSize: "24px",
        color: "#FFF",
        padding: { left: 10, right: 10, top: 4, bottom: 4 },
      })
      .setOrigin(0.5);

    const initButton = this.buttonFactory.createButton({
      positions: { x: this.scale.width / 2, y: 300 },
      textures: {
        default: "defaultButton",
        hover: "hoverButton",
        clicked: "clickedButton",
      },
      onClick: () => {
        const shouldReset = this.registry.get("resetGame") || false;
        this.registry.set("resetGame", false);

        if (shouldReset) {
          this.registry.set("currentLevel", 0);
        }

        this.scene.start("MemoryGameScene", { resetGame: shouldReset });
      },
      text: "▶ INICIAR",
    });

    initButton.setTint(0x00ff00);
  }

  update() {}

  private createBackground(): void {
    this.bgManager.createBackground("background");

    this.bgManager.addElements([
      {
        textureKey: "element1",
        x: 90,
        y: 400,
        scale: 1,
        animationFunction: () => {
          this.effectManager.addParallax(this.bgManager.getElements()[0], 20);
        },
      },
      {
        textureKey: "element2",
        x: 700,
        y: 200,
        scale: 1,
        animationFunction: () => {
          this.effectManager.addParallax(this.bgManager.getElements()[1], 15);
        },
      },
      {
        textureKey: "element3",
        x: 150,
        y: 80,
        scale: 0.9,
        animationFunction: () => {
          this.effectManager.addParallax(
            this.bgManager.getElements()[2],
            12,
            1500,
          );
        },
      },
      {
        textureKey: "element4",
        x: 97,
        y: 174,
        scale: 0.8,
        animationFunction: () => {
          this.effectManager.addParallax(
            this.bgManager.getElements()[3],
            5,
            3000,
          );
        },
      },
      {
        textureKey: "element5",
        x: 700,
        y: 500,
        scale: 1,
        animationFunction: () => {
          this.effectManager.addParallax(
            this.bgManager.getElements()[4],
            7,
            2500,
          );
          this.tweens.add({
            targets: this.bgManager.getElements()[4],
            angle: 360,
            duration: 5000,
            repeat: -1,
            ease: "Linear",
          });
        },
      },
      {
        textureKey: "element6",
        x: 600,
        y: 400,
        scale: 1,
        animationFunction: () => {
          this.effectManager.addParallax(
            this.bgManager.getElements()[5],
            13,
            2010,
          );
          this.tweens.add({
            targets: this.bgManager.getElements()[5],
            angle: -360,
            duration: 4000,
            repeat: -1,
            ease: "Linear",
          });
        },
      },
    ]);

    this.bgManager.addElement({
      textureKey: "mascot",
      x: this.scale.width / 2,
      y: 450,
      scale: 0.45,
      animationFunction: () => {
        this.effectManager.addParallax(
          this.bgManager.getElement("mascot") as Phaser.GameObjects.Image,
          20,
          2000,
        );
      },
    });
  }
}
