import ButtonManager from "@/games/common/managers/ButtonManager";
import EffectManager from "@/games/common/managers/EffectManager";
import Phaser from "phaser";
import AssetLoader from "@/games/common/loaders/AssetLoader";
import CloudManager from "@/games/common/managers/CloudManager";
import ButtonFactory from "@/games/common/factories/ButtonFactory";

export default class VowelsStartScene extends Phaser.Scene {
  private assetLoader: AssetLoader;
  private buttonManager: ButtonManager;
  private cloudManager: CloudManager;
  private effectManager: EffectManager;
  private buttonFactory: ButtonFactory;

  constructor() {
    super("vowelsStart");
    this.buttonManager = new ButtonManager(this);
    this.effectManager = new EffectManager(this);
    this.buttonFactory = new ButtonFactory(this.buttonManager);
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
    this.buttonFactory.createButton({
      positions: {
        x: this.cameras.main.width / 2,
        y: this.cameras.main.height / 2 + 60,
      },
      textures: {
        default: "defaultButtonRectangle",
        hover: "hoverButtonRectangle",
        clicked: "clickedButtonRectangle",
      },
      text: "▶ Iniciar",
      fontSize: 40,
      onClick: () => {
        this.scene.start("vowelsGameScene");
      },
    });

    this.buttonFactory.createButton({
      positions: {
        x: this.cameras.main.width / 2,
        y: this.cameras.main.height / 2 + 140,
      },

      textures: {
        default: "defaultRectangleRed",
        hover: "hoverRectangleRed",
        clicked: "clickedRectangleRed",
      },
      text: "Sair",
      fontSize: 40,
      scale: 0.7,
      onClick: () => {
        window.history.back();
      },
    });
  }
}
