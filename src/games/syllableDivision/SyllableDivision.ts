import Phaser from "phaser";

export default class SyllableDivision extends Phaser.Scene {
  constructor() {
    super({ key: "SyllableDivision" });
  }

  preload() {}

  create() {
    this.add.rectangle(400, 300, 100, 100, 0x000000, 0.5);
  }
}
