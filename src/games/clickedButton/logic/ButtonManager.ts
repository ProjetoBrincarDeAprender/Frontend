import Phaser from "phaser";
import Button from "./Button";

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
  color?: string;
}

export default class ButtonManager {
  protected scene: Phaser.Scene;
  private buttons: Button[];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.buttons = [];
  }

  /**
   * Retorna o array atual de botões gerenciados por este manager.
   * @returns Array de instâncias de Button.
   */
  getButtons(): Button[] {
    return this.buttons;
  }

  /**
   * Atualiza o texto de todos os botões gerenciados.
   * @param texts Array de strings para definir como texto de cada botão.
   */
  setButtonsText(texts: string[]): void {
    this.buttons.forEach((button, index) => {
      button.setButtonText(texts[index]);
    });
  }

  /**
   * Cria múltiplos botões na cena a partir de um array de configurações.
   * @param config Array de objetos de configuração de botões.
   * @returns Array de instâncias de Button criadas.
   */
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

  /**
   * Cria um único botão na cena a partir de uma configuração.
   * @param config Objeto de configuração do botão.
   * @returns Instância de Button criada.
   */
  createButton({
    positions,
    textures,
    text,
    fontSize,
    scale = 1,
    color,
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
      color ? color : "#ffffffff", // Cor do texto do botão
    );

    this.scene.add.existing(button).setScale(scale);
    this.buttons.push(button);
    return button;
  }
}
