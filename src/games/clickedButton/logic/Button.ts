import Phaser from "phaser";
/**
 * Classe Button
 *
 * Representa um botão customizado para o jogo, com diferentes estados visuais (normal, hover, ativo) e texto.
 * Permite manipulação de cor, texto e eventos de interação.
 *
 * Principais responsabilidades:
 * - Exibir diferentes imagens conforme o estado do botão
 * - Exibir texto centralizado
 * - Emitir eventos de interação (hover, pressed, released)
 * - Permitir alteração de cor/tint e texto
 */

export default class Button extends Phaser.GameObjects.Container {
  /** Imagem padrão do botão (estado normal) */
  private defaultImage: Phaser.GameObjects.Image;
  /** Imagem do botão no estado hover */
  private hoverImage: Phaser.GameObjects.Image;
  /** Imagem do botão no estado ativo/clicado */
  private clickImage: Phaser.GameObjects.Image;
  /** Texto exibido no botão */
  private buttonText: Phaser.GameObjects.Text;
  /** Estado atual do botão */
  private buttonState: "rest" | "hover" | "active" = "rest";

  /**
   * Cria um novo botão customizado.
   * @param scene Cena Phaser
   * @param x Posição X
   * @param y Posição Y
   * @param defaultImage Imagem padrão
   * @param hoverImage Imagem para hover
   * @param clickImage Imagem para clique
   * @param buttonText Texto do botão
   * @param fontSize Tamanho da fonte
   */
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

    // Configura eventos de interação do botão
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

  /**
   * Altera o estado visual do botão.
   * @param newState Novo estado (rest, hover, active)
   */
  setButtonState(newState: "rest" | "hover" | "active"): void {
    this.buttonState = newState;
    this.updateButtonVisual();
  }

  /**
   * Atualiza a imagem exibida conforme o estado do botão.
   */
  private updateButtonVisual(): void {
    this.defaultImage.setVisible(this.buttonState === "rest");
    this.hoverImage.setVisible(this.buttonState === "hover");
    this.clickImage.setVisible(this.buttonState === "active");
  }

  /**
   * Retorna o texto atual do botão como string.
   */
  getButtonStringText(): string {
    const stringText = this.buttonText.text;
    return stringText;
  }

  /**
   * Retorna o objeto Phaser.Text do botão.
   */
  getButtonText(): Phaser.GameObjects.Text {
    return this.buttonText;
  }

  /**
   * Altera o texto exibido no botão.
   * @param buttonText Novo texto
   */
  setButtonText(buttonText: string): void {
    this.buttonText.text = buttonText;
  }

  /**
   * Aplica uma cor/tint nas imagens do botão.
   * @param color Cor em formato hexadecimal
   */
  setTint(color: number): void {
    this.defaultImage.setTint(color);
    this.hoverImage.setTint(color);
    this.clickImage.setTint(color);
  }

  /**
   * Remove o tint das imagens do botão.
   */
  clearTint(): void {
    this.defaultImage.clearTint();
    this.hoverImage.clearTint();
    this.clickImage.clearTint();
  }
}
