import Phaser from "phaser";

export default class Button extends Phaser.GameObjects.Container {
  private defaultImage: Phaser.GameObjects.Image;
  private hoverImage: Phaser.GameObjects.Image;
  private clickImage: Phaser.GameObjects.Image;
  private buttonText: Phaser.GameObjects.Text;
  private state: "rest" | "hover" | "active" = "rest";

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    defaultImage: string = "null",
    hoverImage: string = defaultImage,
    clickImage: string = defaultImage,
    buttonText: string = "",
    fontSize: number = 32,
  ) {
    super(scene, x, y);

    this.defaultImage = scene.add.image(0, 0, defaultImage);
    this.hoverImage = scene.add.image(0, 0, hoverImage);
    this.clickImage = scene.add.image(0, 0, clickImage);
    this.buttonText = scene.add
      .text(0, 0, buttonText, {
        fontFamily: "Arial",
        fontSize: `${fontSize}px`,
      })
      .setOrigin(0.5);

    this.setSize(this.defaultImage.width, this.defaultImage.height);

    this.add(this.defaultImage);
    this.add(this.hoverImage);
    this.add(this.clickImage);
    this.add(this.buttonText);

    this.hoverImage.setVisible(false);
    this.clickImage.setVisible(false);

    this.setInteractive()
      .on("pointerover", () => {
        this.setButtonState("hover");
        this.emit("hover");
      })
      .on("pointerout", () => {
        this.setButtonState("rest");
        this.emit("rest");
      })
      .on("pointerdown", () => {
        this.setButtonState("active");
        this.emit("pressed");
      })
      .on("pointerup", () => {
        this.setButtonState("hover");
        this.emit("released");
      });
  }

  setButtonState(newState: "rest" | "hover" | "active"): void {
    this.state = newState;
    this.updateButtonVisual();
  }

  private updateButtonVisual(): void {
    this.defaultImage.setVisible(this.state === "rest");
    this.hoverImage.setVisible(this.state === "hover");
    this.clickImage.setVisible(this.state === "active");
  }

  getButtonStringText(): string {
    const stringText = this.buttonText.text;
    return stringText;
  }

  getButtonText(): Phaser.GameObjects.Text {
    return this.buttonText;
  }

  setButtonText(buttonText: string): void {
    this.buttonText.text = buttonText;
  }

  setTint(color: number): void {
    this.defaultImage.setTint(color);
    this.hoverImage.setTint(color);
    this.clickImage.setTint(color);
  }

  clearTint(): void {
    this.defaultImage.clearTint();
    this.hoverImage.clearTint();
    this.clickImage.clearTint();
  }
}
