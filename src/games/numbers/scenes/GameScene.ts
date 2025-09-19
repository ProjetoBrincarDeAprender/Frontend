import Logic from "../logic/Logic";
import Phaser from "phaser";

/**
 * Cena principal do jogo de sequência numérica.
 * Gerencia ciclo de vida, integração com lógica e recursos visuais.
 */
export default class GameScene extends Phaser.Scene {
  /** Instância da lógica do jogo (orquestra regras e progresso) */
  private logic: Logic;

  /**
   * Construtor da cena do jogo de sequência numérica.
   * Inicializa lógica do jogo.
   */
  constructor() {
    super("numbersGameScene");
    this.logic = new Logic(this);
  }

  /**
   * Pré-carrega os recursos visuais necessários para o jogo.
   */
  preload() {
    this.load.image("star", "/assets/common/star.svg");
    this.load.image("defaultButton", "/assets/common/defaultButton.svg");
    this.load.image("hoverButton", "/assets/common/hoverButton.svg");
    this.load.image("clickedButton", "/assets/common/clickedButton.svg");
  }

  /**
   * Cria elementos visuais e inicia o primeiro nível do jogo.
   */
  create() {
    this.logic.createSequenceDisplay();
    this.logic.createButtons();
    this.setupLevel();

    console.log("Jogo de sequência numérica carregado!");
  }

  /**
   * Atualização do ciclo de jogo (não utilizada).
   */
  update() {}

  /**
   * Configura o nível atual: atualiza sequência, textos dos botões e listeners.
   * Reinicia listeners dos botões para evitar duplicidade.
   */
  setupLevel() {
    // Inicializa o tempo do nível atual
    this.logic.resetInitialLevelTime(this.time.now);

    this.logic.setSequenceText(this.logic.accessCurrentLevel().getName());
    this.logic.setButtonTexts();

    this.logic.getButtons().forEach((button) => {
      button.off("pointerdown");
      button.on("pointerdown", () => {
        const result = this.logic.handleClick(button, this.time.now);

        if (result.correct) {
          this.logic.buttonSuccessEffect(button, "star");
          this.time.delayedCall(1000, () => {
            if (result.finished) {
              this.scene.start("numbersCredits");
            } else {
              this.setupLevel();
            }
          });
        } else {
          this.logic.buttonFailEffect(button);
        }
      });
    });
  }
}
