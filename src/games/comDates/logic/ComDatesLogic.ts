import ButtonFactory from "@/games/common/factories/ButtonFactory";
import ButtonManager from "@/games/common/managers/ButtonManager";
import Button from "@/games/common/models/Button";
import { APIDataService } from "@/games/common/services/APIData.service";
import Phaser from "phaser";
import EffectManager from "../../common/managers/EffectManager";
import GameStats from "../../common/managers/GameStats";
import type { GameLevel } from "./ComDatesGameData";
import SpaceLevel from "./ComDatesLevel";

export default class ComDatesLogic {
  private scene: Phaser.Scene;
  private gameStats: GameStats;
  private buttonManager: ButtonManager;
  private effectManager: EffectManager;
  private gameLevels: GameLevel[] = [];
  private currentLevelIndex: number = 0;
  private currentQuestionIndex: number = 0;
  private buttonFactory: ButtonFactory;
  private questionText!: Phaser.GameObjects.Text;
  private buttons: (
    | Button
    | Phaser.GameObjects.Image
    | Phaser.GameObjects.Text
    | Phaser.GameObjects.Graphics
  )[] = [];
  private buttonsEnabled: boolean = true;
  private activityId?: number;

  constructor(scene: Phaser.Scene, activityId?: number) {
    this.scene = scene;
    this.activityId = activityId;
    this.gameStats = new GameStats();
    this.buttonManager = new ButtonManager(this.scene);
    this.effectManager = new EffectManager(this.scene);
    this.buttonFactory = new ButtonFactory(this.buttonManager);

    // Garantir que os botões iniciem habilitados
    this.buttonsEnabled = true;
  }

  getCurrentQuestion(): SpaceLevel {
    const currentLevel = this.gameLevels[this.currentLevelIndex];
    return currentLevel.questions[this.currentQuestionIndex];
  }

  getCurrentLevel(): GameLevel {
    return this.gameLevels[this.currentLevelIndex];
  }

  setGameLevels(levels: GameLevel[]) {
    this.gameLevels = levels;

    // Restaurar progresso se existir
    const savedProgress = this.scene.registry.get("currentComDatesProgress");
    if (savedProgress) {
      this.currentLevelIndex = savedProgress.levelIndex || 0;
      this.currentQuestionIndex = savedProgress.questionIndex || 0;

      console.log(
        `Progresso restaurado: Nível ${this.currentLevelIndex}, Questão ${this.currentQuestionIndex}`,
      );
    } else {
      // Primeira vez - inicializar no nível 0, questão 0
      this.currentLevelIndex = 0;
      this.currentQuestionIndex = 0;
      this.saveProgress();

      console.log("Novo jogo iniciado: Nível 0, Questão 0");
    }
  }

  createBackground(): void {
    const background = this.scene.add.image(400, 300, "background");
    const scaleX = this.scene.cameras.main.width / background.width;
    const scaleY = this.scene.cameras.main.height / background.height;
    const scale = Math.max(scaleX, scaleY);
    background.setScale(scale);

    this.effectManager.overlay(0.2);
  }

  createQuestion(): void {
    const currentQuestion = this.getCurrentQuestion();

    this.questionText = this.scene.add
      .text(this.scene.scale.width / 2, 50, currentQuestion.getQuestion(), {
        fontFamily: "Arial Black",
        fontSize: "32px",
        color: "#FFFFFF",
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 4,
        align: "center",
        wordWrap: { width: this.scene.scale.width - 100 },
      })
      .setOrigin(0.5);
  }

  createButtons(): void {
    const currentQuestion = this.getCurrentQuestion();
    const originalOptions = currentQuestion.getOptions();
    const originalOptionsImages = currentQuestion.getOptionsImages();
    const hasImages = currentQuestion.hasImages();

    // Garantir que os botões estejam habilitados
    this.buttonsEnabled = true;

    // Criar arrays de índices para embaralhar
    const indices = Array.from({ length: originalOptions.length }, (_, i) => i);
    this.shuffleArray(indices);

    // Aplicar o shuffle nas opções e imagens
    const options = indices.map((i) => originalOptions[i]);
    const optionsImages = originalOptionsImages
      ? indices.map((i) => originalOptionsImages[i])
      : null;

    // Limpar botões anteriores
    this.buttons.forEach((button) => {
      if (button && typeof button.destroy === "function") {
        button.destroy();
      }
    });
    this.buttons = [];

    // Configurações para layout em grid 2x2
    const centerX = this.scene.scale.width / 2;
    const centerY = this.scene.scale.height / 2 + 60;
    const horizontalSpacing = 350; // Espaçamento horizontal entre colunas
    const verticalSpacing = 230; // Espaçamento vertical entre linhas

    // Calcular posições em formato grid 2x2
    const positions = this.calculateGridLayout(
      options.length,
      centerX,
      centerY,
      horizontalSpacing,
      verticalSpacing,
    );

    options.forEach((option, index) => {
      const { x, y } = positions[index];

      if (hasImages && optionsImages) {
        // Para questões com imagens, criar apenas a imagem clicável sem fundo
        const imageKey = optionsImages[index].replace(".png", "");
        const showNames = currentQuestion.getDifficulty() === "medium";

        const planetImage = this.scene.add
          .image(x, showNames ? y - 20 : y, imageKey)
          .setScale(0.2)
          .setInteractive()
          .setDepth(10);

        let planetText: Phaser.GameObjects.Text | null = null;

        // Adicionar o nome do planeta embaixo da imagem apenas para dificuldade medium
        if (showNames) {
          planetText = this.scene.add
            .text(x, y + 45, option.toUpperCase(), {
              fontFamily: "Arial Black",
              fontSize: "24px",
              color: "#FFFFFF",
              fontStyle: "bold",
              stroke: "#000000",
              strokeThickness: 2,
              align: "center",
              wordWrap: { width: 180 },
            })
            .setOrigin(0.5)
            .setDepth(11);

          // Fazer o texto também clicável
          planetText.setInteractive();
          planetText.on("pointerdown", () => this.handleButtonClick(option));
        }

        // Fazer a imagem clicável
        planetImage.on("pointerdown", () => this.handleButtonClick(option));

        // Adicionar efeitos hover na imagem
        planetImage.on("pointerover", () => {
          planetImage.setScale(0.25);
          planetImage.setDepth(11);
          if (planetText) planetText.setScale(1.1);
          if (planetText) planetText.setDepth(12);
        });
        planetImage.on("pointerout", () => {
          planetImage.setScale(0.2);
          planetImage.setDepth(10);
          if (planetText) planetText.setScale(1.0);
          if (planetText) planetText.setDepth(11);
        });

        // Adicionar efeitos hover no texto (apenas se existir)
        if (planetText) {
          planetText.on("pointerover", () => {
            planetImage.setScale(0.25);
            planetImage.setDepth(11);
            planetText.setScale(1.1);
            planetText.setDepth(12);
          });
          planetText.on("pointerout", () => {
            planetImage.setScale(0.2);
            planetImage.setDepth(10);
            planetText.setScale(1.0);
            planetText.setDepth(11);
          });

          // Armazenar referência do texto para limpeza posterior
          this.buttons.push(planetText);
        }

        // Armazenar referências para limpeza posterior
        this.buttons.push(planetImage);
      } else {
        // Para questões só com texto, usar botão normal
        const button = this.buttonFactory.createButton({
          positions: { x, y },
          textures: {
            default: "defaultButton",
            hover: "hoverButton",
            clicked: "clickedButton",
          },
          text: option,
          fontSize: 32,
          scale: 1,
          onClick: () => this.handleButtonClick(option),
        });

        // Aplicar word wrap ao texto do botão após criação
        const buttonText = button.getButtonText();
        if (buttonText) {
          buttonText.setWordWrapWidth(280);
          buttonText.setAlign("center");
        }

        this.buttons.push(button);
      }
    });
  }

  private handleButtonClick(selectedOption: string): void {
    // Verificar se os botões estão habilitados
    if (!this.buttonsEnabled) {
      return;
    }

    // Bloquear todos os botões imediatamente
    this.buttonsEnabled = false;

    const currentQuestion = this.getCurrentQuestion();
    const isCorrect = currentQuestion.isCorrectAnswer(selectedOption);

    if (isCorrect) {
      this.handleCorrectAnswer();
    } else {
      this.handleWrongAnswer();
    }
  }

  private handleCorrectAnswer(): void {
    // Efeito visual de sucesso
    this.scene.sound.play("correct");

    this.gameStats.addHitTime(this.scene.time.now);
    this.gameStats.addMissCount();

    const apiService = new APIDataService(this.scene);

    // Usar índice único baseado em nível e questão
    const uniqueQuestionIndex = this.getQuestionId();

    apiService.sendGameData(this.activityId || 7, uniqueQuestionIndex, {
      attempts: this.gameStats.getCurrentLevelMisses(),
      timeSpent: this.gameStats.getCurrentLevelTimeSpent(this.scene.time.now),
      isCorrect: true,
      answer: this.generateAnswerLog(),
      neededHint: false, // temporario, dica não implementada
    });

    this.gameStats.resetInitialLevelTime(this.scene.time.now);
    this.gameStats.resetActualLevelMisses(); // Resetar para a próxima questão

    // Mostrar feedback positivo
    this.showFeedback("Correto! 🎉", 0x00ff00);

    // Ir para próxima questão ou nível após um delay
    this.scene.time.delayedCall(3500, () => {
      this.progressToNext();
    });
  }

  private progressToNext(): void {
    const currentLevel = this.getCurrentLevel();
    const hasNextQuestion =
      this.currentQuestionIndex < currentLevel.questions.length - 1;

    if (hasNextQuestion) {
      // Próxima questão no mesmo nível
      this.currentQuestionIndex++;
      this.saveProgress();
      this.setupLevel(); // Atualizar a interface para a nova questão
    } else {
      // Nível completo, verificar se há próximo nível
      const hasNextLevel = this.currentLevelIndex < this.gameLevels.length - 1;

      if (hasNextLevel) {
        // Incrementar o nível e salvar no registry
        this.currentLevelIndex++;
        this.currentQuestionIndex = 0;
        this.saveProgress();

        // Ir para cena padrão de level complete
        this.scene.scene.start("LevelCompleteScene");
      } else {
        // Último nível completo, ir para tela final
        this.scene.scene.start("EndScene");
      }
    }
  }

  private saveProgress(): void {
    this.scene.registry.set("currentComDatesProgress", {
      levelIndex: this.currentLevelIndex,
      questionIndex: this.currentQuestionIndex,
    });
  }

  private getUniqueQuestionIndex(): number {
    return this.getCurrentQuestion().getQuestionId();
  }

  private getQuestionId(): number {
    return this.getCurrentQuestion().getQuestionId();
  }

  goToNextLevel(): void {
    if (this.currentLevelIndex < this.gameLevels.length - 1) {
      this.currentLevelIndex++;
      this.currentQuestionIndex = 0;
      this.saveProgress();
    }
  }

  private generateAnswerLog(): string {
    const currentQuestion = this.getCurrentQuestion();
    const correctAnswer = currentQuestion.getAnswer();
    const options = currentQuestion.getOptions();

    const log = {
      selectedAnswer: correctAnswer,
      correctAnswer: correctAnswer,
      options: options,
      difficulty: currentQuestion.getDifficulty(),
    };

    return JSON.stringify(log);
  }

  private handleWrongAnswer(): void {
    // Efeito visual de erro
    this.scene.sound.play("incorrect", { volume: 0.7 });

    // Adicionar estatísticas
    this.gameStats.addMiss();

    const apiService = new APIDataService(this.scene);

    const uniqueQuestionIndex = this.getQuestionId();

    apiService.sendGameData(this.activityId || 7, uniqueQuestionIndex, {
      attempts: this.gameStats.getCurrentLevelMisses(),
      timeSpent: this.gameStats.getCurrentLevelTimeSpent(this.scene.time.now),
      isCorrect: false,
      answer: this.generateAnswerLog(),
      neededHint: false, // temporario, dica não implementada
    });

    // Mostrar feedback negativo
    this.showFeedback("Tente novamente! 🤔", 0xff0000, true);
  }

  private showFeedback(
    text: string,
    color: number,
    reactivateButtons: boolean = false,
  ): void {
    const feedback = this.scene.add
      .text(this.scene.scale.width / 2, this.scene.scale.height / 2, text, {
        fontFamily: "Arial Black",
        fontSize: "28px",
        color: "#FFFFFF",
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 3,
        padding: { left: 20, right: 20, top: 10, bottom: 10 },
      })
      .setOrigin(0.5);

    const graphics = this.scene.add.graphics();
    graphics.fillStyle(color, 0.7);
    graphics
      .fillRoundedRect(
        feedback.x - feedback.width / 2 - 20,
        feedback.y - feedback.height / 2 - 10,
        feedback.width + 40,
        feedback.height + 20,
        15,
      )
      .setDepth(99);

    // Garantir que o texto fique na frente do background
    feedback.setDepth(100);

    // Animar entrada do feedback
    this.scene.tweens.add({
      targets: feedback,
      scaleX: { from: 0, to: 1.2 },
      scaleY: { from: 0, to: 1.2 },
      duration: 300,
      ease: "Back.easeOut",
      onComplete: () => {
        // Manter o feedback visível e depois animar saída
        this.scene.time.delayedCall(2800, () => {
          this.scene.tweens.add({
            targets: feedback,
            scaleX: 0,
            scaleY: 0,
            duration: 200,
            ease: "Back.easeIn",
            onComplete: () => {
              feedback.destroy();
              graphics.destroy();
              // Reativar botões se necessário (para respostas erradas)
              if (reactivateButtons) {
                this.buttonsEnabled = true;
              }
            },
          });
        });
      },
    });
  }

  setupLevel(): void {
    // Reativar botões para a nova pergunta
    this.buttonsEnabled = true;

    // Atualizar pergunta
    if (this.questionText) {
      this.questionText.destroy();
    }
    this.createQuestion();

    // Recriar botões
    this.createButtons();
  }

  isGameFinished(): boolean {
    return (
      this.currentLevelIndex >= this.gameLevels.length - 1 &&
      this.currentQuestionIndex >= this.getCurrentLevel().questions.length - 1
    );
  }

  getGameStats(): GameStats {
    return this.gameStats;
  }

  private shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  private calculateGridLayout(
    numButtons: number,
    centerX: number,
    centerY: number,
    horizontalSpacing: number,
    verticalSpacing: number,
  ): { x: number; y: number }[] {
    const positions: { x: number; y: number }[] = [];

    for (let i = 0; i < numButtons; i++) {
      let x: number;
      let y: number;

      if (numButtons === 1) {
        // 1 botão: centro
        x = centerX;
        y = centerY;
      } else if (numButtons === 2) {
        // 2 botões: lado a lado na linha superior
        const col = i % 2;
        x =
          centerX +
          (col === 0 ? -horizontalSpacing / 2 : horizontalSpacing / 2);
        y = centerY - verticalSpacing / 2;
      } else if (numButtons === 3) {
        // 3 botões: 2 na linha superior, 1 no centro da linha inferior
        if (i < 2) {
          // Primeira linha: 2 botões
          const col = i % 2;
          x =
            centerX +
            (col === 0 ? -horizontalSpacing / 2 : horizontalSpacing / 2);
          y = centerY - verticalSpacing / 2;
        } else {
          // Segunda linha: 1 botão no centro
          x = centerX;
          y = centerY + verticalSpacing / 2;
        }
      } else {
        // 4 ou mais botões: grid 2x2 padrão
        const row = Math.floor(i / 2);
        const col = i % 2;

        x =
          centerX +
          (col === 0 ? -horizontalSpacing / 2 : horizontalSpacing / 2);
        y = centerY + (row === 0 ? -verticalSpacing / 2 : verticalSpacing / 2);
      }

      positions.push({ x, y });
    }

    return positions;
  }
}
