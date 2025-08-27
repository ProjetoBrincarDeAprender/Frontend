import Phaser from "phaser";

export default class Vowels extends Phaser.Scene {
  preload() {
    this.load.image("abelha", "/assets/abelha.svg");
  }

  create() {
    this.add.image(400, 300, "abelha");
  }

  update() {}
}
