import Logic from "../logic/Logic";
import Phaser from "phaser";
import api from "@/utils/api";

/**
 * Cena principal do jogo de sequência numérica.
 * Gerencia ciclo de vida, integração com lógica e recursos visuais.
 */
export default class GameScene extends Phaser.Scene {
  /** Instância da lógica do jogo (orquestra regras e progresso) */
  private logic: Logic;
  private gameDataTimer?: Phaser.Time.TimerEvent;

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
    this.load.image("numbersBackground", "/assets/numbersGame/background.png");
  }

  /**
   * Cria elementos visuais e inicia o primeiro nível do jogo.
   */
  create() {
    this.logic.createSequenceDisplay();
    this.logic.createButtons();
    this.setupLevel();

    console.log("Jogo de sequência numérica carregado!");

    this.startGameDataTimer();
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
          // Revela o número correto no lugar do ponto de interrogação
          this.logic.revealAnswer();
          this.logic.buttonSuccessEffect(button, "star");
          // Dá um pequeno tempo para a criança visualizar a sequência completa
          this.time.delayedCall(1200, () => {
            if (result.finished) {
              this.stopGameDataTimer();
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

  private startGameDataTimer() {
    if (this.gameDataTimer) {
      this.gameDataTimer.destroy();
    }
    this.gameDataTimer = this.time.addEvent({
      delay: 10000,
      callback: this.sendGameData,
      callbackScope: this,
      loop: true,
    });
  }

  private stopGameDataTimer() {
    if (this.gameDataTimer) {
      this.gameDataTimer.destroy();
      this.gameDataTimer = undefined;
    }
  }

  private async sendGameData() {
    try {
      const attempts = this.logic.getCurrentAttempts();
      const levelTime = this.logic.getCurrentLevelTime();
      const currentLevel = this.logic.getCurrentIndex();

      const gameData = {
        activityId: 4,
        questionId: currentLevel + 1,
        attempts: attempts,
        timeSpent: levelTime,
        responseDate: this.time.now,
        isCorrect: false,
        answer: "playing",
      };

      await api.post("/adaptiveSystem/interaction/register", gameData);
    } catch (error) {
      // Silencia erros periódicos para não interferir na experiência
    }
  }

  shutdown() {
    this.stopGameDataTimer();
  }
}
