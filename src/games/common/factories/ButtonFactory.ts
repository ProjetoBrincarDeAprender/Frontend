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

  /**
   * Cria um botão com as configurações fornecidas e associa um callback ao evento de clique.
   * Valida os parâmetros obrigatórios antes de criar o botão.
   * @param config Objeto de configuração do botão, incluindo posição, texturas, texto, tamanho da fonte, escala e callback de clique.
   * @returns Instância de Button criada.
   * @throws Error se parâmetros obrigatórios estiverem ausentes ou inválidos.
   */
  createButton({
    positions,
    textures,
    onClick,
    text = "Sair",
    fontSize,
    scale,
  }: ButtonConfig): Button {
    if (
      !positions ||
      typeof positions.x !== "number" ||
      typeof positions.y !== "number"
    ) {
      throw new Error(
        "Parâmetro 'positions' é obrigatório e deve conter x e y.",
      );
    }
    if (!textures || !textures.default) {
      throw new Error("Parâmetro 'textures.default' é obrigatório.");
    }

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
