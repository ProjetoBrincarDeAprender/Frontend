import Phaser from "phaser";

export default class TextureManager {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  preload(textures: { key: string; path: string }[]): void {
    textures.forEach(({ key, path }) => {
      this.scene.load.image(key, path);
    });
  }
}
