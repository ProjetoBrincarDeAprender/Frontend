import ButtonManager from "@/games/common/managers/ButtonManager";
import EffectManager from "@/games/common/managers/EffectManager";
import Phaser from "phaser";
import RandomGenerator from "@/games/common/utils/randomGenerator";

export default class Vowels extends Phaser.Scene {
  private buttonManager: ButtonManager;
  private effectManager: EffectManager;

  constructor() {
    super("vowelsStart");
    this.buttonManager = new ButtonManager(this);
    this.effectManager = new EffectManager(this);
  }

  preload() {
    this.load.image(
      "backgroundStart",
      "/assets/vowelsGame/images/backgroundMain.png",
    );
    this.load.image(
      "hoverButtonRectangle",
      "/assets/common/hoverButtonRectangle.svg",
    );
    this.load.image(
      "defaultButtonRectangle",
      "/assets/common/defaultButtonRectangle.svg",
    );
    this.load.image(
      "clickedButtonRectangle",
      "/assets/common/clickedButtonRectangle.svg",
    );
    this.load.image(
      "defaultRectangleRed",
      "/assets/common/defaultRectangleRed.svg",
    );
    this.load.image(
      "hoverRectangleRed",
      "/assets/common/hoverRectangleRed.svg",
    );
    this.load.image(
      "clickedRectangleRed",
      "/assets/common/clickedRectangleRed.svg",
    );
    this.load.image("cloud", "/assets/vowelsGame/images/cloud.png");
    this.load.image("cloud2", "/assets/vowelsGame/images/cloud2.png");
  }

  create() {
    const gameWidth = this.cameras.main.width;
    const gameHeight = this.cameras.main.height;

    this.createBackground();

    this.add
      .text(gameWidth / 2, gameHeight / 2 - 100, "Jogo das Vogais", {
        color: "#ffffff",
        fontFamily: "Verdana, Geneva, sans-serif",
        fontSize: "64px",
        fontStyle: "bold",
      })
      .setOrigin(0.5)
      .setDepth(10);

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

    startButton.setInteractive().on("pointerup", () => {
      this.scene.start("vowelsGameScene");
    });

    exitButton.setInteractive().on("pointerup", () => {
      window.history.back();
    });
  }

  update() {}

  private createBackground(): void {
    const background = this.add.image(400, 300, "backgroundStart");
    const scaleX = this.cameras.main.width / background.width;
    const scaleY = this.cameras.main.height / background.height;
    const scale = Math.max(scaleX, scaleY);
    background.setScale(scale);

    const cloudTextures = ["cloud", "cloud2"];
    const clouds = this.createClouds(cloudTextures);

    for (let cloud of clouds) {
      const randomSpeed =
        RandomGenerator.randomNumber(2000, 4000) * (cloud.scale * 10);
      this.effectManager.move(
        cloud,
        920 + cloud.scale * 100,
        randomSpeed,
        -1,
        0,
      );
    }

    this.effectManager.overlay(0.3);
  }

  private createClouds(textures: string[]): Phaser.GameObjects.Image[] {
    const clouds: Phaser.GameObjects.Image[] = [];
    const numberOfClouds = RandomGenerator.randomNumber(4, 6);

    const minY = 50;
    const maxY = 400;
    const spaceBetweenCloudsY = (maxY - minY) / (numberOfClouds + 1);

    for (let i = 0; i < numberOfClouds; i++) {
      let randomTextureIndex = RandomGenerator.randomNumber(
        0,
        textures.length - 1,
      );
      let randomTexture = textures[randomTextureIndex];
      let randomScale = RandomGenerator.randomNumber(15, 55) / 100;
      let randomX = RandomGenerator.randomNumber(-160, 600);
      let randomY =
        spaceBetweenCloudsY * (i + 1) -
        minY +
        RandomGenerator.randomNumber(0, 25);

      clouds.push(
        this.add
          .image(randomX, randomY, randomTexture)
          .setOrigin(0.5)
          .setScale(randomScale),
      );
    }

    return clouds;
  }
}
