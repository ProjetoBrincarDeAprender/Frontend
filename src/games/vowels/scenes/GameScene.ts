import Logic from "../logic/Logic";
import Phaser from "phaser";

/**
 * Cena principal do jogo das vogais.
 * Gerencia ciclo de vida, integração com lógica e recursos visuais.
 */
export default class GameScene extends Phaser.Scene {
  /** Instância da lógica do jogo (orquestra regras e progresso) */
  private logic: Logic;

  /**
   * Construtor da cena do jogo das vogais.
   * Inicializa lógica do jogo.
   */
  constructor() {
    super("vowelsGameScene");
    this.logic = new Logic(this);
  }

  /**
   * Pré-carrega os recursos visuais necessários para o jogo.
   */
  preload() {
    this.load.image("background", "/assets/vowelsGame/background.jpeg");
    this.load.image("abelha", "/assets/vowelsGame/abelha.svg");
    this.load.image("elefante", "/assets/vowelsGame/elefante.svg");
    this.load.image("hiena", "/assets/vowelsGame/hiena.svg");
    this.load.image("ovelha", "/assets/vowelsGame/ovelha.svg");

    this.load.image("ovos", "/assets/vowelsGame/ovos.png");
    this.load.image("urso", "/assets/vowelsGame/urso.svg");
    this.load.image("star", "/assets/common/star.svg");
    this.load.image("defaultButton", "/assets/common/defaultButton.svg");
    this.load.image("hoverButton", "/assets/common/hoverButton.svg");
    this.load.image("clickedButton", "/assets/common/clickedButton.svg");
  }

  /**
   * Cria elementos visuais e inicia o primeiro nível do jogo.
   */
  create() {
    this.logic.createBackground("background");
    this.logic.createImage(this.logic.accessCurrentLevel().getName());
    this.logic.createButtons();
    this.setupLevel();

    console.log("Jogo das vogais carregado!");
  }

  /**
   * Atualização do ciclo de jogo (não utilizada).
   */
  update() {}

  /**
   * Configura o nível atual: atualiza imagem, textos dos botões e listeners.
   * Reinicia listeners dos botões para evitar duplicidade.
   */
  setupLevel() {
    this.logic.setImageTexture(this.logic.accessCurrentLevel().getName());
    this.logic.setButtonTexts();

    this.logic.getButtons().forEach((button) => {
      button.off("pointerdown");
      button.on("pointerdown", () => {
        const result = this.logic.handleClick(button, this.time.now);

        if (result.correct) {
          this.logic.buttonSuccessEffect(button, "star");
          this.time.delayedCall(1000, () => {
            if (result.finished) {
              this.scene.start("vowelsCredits");
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
