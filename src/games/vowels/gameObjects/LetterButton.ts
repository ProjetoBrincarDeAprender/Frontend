import Phaser from "phaser";

export class LetterButton extends Phaser.GameObjects.Container {
  private defaultImage: Phaser.GameObjects.Image;
  private hoverImage: Phaser.GameObjects.Image;
  private clickImage: Phaser.GameObjects.Image;

  private texto: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    defaultImage: string,
    hoverImage: string = defaultImage,
    clickImage: string = defaultImage,
    letter: string = "null",
  ) {
    super(scene, x, y);

    this.defaultImage = scene.add.image(0, 0, defaultImage);
    this.hoverImage = scene.add.image(0, 0, hoverImage);
    this.clickImage = scene.add.image(0, 0, clickImage);
    this.texto = scene.add.text(0, 0, letter).setOrigin(0.5);

    this.setSize(this.defaultImage.width, this.defaultImage.height);

    this.add(this.defaultImage);
    this.add(this.hoverImage);
    this.add(this.clickImage);
    this.add(this.texto);

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
}
