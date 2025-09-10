import Button from "./Button";
import Phaser from "phaser";

export default class ButtonManager {
  protected scene: Phaser.Scene;
  public buttons: Button[];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.buttons = [];
  }

  createButtons(
    positions: { x: number; y: number }[],
    textures: string[],
  ): void {
    this.buttons = positions.map((pos) => {
      const button = new Button(
        this.scene,
        pos.x,
        pos.y,
        textures[0], // Imagem padrão (defaultImage)
        textures[1], // Imagem hover (hoverImage)
        textures[2], // Imagem do clique (clickImage)
      );
      this.scene.add.existing(button);
      return button;
    });
  }

  setButtonTexts(texts: string[]): void {
    this.buttons.forEach((button, index) => {
      button.setButtonText(texts[index]);
    });
  }

  addButtonsOnScene(): void {
    this.buttons.forEach((button) => {
      this.scene.add.existing(button);
    });
  }
}
