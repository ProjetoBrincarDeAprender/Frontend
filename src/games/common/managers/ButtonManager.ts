import Phaser from "phaser";
import Button from "../models/Button";

interface ButtonConfig {
  positions: { x: number; y: number };
  textures: {
    default: string;
    hover?: string;
    clicked?: string;
  };
  text?: string;
  fontSize?: number;
  scale?: number;
}

export default class ButtonManager {
  protected scene: Phaser.Scene;
  private buttons: Button[];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.buttons = [];
  }

  createButtons(config: ButtonConfig[]): Button[] {
    const newButtons: Button[] = [];

    for (let i = 0; i < config.length; i++) {
      const newButton: Button = this.createButton({
        positions: config[i].positions,
        textures: config[i].textures,
        text: config[i].text,
        fontSize: config[i].fontSize,
        scale: config[i].scale,
      });
      newButtons.push(newButton);
    }

    this.buttons = newButtons;
    return newButtons;
  }

  createButton({
    positions,
    textures,
    text,
    fontSize,
    scale = 1,
  }: ButtonConfig): Button {
    const button = new Button(
      this.scene,
      positions.x,
      positions.y,
      textures.default, // Imagem padrão (defaultImage)
      textures.hover, // Imagem hover (hoverImage)
      textures.clicked, // Imagem do clique (clickImage)
      text ? text : "", // Texto do botão (buttonText)
      fontSize ? fontSize : undefined, // Tamanho da fonte padrão (defaultFontSize)
    );
    this.scene.add.existing(button).setScale(scale);
    return button;
  }

  getButtons(): Button[] {
    return this.buttons;
  }

  setButtonTexts(texts: string[]): void {
    this.buttons.forEach((button, index) => {
      button.setButtonText(texts[index]);
    });
  }
}
