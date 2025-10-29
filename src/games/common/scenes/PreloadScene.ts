import Phaser from "phaser";
export class PreloadScene extends Phaser.Scene {
  preload() {
    this.load.image("audioOn", "/assets/common/buttons/audioOn.svg");
    this.load.image("audioOff", "/assets/common/buttons/audioOff.svg");
  }
}
