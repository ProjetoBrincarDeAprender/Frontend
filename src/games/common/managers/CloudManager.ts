import RandomGenerator from "../utils/randomGenerator";
import EffectManager from "./EffectManager";
import Phaser from "phaser";

interface CloudConfig {
  textures: string[];
  count: { min: number; max: number };
  scale: { min: number; max: number };
  position: {
    x: { min: number; max: number };
    y: { min: number; max: number };
    spaceBetweenClouds: number;
  };
  animation: {
    speed: { min: number; max: number };
    delay: { min: number; max: number };
    endX: number;
  };
}

export default class CloudManager {
  private scene: Phaser.Scene;
  private effectManager: EffectManager;
  private readonly cloudConfig: CloudConfig = {
    textures: ["cloud", "cloud2", "cloud3", "cloud4"],
    count: { min: 4, max: 6 },
    scale: { min: 15, max: 55 },
    position: {
      x: { min: -160, max: 600 },
      y: { min: 50, max: 400 },
      spaceBetweenClouds: 50,
    },
    animation: {
      speed: { min: 20000, max: 25000 },
      delay: { min: 0, max: 1000 },
      endX: 920,
    },
  };

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.effectManager = new EffectManager(scene);
  }

  private createClouds(): Phaser.GameObjects.Image[] {
    const clouds: Phaser.GameObjects.Image[] = [];
    const numberOfClouds = RandomGenerator.randomNumber(
      this.cloudConfig.count.min,
      this.cloudConfig.count.max,
    );

    for (let i = 0; i < numberOfClouds; i++) {
      const cloud = this.createSingleCloud(i);
      clouds.push(cloud);
    }

    return clouds;
  }

  generateClouds(): void {
    const clouds = this.createClouds();
    this.animateClouds(clouds);
  }

  private createSingleCloud(iteration: number): Phaser.GameObjects.Image {
    const randomTextureIndex = RandomGenerator.randomNumber(
      0,
      this.cloudConfig.textures.length - 1,
    );
    const randomTexture = this.cloudConfig.textures[randomTextureIndex];
    const randomScale =
      RandomGenerator.randomNumber(
        this.cloudConfig.scale.min,
        this.cloudConfig.scale.max,
      ) / 100;
    const randomX = RandomGenerator.randomNumber(
      this.cloudConfig.position.x.min,
      this.cloudConfig.position.x.max,
    );
    const randomY =
      this.cloudConfig.position.spaceBetweenClouds * (iteration + 1) +
      RandomGenerator.randomNumber(0, 25);

    return this.scene.add
      .image(randomX, randomY, randomTexture)
      .setOrigin(0.5)
      .setScale(randomScale);
  }

  animateClouds(clouds: Phaser.GameObjects.Image[]): void {
    for (let cloud of clouds) {
      const randomSpeed =
        RandomGenerator.randomNumber(
          this.cloudConfig.animation.speed.min,
          this.cloudConfig.animation.speed.max,
        ) *
        (cloud.scale * 10);
      this.effectManager.move(
        cloud,
        this.cloudConfig.animation.endX + cloud.scale * 100,
        randomSpeed,
        -1,
        0,
      );
    }
  }
}
