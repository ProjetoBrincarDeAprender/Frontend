import ButtonManager from "@/games/common/managers/ButtonManager";
import EffectManager from "@/games/common/managers/EffectManager";
import CloudManager from "@/games/common/managers/CloudManager";
import AssetLoader from "@/games/common/loaders/AssetLoader";
import Phaser from "phaser";

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
  private buttonManager: ButtonManager;
  private effectManager: EffectManager;
  private cloudManager: CloudManager;
  private assetLoader: AssetLoader;

  private readonly CLOUD_CONFIG: CloudConfig = {
    textures: ["cloud", "cloud2"],
    count: { min: 4, max: 6 },
    scale: { min: 0.15, max: 0.55 },
    position: {
      x: { min: -160, max: 800 },
      y: { min: 50, max: 400 },
    },
    animation: {
      speed: { min: 2000, max: 4000 },
      delay: { min: 0, max: 3000 },
      endX: 900,
    },
  };

  constructor() {
    super("vowelsStart");
    this.buttonManager = new ButtonManager(this);
    this.effectManager = new EffectManager(this);
    this.cloudManager = new CloudManager(this, this.CLOUD_CONFIG);
    this.assetLoader = new AssetLoader(this);
  }

  preload() {
    this.assetLoader.loadVowelsStartAssets();
  }

  create() {
    this.setupScene();
  }

  update() {}

  private setupScene(): void {
    const gameWidth = this.cameras.main.width;
    const gameHeight = this.cameras.main.height;

    this.createBackground();
    this.createTitle(gameWidth, gameHeight);
    this.createButtons(gameWidth, gameHeight);
  }

  private createTitle(gameWidth: number, gameHeight: number): void {
    this.add
      .text(gameWidth / 2, gameHeight / 2 - 100, "Jogo das Vogais", {
        color: "#ffffff",
        fontFamily: "Verdana, Geneva, sans-serif",
        fontSize: "64px",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(10);
  }

  private createButtons(gameWidth: number, gameHeight: number): void {
    const startButton = this.buttonManager.createButton(
      { x: gameWidth / 2, y: gameHeight / 2 + 60 },
      [
        "defaultButtonRectangle",
        "hoverButtonRectangle",
        "clickedButtonRectangle",
      ],
      "▶ Iniciar",
      40,
    );

    const exitButton = this.buttonManager.createButton(
      { x: gameWidth / 2, y: gameHeight / 2 + 140 },
      ["defaultRectangleRed", "hoverRectangleRed", "clickedRectangleRed"],
      "Sair",
      40,
      0.7,
    );

    this.setupButtonEvents(startButton, exitButton);
  }

  private setupButtonEvents(
    startButton: Phaser.GameObjects.Container,
    exitButton: Phaser.GameObjects.Container,
  ): void {
    startButton.setInteractive().on("pointerup", () => {
      this.scene.start("vowelsGameScene");
    });

    exitButton.setInteractive().on("pointerup", () => {
      window.history.back();
    });
  }

  private createBackground(): void {
    this.setupBackgroundImage();
    this.cloudManager.createAndAnimateClouds();
    this.effectManager.overlay(0.3);
  }

  private setupBackgroundImage(): void {
    const background = this.add.image(400, 300, "backgroundStart");
    const scaleX = this.cameras.main.width / background.width;
    const scaleY = this.cameras.main.height / background.height;
    const scale = Math.max(scaleX, scaleY);
    background.setScale(scale);
  }
}
