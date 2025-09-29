import Phaser from "phaser";

export default class AssetLoader {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  loadVowelsStartAssets(): void {
    this.loadBackgroundAssets();
    this.loadButtonAssets();
    this.loadCloudAssets();
  }

  private loadBackgroundAssets(): void {
    this.scene.load.image(
      "backgroundStart",
      "/assets/vowelsGame/images/backgroundMain.png",
    );
  }

  private loadButtonAssets(): void {
    const buttonAssets = [
      {
        key: "hoverButtonRectangle",
        path: "/assets/common/hoverButtonRectangle.svg",
      },
      {
        key: "defaultButtonRectangle",
        path: "/assets/common/defaultButtonRectangle.svg",
      },
      {
        key: "clickedButtonRectangle",
        path: "/assets/common/clickedButtonRectangle.svg",
      },
      {
        key: "defaultRectangleRed",
        path: "/assets/common/defaultRectangleRed.svg",
      },
      {
        key: "hoverRectangleRed",
        path: "/assets/common/hoverRectangleRed.svg",
      },
      {
        key: "clickedRectangleRed",
        path: "/assets/common/clickedRectangleRed.svg",
      },
    ];

    buttonAssets.forEach((asset) => {
      this.scene.load.image(asset.key, asset.path);
    });
  }

  private loadCloudAssets(): void {
    this.scene.load.image("cloud", "/assets/vowelsGame/images/cloud.png");
    this.scene.load.image("cloud2", "/assets/vowelsGame/images/cloud2.png");
  }
}
