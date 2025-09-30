import Phaser from "phaser";
import ButtonManager from "@/games/common/managers/ButtonManager";
import AssetLoader from "@/games/common/loaders/AssetLoader";

export default class Credits extends Phaser.Scene {
  private buttonManager: ButtonManager;
  private assetLoader: AssetLoader;

  constructor() {
    super("vowelsCredits");
    this.buttonManager = new ButtonManager(this);
    this.assetLoader = new AssetLoader(this);
  }

  preload() {
    this.load.image(
      "backgroundCredits",
      "/assets/vowelsGame/images/backgroundCredits.png",
    );
    this.load.image("dudaClap", "/assets/common/duda/dudaClap.png");
    this.load.image("trophy", "/assets/common/trophy.png");
    this.assetLoader.preLoadRectangleRed();
    this.assetLoader.proLoadRectangleBlue();
  }

  create() {
    const gameWidth = this.cameras.main.width;
    const gameHeight = this.cameras.main.height;

    this.createBackground();
    this.createButtons();

    this.add
      .text(gameWidth / 2 + 100, gameHeight / 2 - 150, "Parabéns!", {
        color: "#2e1c00ff",
        fontFamily: "Verdana, Geneva, sans-serif",
        fontSize: "64px",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(gameWidth / 2 + 100, gameHeight / 2 - 80, "Você conseguiu!", {
        color: "#2e1c00ff",
        fontFamily: "Verdana, Geneva, sans-serif",
        fontSize: "50px",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .image(gameWidth / 2 - 250, gameHeight / 2 + 70, "dudaClap")
      .setScale(0.4);

    this.add
      .image(gameWidth / 2 + 100, gameHeight / 2 + 50, "trophy")
      .setScale(0.35);
  }

  private createBackground(): void {
    const background = this.add.image(400, 300, "backgroundCredits");
    const scaleX = this.cameras.main.width / background.width;
    const scaleY = this.cameras.main.height / background.height;
    const scale = Math.max(scaleX, scaleY);
    background.setScale(scale);
  }

  private createButtons(): void {
    // const startButton = this.buttonManager.createButton(
    //   { x: this.cameras.main.width / 2, y: this.cameras.main.height / 2 + 60 },
    //   [
    //     "defaultButtonRectangle",
    //     "hoverButtonRectangle",
    //     "clickedButtonRectangle",
    //   ],
    //   "▶ Iniciar",
    //   40,
    // );

    const exitButton = this.buttonManager.createButton(
      {
        x: this.cameras.main.width / 2 + 100,
        y: this.cameras.main.height / 2 + 180,
      },
      ["defaultRectangleRed", "hoverRectangleRed", "clickedRectangleRed"],
      "Sair",
      40,
      0.7,
    );

    // startButton.setInteractive().on("pointerup", () => {
    //   this.scene.start("vowelsGameScene");
    // });

    exitButton.setInteractive().on("pointerup", () => {
      window.history.back();
    });
  }
}
