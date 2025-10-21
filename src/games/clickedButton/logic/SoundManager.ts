import Phaser from "phaser";

export default class SoundManager {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  play(key: string) {
    this.scene.sound.play(key);
  }
}
