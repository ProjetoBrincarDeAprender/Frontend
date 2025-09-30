import ButtonManager from "@/games/common/managers/ButtonManager";
import EffectManager from "@/games/common/managers/EffectManager";
import Phaser from "phaser";
import AssetLoader from "@/games/common/loaders/AssetLoader";
import CloudManager from "@/games/common/managers/CloudManager";

export default class Vowels extends Phaser.Scene {
  private assetLoader: AssetLoader;
  private buttonManager: ButtonManager;
  private cloudManager: CloudManager;
  private effectManager: EffectManager;

  constructor() {
    super("vowelsStart");
    this.buttonManager = new ButtonManager(this);
    this.effectManager = new EffectManager(this);
    this.assetLoader = new AssetLoader(this);
    this.cloudManager = new CloudManager(this);
  }

  preload() {
    this.assetLoader.preloadVowelsStart();
    this.assetLoader.preloadClouds();
  }

  create() {
    this.createBackground();
    this.createTitle();
    this.createButtons();
  }

  update() {}

  private createBackground(): void {
    const background = this.add.image(400, 300, "backgroundStart");
    const scaleX = this.cameras.main.width / background.width;
    const scaleY = this.cameras.main.height / background.height;
    const scale = Math.max(scaleX, scaleY);
    background.setScale(scale);

    this.cloudManager.generateClouds();

    this.effectManager.overlay(0.3);
  }

  private createTitle(): void {
    const title = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 - 150,
      "title",
    );
    const scaleX = this.cameras.main.width / title.width;
    const scaleY = this.cameras.main.height / title.height;
    const scale = Math.max(scaleX, scaleY) / 1.2;
    title.setScale(scale);
  }

  private createButtons(): void {
    const startButton = this.buttonManager.createButton({
      positions: {
        x: this.cameras.main.width / 2,
        y: this.cameras.main.height / 2 + 60,
      },
      textures: [
        "defaultButtonRectangle",
        "hoverButtonRectangle",
        "clickedButtonRectangle",
      ],
      text: "▶ Iniciar",
      fontSize: 40,
    });

    const exitButton = this.buttonManager.createButton({
      positions: {
        x: this.cameras.main.width / 2,
        y: this.cameras.main.height / 2 + 140,
      },

      textures: [
        "defaultRectangleRed",
        "hoverRectangleRed",
        "clickedRectangleRed",
      ],
      text: "Sair",
      fontSize: 40,
      scale: 0.7,
    });

    startButton.setInteractive().on("pointerup", () => {
      this.scene.start("vowelsGameScene");
    });

    exitButton.setInteractive().on("pointerup", () => {
      window.history.back();
    });
  }
}
