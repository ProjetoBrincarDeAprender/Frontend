import ButtonManager from "../managers/ButtonManager";
import type Button from "../models/Button";

interface ButtonConfig {
  positions: { x: number; y: number };
  textures: {
    default: string;
    hover?: string;
    clicked?: string;
  };
  onClick?: () => void;
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
   * Cria múltiplos botões distribuídos horizontalmente na tela, ajustando automaticamente a posição X de cada botão.
   * @param configs Array de configurações para cada botão a ser criado.
   * @param screenWidth Largura total da área onde os botões serão distribuídos.
   * @returns Um array de instâncias de Button criadas e posicionadas.
   * O espaçamento horizontal é calculado para distribuir os botões uniformemente
   */
  createButtons(
    configs: ButtonConfig[],
    screenWidth: number,
    y: number,
    nonInteractive: boolean,
  ): Button[] {
    const createdButtons: Button[] = [];
    const spaceBetweenButtons = screenWidth / (configs.length + 1);

    for (let i = 0; i < configs.length; i++) {
      const newPositionX = spaceBetweenButtons * (i + 1);
      configs[i].positions.x = newPositionX;
      configs[i].positions.y = y;
      const button = this.createButton(configs[i], nonInteractive);
      createdButtons.push(button);
    }
    return createdButtons;
  }

  /**
   * Cria um botão com as configurações fornecidas e associa um callback ao evento de clique.
   * Valida os parâmetros obrigatórios antes de criar o botão.
   * @param config Objeto de configuração do botão, incluindo posição, texturas, texto, tamanho da fonte, escala e callback de clique.
   * @returns Instância de Button criada.
   * @throws Error se parâmetros obrigatórios estiverem ausentes ou inválidos.
   */
  createButton(
    {
      positions,
      textures,
      onClick,
      text = "No Text",
      fontSize,
      scale,
    }: ButtonConfig,
    nonInteractive: boolean,
  ): Button {
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

    const button = this.buttonManager.createButton(
      {
        positions: positions,
        textures: textures,
        text: text,
        fontSize: fontSize,
        scale: scale,
      },
      nonInteractive,
    );

    if (onClick) {
      button.setInteractive().on("pointerup", onClick);
    }
    return button;
  }
}
