import Phaser from "phaser";

export default class Button extends Phaser.GameObjects.Container {
  private defaultImage: Phaser.GameObjects.Image;
  private hoverImage: Phaser.GameObjects.Image;
  private clickImage: Phaser.GameObjects.Image;
  private buttonText: Phaser.GameObjects.Text;

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
      .on("pointerover", this.enterButtonHoverState)
      .on("pointerout", this.enterButtonRestState)
      .on("pointerdown", this.enterButtonActiveState)
      .on("pointerup", this.enterButtonHoverState);
  }

  enterButtonHoverState() {
    this.defaultImage.setVisible(false);
    this.hoverImage.setVisible(true);
    this.clickImage.setVisible(false);
  }

  enterButtonRestState() {
    this.defaultImage.setVisible(true);
    this.hoverImage.setVisible(false);
    this.clickImage.setVisible(false);
  }

  enterButtonActiveState() {
    this.defaultImage.setVisible(false);
    this.hoverImage.setVisible(false);
    this.clickImage.setVisible(true);
  }

  getButtonText(): string {
    const stringText = this.buttonText.text;
    return stringText;
  }

  setButtonText(buttonText: string): void {
    this.buttonText.text = buttonText;
  }
}
