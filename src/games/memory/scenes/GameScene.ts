import { AudioManager } from "@/games/common/managers/AudioManager";
import { PreloadScene } from "@/games/common/scenes/PreloadScene";
import api from "@/utils/api";
import { MemoryGameLogic } from "../logic/MemoryGameLogic";

export class MemoryGameScene extends PreloadScene {
  private logic!: MemoryGameLogic;
  private gameDataTimer?: Phaser.Time.TimerEvent;
  private userId?: string;
  private activityId?: number;

  constructor() {
    super({ key: "MemoryGameScene" });
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  setActivityId(activityId: number) {
    this.activityId = activityId;
  }

  init(data: { resetGame?: boolean } = {}) {
    this.logic = new MemoryGameLogic(this, this.userId, this.activityId);

    if (data.resetGame) {
      this.logic.resetGame();
      this.registry.set("currentLevel", 0);
    } else {
      const savedLevel = this.registry.get("currentLevel");
      if (savedLevel !== undefined && savedLevel > 0) {
        this.logic.setCurrentLevelFromRegistry(savedLevel);
      }
    }

    new AudioManager(this);
  }

  preload() {
    super.preload();
    this.load.image("star", "/assets/common/star.svg");
    this.load.image("card-0", "/assets/memoryGame/card-0.png");
    this.load.image("card-1", "/assets/memoryGame/card-1.png");
    this.load.image("card-2", "/assets/memoryGame/card-2.png");
    this.load.image("card-3", "/assets/memoryGame/card-3.png");
    this.load.image("card-4", "/assets/memoryGame/card-4.png");
    this.load.image("background", "/assets/memoryGame/fundo.png");
    // Áudios de feedback
    this.load.audio("correct", "/assets/common/sounds/correct.mp3");
    this.load.audio("incorrect", "/assets/common/sounds/incorrect.mp3");
  }

  create() {
    this.createBackground();

    this.logic.initializeLevel();
    this.logic.createCards();
    this.startGameDataTimer();
  }

  private startGameDataTimer() {
    // Remove timer anterior se existir
    if (this.gameDataTimer) {
      this.gameDataTimer.destroy();
    }

    // Criar timer que executa a cada 10 segundos
    this.gameDataTimer = this.time.addEvent({
      delay: 10000, // 10 segundos em milissegundos
      callback: this.sendGameData,
      callbackScope: this,
      loop: true,
    });
  }

  private async sendGameData() {
    try {
      const attempts = this.logic.getCurrentAttempts();
      const levelTime = this.logic.getCurrentLevelTime();
      // const currentQuestionIndex = this.logic.getAbsoluteQuestionIndex();

      const gameData = {
        studentId: Number(this.userId) || 10130001,
        activityId: this.activityId || 4,
        questionId: 1,
        attempts: attempts,
        timeSpent: levelTime,
        responseDate: this.time.now,
        isCorrect: false,
        answer: "playing",
      };

      console.log("Enviando dados do jogo:", gameData);

      const response = await api.post(
        "/adaptiveSystem/interaction/register",
        gameData,
      );

      if (response.status === 201) {
        console.log("Dados enviados com sucesso");
        console.log("Resposta do servidor:", response.data);
      } else {
        console.error("Erro ao enviar dados:", response.status);
      }
    } catch (error) {
      console.error("Erro ao enviar dados do jogo:", error);
    }
  }

  update() {
    if (this.logic.isQuestionCompleted()) {
      this.time.delayedCall(4000, () => {
        const currentLevel = this.logic.getCurrentLevel();

        // Limpar timer quando a questão termina
        if (this.gameDataTimer) {
          this.gameDataTimer.destroy();
          this.gameDataTimer = undefined;
        }

        this.logic.finishQuestion();

        const isLevelFinished = this.logic.isLevelFinished();

        // Salva o progresso atual no registro
        this.registry.set(
          "currentLevel",
          this.logic.getAbsoluteQuestionIndex(),
        );

        if (isLevelFinished) {
          // Nível completo, verificar se é o último nível ANTES de incrementar
          const isLastLevel = this.logic.isLastLevel();

          this.logic.finishLevel(); // Incrementa o nível

          if (isLastLevel) {
            // Era o último nível, jogo acabou
            this.scene.start("EndScene");
          } else {
            // Ainda há mais níveis
            this.scene.start("LevelCompleteScene", {
              level: currentLevel,
              isLastLevel: false,
            });
          }
        } else {
          // Se ainda há questões no nível atual, apenas continua para a próxima questão
          this.scene.restart();
        }
      });
    }
  }

  shutdown() {
    // Limpar timer quando a cena é encerrada
    if (this.gameDataTimer) {
      this.gameDataTimer.destroy();
      this.gameDataTimer = undefined;
    }
  }

  private createBackground(): void {
    const background = this.add.image(400, 300, "background");
    const scaleX = this.cameras.main.width / background.width;
    const scaleY = this.cameras.main.height / background.height;
    const scale = Math.max(scaleX, scaleY);
    background.setScale(scale);
  }
}
