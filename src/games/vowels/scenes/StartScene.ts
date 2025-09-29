import ButtonManager from "@/games/common/managers/ButtonManager";
import EffectManager from "@/games/common/managers/EffectManager";
import Phaser from "phaser";
import RandomGenerator from "@/games/common/utils/randomGenerator";
import AssetLoader from "@/games/common/loaders/AssetLoader";
import CloudManager from "@/games/common/managers/CloudManager";

interface CloudConfig {
  textures: string[];
  count: { min: number; max: number };
  scale: { min: number; max: number };
  position: {
    x: { min: number; max: number };
    y: { min: number; max: number };
  };
  animation: {
    speed: { min: number; max: number };
    delay: { min: number; max: number };
    endX: number;
  };
}

export default class Vowels extends Phaser.Scene {
  private assetLoader: AssetLoader;
  private buttonManager: ButtonManager;
  private cloudManager: CloudManager;
  private effectManager: EffectManager;

  private cloudConfig: CloudConfig = {
    textures: ["cloud", "cloud2"],
    count: { min: 4, max: 6 },
    scale: { min: 15, max: 55 },
    position: {
      x: { min: -160, max: 600 },
      y: { min: 50, max: 400 },
    },
    animation: {
      speed: { min: 2000, max: 4000 },
      delay: { min: 0, max: 1000 },
      endX: 920,
    },
  };

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
    this.add
      .text(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2 - 100,
        "Jogo das Vogais",
        {
          color: "#ffffff",
          fontFamily: "Verdana, Geneva, sans-serif",
          fontSize: "64px",
          fontStyle: "bold",
        },
      )
      .setOrigin(0.5)
      .setDepth(10);
  }

  private createButtons(): void {
    const startButton = this.buttonManager.createButton(
      { x: this.cameras.main.width / 2, y: this.cameras.main.height / 2 + 60 },
      [
        "defaultButtonRectangle",
        "hoverButtonRectangle",
        "clickedButtonRectangle",
      ],
      "▶ Iniciar",
      40,
    );

    const exitButton = this.buttonManager.createButton(
      { x: this.cameras.main.width / 2, y: this.cameras.main.height / 2 + 140 },
      ["defaultRectangleRed", "hoverRectangleRed", "clickedRectangleRed"],
      "Sair",
      40,
      0.7,
    );

    startButton.setInteractive().on("pointerup", () => {
      this.scene.start("vowelsGameScene");
    });

    exitButton.setInteractive().on("pointerup", () => {
      window.history.back();
    });
  }
}
