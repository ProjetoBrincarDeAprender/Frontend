import Phaser from "phaser";
import ButtonManager from "@/games/common/managers/ButtonManager";
// import AssetLoader from "@/games/common/loaders/AssetLoader";
import EffectManager from "@/games/common/managers/EffectManager";

export default class VowelsCreditsScene extends Phaser.Scene {
  private buttonManager: ButtonManager;
  // private assetLoader: AssetLoader;
  private effectManager: EffectManager;

  constructor() {
    super("vowelsCredits");
    this.buttonManager = new ButtonManager(this);
    // this.assetLoader = new AssetLoader(this);
    this.effectManager = new EffectManager(this);
  }

  preload() {
    this.load.image(
      "backgroundCredits",
      "/assets/vowelsGame/images/backgroundCredits.png",
    );
    this.load.image("dudaClap", "/assets/common/duda/dudaClap.png");
    this.load.image("trophy", "/assets/common/trophy.png");
    // this.assetLoader.preLoadRectangleRed();
    // this.assetLoader.proLoadRectangleBlue();
  }

  create() {
    const gameWidth = this.cameras.main.width;
    const gameHeight = this.cameras.main.height;

    this.createBackground();
    this.createButtons();
    this.effectManager.confetti();

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
      .image(gameWidth / 2 + 100, gameHeight / 2 + 40, "trophy")
      .setScale(0.25);
  }

  private createBackground(): void {
    const background = this.add.image(400, 300, "backgroundCredits");
    const scaleX = this.cameras.main.width / background.width;
    const scaleY = this.cameras.main.height / background.height;
    const scale = Math.max(scaleX, scaleY);
    background.setScale(scale);
    this.effectManager.overlay(0.3);
  }

  private createButtons(): void {
    const exitButton = this.buttonManager.createButton({
      positions: {
        x: this.cameras.main.width / 2 + 100,
        y: this.cameras.main.height / 2 + 220,
      },
      textures: {
        default: "defaultRectangleRed",
        hover: "hoverRectangleRed",
        clicked: "clickedRectangleRed",
      },
      text: "Sair",
      fontSize: 40,
      scale: 0.7,
    });

    const playAgainButton = this.buttonManager.createButton({
      positions: {
        x: this.cameras.main.width / 2 + 100,
        y: this.cameras.main.height / 2 + 160,
      },
      textures: {
        default: "defaultButtonRectangle",
        hover: "hoverButtonRectangle",
        clicked: "clickedButtonRectangle",
      },
      text: "Jogar Novamente",
      fontSize: 20,
      scale: 1,
    });

    exitButton.setInteractive().on("pointerup", () => {
      window.history.back();
    });

    playAgainButton.setInteractive().on("pointerup", () => {
      window.location.reload();
    });
  }
}
