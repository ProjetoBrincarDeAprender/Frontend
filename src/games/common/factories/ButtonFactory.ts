import ButtonManager from "../managers/ButtonManager";
import type Button from "../models/Button";

interface ButtonConfig {
  positions: { x: number; y: number };
  textures: {
    default: string;
    hover?: string;
    clicked?: string;
  };
  onClick: () => void;
  text?: string;
  fontSize?: number;
  scale?: number;
}

export default class ButtonFactory {
  private buttonManager: ButtonManager;

  constructor(buttonManager: ButtonManager) {
    this.buttonManager = buttonManager;
  }

  createButton({
    positions,
    textures,
    onClick,
    text = "Sair",
    fontSize,
    scale,
  }: ButtonConfig): Button {
    const button = this.buttonManager.createButton({
      positions: positions,
      textures: textures,
      text: text,
      fontSize: fontSize,
      scale: scale,
    });

    button.setInteractive().on("pointerup", onClick);
    return button;
  }
}
