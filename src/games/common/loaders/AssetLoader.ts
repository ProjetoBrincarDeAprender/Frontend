import Phaser from "phaser";

export default class AssetLoader {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  preLoadRectangleRed() {
    this.scene.load.image(
      "defaultRectangleRed",
      "/assets/common/defaultRectangleRed.svg",
    );
    this.scene.load.image(
      "hoverRectangleRed",
      "/assets/common/hoverRectangleRed.svg",
    );
    this.scene.load.image(
      "clickedRectangleRed",
      "/assets/common/clickedRectangleRed.svg",
    );
  }

  preloadClouds() {
    this.scene.load.image("cloud", "/assets/vowelsGame/images/cloud.png");
    this.scene.load.image("cloud2", "/assets/vowelsGame/images/cloud2.png");
    this.scene.load.image("cloud3", "/assets/vowelsGame/images/cloud3.png");
    this.scene.load.image("cloud4", "/assets/vowelsGame/images/cloud4.png");
  }
}
