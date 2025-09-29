import Phaser from "phaser";

export default class Credits extends Phaser.Scene {
  constructor() {
    super("vowelsCredits");
  }

  preload() {
    this.load.image(
      "backgroundCredits",
      "/assets/vowelsGame/images/backgroundCredits.png",
    );
  }

  create() {
    const gameWidth = this.cameras.main.width;
    const gameHeight = this.cameras.main.height;

    this.createBackground();

    this.add
      .text(gameWidth / 2, gameHeight / 2 - 100, "Parabéns!", {
        color: "#2e1c00ff",
        fontFamily: "Verdana, Geneva, sans-serif",
        fontSize: "64px",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(gameWidth / 2, gameHeight / 2, "Você conseguiu!", {
        color: "#2e1c00ff",
        fontFamily: "Verdana, Geneva, sans-serif",
        fontSize: "50px",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
  }

  private createBackground(): void {
    const background = this.add.image(400, 300, "backgroundCredits");
    const scaleX = this.cameras.main.width / background.width;
    const scaleY = this.cameras.main.height / background.height;
    const scale = Math.max(scaleX, scaleY);
    background.setScale(scale);
  }
}
