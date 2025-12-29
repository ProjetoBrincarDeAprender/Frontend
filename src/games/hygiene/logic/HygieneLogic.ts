import ButtonFactory from "@/games/common/factories/ButtonFactory";
import ButtonManager from "@/games/common/managers/ButtonManager";
import Button from "@/games/common/models/Button";
import { APIDataService } from "@/games/common/services/APIData.service";
import Phaser from "phaser";
import EffectManager from "../../common/managers/EffectManager";
import GameStats from "../../common/managers/GameStats";
import type { GameLevel } from "./HygieneGameData";
import HygieneLevel from "./HygieneLevel";

export default class HygieneLogic {
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

  getCurrentQuestion(): HygieneLevel {
    const currentLevel = this.gameLevels[this.currentLevelIndex];
    return currentLevel.questions[this.currentQuestionIndex];
  }

  getCurrentLevel(): GameLevel {
    return this.gameLevels[this.currentLevelIndex];
  }

  setGameLevels(levels: GameLevel[]) {
    this.gameLevels = levels;

    // Restaurar progresso se existir
    const savedProgress = this.scene.registry.get("currentHygieneProgress");
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
      .text(this.scene.scale.width / 2, 120, currentQuestion.getQuestion(), {
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
    const difficulty = currentQuestion.getDifficulty();

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

    // Layout específico baseado na dificuldade
    if (difficulty === "easy") {
      this.createLevel1Layout(options, optionsImages, currentQuestion);
    } else if (difficulty === "medium") {
      this.createLevel2Layout(options, optionsImages, currentQuestion);
    } else {
      this.createLevel3Layout(options, currentQuestion);
    }
  }

  /**
   * Função auxiliar para criar caixas com bordas para conter imagens
   */
  private createImageBox(
    x: number,
    y: number,
    borderColor: number,
    boxSize: number = 150,
  ): Phaser.GameObjects.Graphics {
    const boxBackground = this.scene.add.graphics();
    const padding = 2;

    // Fundo branco com padding
    boxBackground.fillStyle(0xffffff, 1);
    boxBackground.fillRoundedRect(
      x - boxSize / 2 - padding,
      y - boxSize / 2 - padding,
      boxSize + padding * 2,
      boxSize + padding * 2,
      8,
    );

    // Borda colorida
    boxBackground.lineStyle(4, borderColor, 1);
    boxBackground.strokeRoundedRect(
      x - boxSize / 2 - padding,
      y - boxSize / 2 - padding,
      boxSize + padding * 2,
      boxSize + padding * 2,
      8,
    );

    // Adicionar borda extra na direção Y (16px)
    boxBackground.lineStyle(16, borderColor, 1); // Mudado de 0.3 para 1 (sólido)
    boxBackground.strokeRoundedRect(
      x - boxSize / 2 - 8,
      y - boxSize / 2 - 8,
      boxSize + 16,
      boxSize + 16,
      8,
    );

    return boxBackground;
  }

  /**
   * Função auxiliar para atualizar a aparência da caixa no hover
   */
  private updateImageBoxOnHover(
    boxBackground: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    borderColor: number,
    isHover: boolean,
    boxSize: number = 150,
  ): void {
    const padding = 2;
    boxBackground.clear();

    // Fundo com destaque ou normal
    const backgroundColor = isHover ? 0xf0f0f0 : 0xffffff;
    boxBackground.fillStyle(backgroundColor, 1);
    boxBackground.fillRoundedRect(
      x - boxSize / 2 - padding,
      y - boxSize / 2 - padding,
      boxSize + padding * 2,
      boxSize + padding * 2,
      8,
    );

    // Borda principal (mais espessa no hover)
    const borderWidth = isHover ? 6 : 4;
    boxBackground.lineStyle(borderWidth, borderColor, 1);
    boxBackground.strokeRoundedRect(
      x - boxSize / 2 - padding,
      y - boxSize / 2 - padding,
      boxSize + padding * 2,
      boxSize + padding * 2,
      8,
    );

    // Borda extra apenas se não for hover
    if (!isHover) {
      boxBackground.lineStyle(16, borderColor, 1); // Mudado de 0.3 para 1 (sólido)
      boxBackground.strokeRoundedRect(
        x - boxSize / 2 - 8,
        y - boxSize / 2 - 8,
        boxSize + 16,
        boxSize + 16,
        8,
      );
    }
  }

  /**
   * Layout do Nível 1: Grid principal com 2 colunas - 1ª coluna: actionImage da Duda, 2ª coluna: 2 opções
   */
  private createLevel1Layout(
    options: string[],
    optionsImages: string[] | null,
    currentQuestion: HygieneLevel,
  ): void {
    if (!optionsImages || !currentQuestion.hasActionImage()) return;

    const centerX = this.scene.scale.width / 2;
    const centerY = this.scene.scale.height / 2 + 50;

    // Grid principal: 2 colunas com mais espaçamento
    const mainGridSpacing = 350;

    // Coluna 1: Imagem da ação/gesto da Duda (actionImage)
    const demonstrationX = centerX - mainGridSpacing / 2;
    const actionImageKey = currentQuestion
      .getActionImage()!
      .replace(".png", "");
    const demonstrationImage = this.scene.add
      .image(demonstrationX, centerY, actionImageKey)
      .setScale(0.7);

    // Adicionar uma borda ou efeito visual para destacar que é a imagem de referência
    // Ajustar borda para o tamanho real da imagem
    const imageWidth = demonstrationImage.width * demonstrationImage.scaleX;
    const imageHeight = demonstrationImage.height * demonstrationImage.scaleY;

    const demonstrationBorder = this.scene.add.graphics();
    demonstrationBorder.lineStyle(4, 0x00ff00, 0.8);
    demonstrationBorder.strokeRoundedRect(
      demonstrationX - imageWidth / 2,
      centerY - imageHeight / 2,
      imageWidth,
      imageHeight,
      10,
    );

    // Coluna 2: Grid com apenas 2 opções clicáveis em caixas coloridas
    const optionsX = centerX + mainGridSpacing / 2;
    const optionsSpacing = 180;

    // Cores alternadas para as caixas (vermelho e azul)
    const boxColors = [0xff4444, 0x4444ff]; // Vermelho e azul

    // Com apenas 2 opções, não precisamos filtrar - usamos todas
    options.forEach((option, index) => {
      const imageKey = optionsImages[index].replace(".png", "");

      // Posições para grid 2x1 (lado a lado)
      const col = index % 2;
      const x = optionsX + (col - 0.5) * optionsSpacing;
      const y = centerY;

      // Cores alternadas para as caixas (vermelho e azul)
      const borderColor = boxColors[index % 2];

      // Criar caixa usando a função auxiliar
      const boxBackground = this.createImageBox(x, y, borderColor);

      const optionImage = this.scene.add
        .image(x, y, imageKey)
        .setScale(0.6)
        .setInteractive();

      // Fazer a imagem clicável
      optionImage.on("pointerdown", () => this.handleButtonClick(option));

      // Adicionar efeitos hover
      optionImage.on("pointerover", () => {
        optionImage.setScale(0.75);
        optionImage.setTint(0xdddddd);
        // Atualizar caixa para estado hover
        this.updateImageBoxOnHover(boxBackground, x, y, borderColor, true);
      });

      optionImage.on("pointerout", () => {
        optionImage.setScale(0.6);
        optionImage.clearTint();
        // Restaurar caixa para estado normal
        this.updateImageBoxOnHover(boxBackground, x, y, borderColor, false);
      });

      this.buttons.push(optionImage);
      this.buttons.push(boxBackground); // Adicionar a caixa para ser removida quando trocar questão
    });

    // Armazenar elementos não clicáveis para limpeza
    this.buttons.push(demonstrationImage);
    this.buttons.push(demonstrationBorder); // Adicionar a borda para ser removida quando trocar questão
  }

  /**
   * Layout do Nível 2: Grid tradicional com imagens, SEM nomes abaixo das imagens
   */
  private createLevel2Layout(
    options: string[],
    optionsImages: string[] | null,
    _currentQuestion: HygieneLevel,
  ): void {
    if (!optionsImages) return;

    const centerX = this.scene.scale.width / 2;
    const centerY = this.scene.scale.height / 2 + 50;
    const horizontalSpacing = 350;
    const verticalSpacing = 200;

    const positions = this.calculateGridLayout(
      options.length,
      centerX,
      centerY,
      horizontalSpacing,
      verticalSpacing,
    );

    options.forEach((option, index) => {
      const { x, y } = positions[index];
      const imageKey = optionsImages[index].replace(".png", "");

      // Criar caixa com borda preta para o Level 2
      const blackBorderColor = 0x000000; // Preto
      const boxBackground = this.createImageBox(x, y, blackBorderColor, 120); // Tamanho menor para Level 2

      const optionImage = this.scene.add
        .image(x, y, imageKey)
        .setScale(0.5)
        .setInteractive();

      // Fazer a imagem clicável
      optionImage.on("pointerdown", () => this.handleButtonClick(option));

      // Adicionar efeitos hover
      optionImage.on("pointerover", () => {
        optionImage.setScale(0.6);
        optionImage.setTint(0xdddddd);
        // Atualizar caixa para estado hover
        this.updateImageBoxOnHover(
          boxBackground,
          x,
          y,
          blackBorderColor,
          true,
          120,
        );
      });

      optionImage.on("pointerout", () => {
        optionImage.setScale(0.5);
        optionImage.clearTint();
        // Restaurar caixa para estado normal
        this.updateImageBoxOnHover(
          boxBackground,
          x,
          y,
          blackBorderColor,
          false,
          120,
        );
      });

      this.buttons.push(optionImage);
      this.buttons.push(boxBackground); // Adicionar a caixa para ser removida quando trocar questão
    });
  }

  /**
   * Layout do Nível 3: Botões de texto (sem imagens)
   */
  private createLevel3Layout(
    options: string[],
    _currentQuestion: HygieneLevel,
  ): void {
    const centerX = this.scene.scale.width / 2;
    const centerY = this.scene.scale.height / 2 + 50;
    const horizontalSpacing = 350;
    const verticalSpacing = 200;

    const positions = this.calculateGridLayout(
      options.length,
      centerX,
      centerY,
      horizontalSpacing,
      verticalSpacing,
    );

    options.forEach((option, index) => {
      const { x, y } = positions[index];

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

    apiService.sendGameData(this.activityId || 6, uniqueQuestionIndex, {
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
    this.scene.registry.set("currentHygieneProgress", {
      levelIndex: this.currentLevelIndex,
      questionIndex: this.currentQuestionIndex,
    });
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

    apiService.sendGameData(this.activityId || 6, uniqueQuestionIndex, {
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
    graphics.fillRoundedRect(
      feedback.x - feedback.width / 2 - 20,
      feedback.y - feedback.height / 2 - 10,
      feedback.width + 40,
      feedback.height + 20,
      15,
    );

    // Garantir que o texto fique na frente do background
    feedback.setDepth(1);

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
