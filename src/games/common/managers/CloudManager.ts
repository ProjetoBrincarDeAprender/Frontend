import Phaser from "phaser";
import EffectManager from "./EffectManager";
import RandomGenerator from "../utils/randomGenerator";

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

export default class CloudManager {
  private scene: Phaser.Scene;
  private effectManager: EffectManager;
  private config: CloudConfig;

  constructor(scene: Phaser.Scene, config: CloudConfig) {
    this.scene = scene;
    this.effectManager = new EffectManager(scene);
    this.config = config;
  }

  createAndAnimateClouds(): void {
    const clouds = this.createClouds();
    this.animateClouds(clouds);
  }

  private createClouds(): Phaser.GameObjects.Image[] {
    const clouds: Phaser.GameObjects.Image[] = [];
    const numberOfClouds = RandomGenerator.randomNumber(
      this.config.count.min,
      this.config.count.max,
    );

    for (let i = 0; i < numberOfClouds; i++) {
      const cloud = this.createSingleCloud(i, numberOfClouds);
      clouds.push(cloud);
    }

    return clouds;
  }

  private createSingleCloud(
    index: number,
    totalClouds: number,
  ): Phaser.GameObjects.Image {
    const texture = this.getRandomCloudTexture();
    const scale = this.getRandomCloudScale();
    const position = this.getCloudPosition(index, totalClouds);

    return this.scene.add
      .image(position.x, position.y, texture)
      .setOrigin(0.5)
      .setScale(scale);
  }

  private getRandomCloudTexture(): string {
    const randomIndex = RandomGenerator.randomNumber(
      0,
      this.config.textures.length - 1,
    );
    return this.config.textures[randomIndex];
  }

  private getRandomCloudScale(): number {
    return (
      RandomGenerator.randomNumber(
        this.config.scale.min * 100,
        this.config.scale.max * 100,
      ) / 100
    );
  }

  private getCloudPosition(
    index: number,
    totalClouds: number,
  ): { x: number; y: number } {
    const { position } = this.config;
    const spaceBetweenCloudsY =
      (position.y.max - position.y.min) / (totalClouds + 1);

    return {
      x: RandomGenerator.randomNumber(position.x.min, position.x.max),
      y:
        position.y.min +
        spaceBetweenCloudsY * (index + 1) +
        RandomGenerator.randomNumber(0, 25),
    };
  }

  private animateClouds(clouds: Phaser.GameObjects.Image[]): void {
    clouds.forEach((cloud) => {
      const speed = this.getCloudAnimationSpeed(cloud.scale);
      const delay = this.getCloudAnimationDelay();

      this.effectManager.move(
        cloud,
        this.config.animation.endX,
        speed,
        -1,
        delay,
      );
    });
  }

  private getCloudAnimationSpeed(cloudScale: number): number {
    const baseSpeed = RandomGenerator.randomNumber(
      this.config.animation.speed.min,
      this.config.animation.speed.max,
    );
    return baseSpeed * (cloudScale * 10);
  }

  private getCloudAnimationDelay(): number {
    return RandomGenerator.randomNumber(
      this.config.animation.delay.min,
      this.config.animation.delay.max,
    );
  }
}
