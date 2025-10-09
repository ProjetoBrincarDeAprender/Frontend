import Logic from "../logic/Logic";
import Phaser from "phaser";

export default class VowelsGameScene extends Phaser.Scene {
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
    this.load.image(
      "backgroundMain",
      "/assets/vowelsGame/images/backgroundMain.png",
    );
    this.load.image("abelha", "/assets/vowelsGame/animals/abelha.svg");
    this.load.image(
      "abelhaCompleta",
      "/assets/vowelsGame/animals/abelhaCompleta.svg",
    );

    this.load.image("elefante", "/assets/vowelsGame/animals/elefante.svg");
    this.load.image(
      "elefanteCompleta",
      "/assets/vowelsGame/animals/elefanteCompleta.svg",
    );

    this.load.image("hiena", "/assets/vowelsGame/animals/hiena.svg");
    this.load.image(
      "hienaCompleta",
      "/assets/vowelsGame/animals/hienaCompleta.svg",
    );

    this.load.image("ovelha", "/assets/vowelsGame/animals/ovelha.svg");
    this.load.image(
      "ovelhaCompleta",
      "/assets/vowelsGame/animals/ovelhaCompleta.svg",
    );

    this.load.image("urso", "/assets/vowelsGame/animals/urso.svg");
    this.load.image(
      "ursoCompleta",
      "/assets/vowelsGame/animals/ursoCompleta.svg",
    );

    this.load.image("gato", "/assets/vowelsGame/animals/gato.svg");
    this.load.image(
      "gatoCompleta",
      "/assets/vowelsGame/animals/gatoCompleta.svg",
    );

    this.load.image("esquilo", "/assets/vowelsGame/animals/esquilo.svg");
    this.load.image(
      "esquiloCompleta",
      "/assets/vowelsGame/animals/esquiloCompleta.svg",
    );

    this.load.image("iguana", "/assets/vowelsGame/animals/iguana.svg");
    this.load.image(
      "iguanaCompleta",
      "/assets/vowelsGame/animals/iguanaCompleta.svg",
    );

    this.load.image("onca", "/assets/vowelsGame/animals/onca.svg");
    this.load.image(
      "oncaCompleta",
      "/assets/vowelsGame/animals/oncaCompleta.svg",
    );

    this.load.image("urubu", "/assets/vowelsGame/animals/urubu.svg");
    this.load.image(
      "urubuCompleta",
      "/assets/vowelsGame/animals/urubuCompleta.svg",
    );

    this.load.image("star", "/assets/common/star.svg");
    this.load.image("defaultButton", "/assets/common/defaultButton.svg");
    this.load.image("hoverButton", "/assets/common/hoverButton.svg");
    this.load.image("clickedButton", "/assets/common/clickedButton.svg");
    // Áudios de feedback
    this.load.audio("correct", "/assets/common/sounds/correct.mp3");
    this.load.audio("incorrect", "/assets/common/sounds/incorrect.mp3");
  }

  /**
   * Cria elementos visuais e inicia o primeiro nível do jogo.
   */
  create() {
    this.logic.createBackground("backgroundMain");
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
          // Som de acerto
          this.sound.play("correct", { volume: 0.7 });
          this.logic.buttonSuccessEffect(button, "star");
          this.time.delayedCall(3000, () => {
            if (result.finished) {
              this.scene.start("vowelsCredits");
            } else {
              this.setupLevel();
            }
          });
        } else {
          // Som de erro
          this.sound.play("incorrect", { volume: 0.7 });
          this.logic.buttonFailEffect(button);
        }
      });
    });
  }
}
