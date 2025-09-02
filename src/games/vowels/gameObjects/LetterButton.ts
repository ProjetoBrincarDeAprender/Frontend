import Phaser from "phaser";

export class LetterButton extends Phaser.GameObjects.Container {
  private defaultImage: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene, x: number, y: number, defaultImage: string) {
    super(scene, x, y);

    this.defaultImage = scene.add.image(0, 0, defaultImage);

    this.add(this.defaultImage);
  }
}
