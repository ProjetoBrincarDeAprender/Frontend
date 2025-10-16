import Phaser from "phaser";
import EffectManager from "@/games/common/managers/EffectManager";
import CloudManager from "@/games/common/managers/CloudManager";

export default class VowelsUIService {
  private scene: Phaser.Scene;
  private effectManager: EffectManager;
  private cloudManager: CloudManager | undefined;
  private image?: Phaser.GameObjects.Image;
  private imageMaxSize: number;

  constructor(
    scene: Phaser.Scene,
    effectManager: EffectManager,
    cloudManager?: CloudManager,
    imageMaxSize: number = 800,
  ) {
    this.scene = scene;
    this.effectManager = effectManager;
    this.cloudManager = cloudManager;
    this.imageMaxSize = imageMaxSize;
  }

  createImage(texture: string): void {
    this.image = this.scene.add.image(400, 220, texture);

    const imgWidth = this.image.width;
    const imgHeight = this.image.height;

    const maxSize = this.imageMaxSize;
    const scaleX = maxSize / imgWidth;
    const scaleY = maxSize / imgHeight;
    const scale = Math.min(scaleX, scaleY);

    this.image.setScale(scale);
  }

  createBackground(texture: string): void {
    const background = this.scene.add.image(400, 300, texture);
    const scaleX = this.scene.cameras.main.width / background.width;
    const scaleY = this.scene.cameras.main.height / background.height;
    const scale = Math.max(scaleX, scaleY);
    background.setScale(scale);
    this.cloudManager?.generateClouds();
    this.effectManager.overlay(0.3);
  }

  setImageTexture(texture: string): void {
    if (this.image) this.image.setTexture(texture);
  }

  getImage(): Phaser.GameObjects.Image | undefined {
    return this.image;
  }
}
