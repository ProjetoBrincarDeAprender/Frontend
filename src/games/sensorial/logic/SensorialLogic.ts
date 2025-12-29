import ButtonFactory from "@/games/common/factories/ButtonFactory";
import ButtonManager from "@/games/common/managers/ButtonManager";
import Button from "@/games/common/models/Button";
import { APIDataService } from "@/games/common/services/APIData.service";
import Phaser, { BlendModes } from "phaser";
import GameStats from "../../common/managers/GameStats";
import type { GameLevel } from "./SensorialGameData";
import SensorialLevel from "./SensorialLevel";

export default class SensorialLogic {
  private scene: Phaser.Scene;
  private gameStats: GameStats;
  private buttonManager: ButtonManager;
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

  // Audio management
  private currentAudio: Phaser.Sound.BaseSound | null = null;
  private audioTimer: Phaser.Time.TimerEvent | null = null;
  private audioButtons: Button[] = [];
  private selectedAudioButton: Button | null = null;
  private selectedButtonTween: Phaser.Tweens.Tween | null = null;

  // Audio duration limit (10 seconds)
  private readonly MAX_AUDIO_DURATION = 10000;

  // Modal system
  private modalContainer: Phaser.GameObjects.Container | null = null;
  private modalOverlay: Phaser.GameObjects.Graphics | null = null;
  private modalVisible: boolean = false;

  // Button colors (high contrast versions)
  private buttonColors = [0xff0066, 0x0099ff, 0xff6600];

  constructor(scene: Phaser.Scene, activityId?: number) {
    this.scene = scene;
    this.activityId = activityId;
    this.gameStats = new GameStats();
    this.buttonManager = new ButtonManager(this.scene);
    this.buttonFactory = new ButtonFactory(this.buttonManager);

    this.buttonsEnabled = true;
  }

  getCurrentQuestion(): SensorialLevel {
    const currentLevel = this.gameLevels[this.currentLevelIndex];
    return currentLevel.questions[this.currentQuestionIndex];
  }

  getCurrentLevel(): GameLevel {
    return this.gameLevels[this.currentLevelIndex];
  }

  setGameLevels(levels: GameLevel[]) {
    this.gameLevels = levels;

    const savedProgress = this.scene.registry.get("currentSensorialProgress");
    if (savedProgress) {
      this.currentLevelIndex = savedProgress.levelIndex || 0;
      this.currentQuestionIndex = savedProgress.questionIndex || 0;

      console.log(
        `Progresso restaurado: Nível ${this.currentLevelIndex}, Questão ${this.currentQuestionIndex}`,
      );
    } else {
      this.currentLevelIndex = 0;
      this.currentQuestionIndex = 0;
      this.saveProgress();

      console.log("Novo jogo iniciado: Nível 0, Questão 0");
    }
  }

  createBackground(): void {
    const { width, height } = this.scene.scale;
    const background = this.scene.add.image(
      width / 2,
      height / 2,
      "background",
    );

    // Calculate scale to cover entire screen
    const scaleX = width / background.width;
    const scaleY = height / background.height;
    const scale = Math.max(scaleX, scaleY);

    background.setScale(scale);
  }

  createQuestion(): void {
    const { width } = this.scene.scale;
    const currentQuestion = this.getCurrentQuestion();

    this.questionText = this.scene.add
      .text(width / 2, 100, currentQuestion.getQuestion(), {
        fontSize: "32px",
        color: "#FFFFFF",
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 2,
        align: "center",
        wordWrap: { width: width - 100 },
      })
      .setOrigin(0.5);
  }

  createButtons(): void {
    this.clearButtons();
    const currentQuestion = this.getCurrentQuestion();

    if (currentQuestion.getLevelType() === "audio-to-image") {
      this.createAudioToImageLayout(currentQuestion);
    } else {
      this.createImageToAudioLayout(currentQuestion);
    }
  }

  private createAudioToImageLayout(question: SensorialLevel): void {
    const { width, height } = this.scene.scale;

    // Create central audio button
    const audioButton = this.buttonFactory.createButton({
      positions: { x: width / 2, y: height / 2 - 50 },
      textures: {
        default: "defaultButton",
        hover: "hoverButton",
        clicked: "clickedButton",
      },
      text: "🔊 TOCAR SOM",
      fontSize: 24,
      scale: 1.2,
      onClick: () => this.playQuestionAudio(question),
    });

    this.buttons.push(audioButton);

    // Create image option buttons
    const optionsImages = question.getOptionsImages();
    if (optionsImages) {
      // Create shuffled indices to randomize button order
      const indices = Array.from({ length: optionsImages.length }, (_, i) => i);
      Phaser.Utils.Array.Shuffle(indices);

      const startX = width / 2 - 200;
      const y = height / 2 + 100;

      indices.forEach((originalIndex, displayIndex) => {
        const x = startX + displayIndex * 200;
        const image = optionsImages[originalIndex];
        const option = question.getOptions()[originalIndex];

        const imageObj = this.scene.add
          .image(x, y, image.replace(".png", ""))
          .setScale(0.45)
          .setInteractive()
          .on("pointerover", () => imageObj.setScale(0.5))
          .on("pointerout", () => imageObj.setScale(0.45))
          .on("pointerdown", () => this.handleImageClick(option));

        this.buttons.push(imageObj);
      });
    }
  }

  private createImageToAudioLayout(question: SensorialLevel): void {
    const { width, height } = this.scene.scale;

    // Create central question image
    const questionImage = question.getQuestionImage();
    if (questionImage) {
      const imageObj = this.scene.add
        .image(width / 2, height / 2 - 50, questionImage.replace(".png", ""))
        .setScale(0.45);

      this.buttons.push(imageObj);
    }

    // Create audio option buttons
    const optionsAudio = question.getOptionsAudio();
    if (optionsAudio) {
      // Create shuffled indices to randomize button order
      const indices = Array.from({ length: optionsAudio.length }, (_, i) => i);
      Phaser.Utils.Array.Shuffle(indices);

      const startX = width / 2 - 200;
      const y = height / 2 + 100;

      this.audioButtons = [];
      indices.forEach((originalIndex, displayIndex) => {
        const x = startX + displayIndex * 200;
        const audio = optionsAudio[originalIndex];
        const option = question.getOptions()[originalIndex];
        const buttonColor =
          this.buttonColors[displayIndex % this.buttonColors.length];

        const audioButton = this.buttonFactory.createButton({
          positions: { x, y },
          textures: {
            default: "defaultButton",
            hover: "hoverButton",
            clicked: "clickedButton",
          },
          text: "🔊",
          fontSize: 32,
          scale: 1,
          onClick: () =>
            this.handleAudioButtonClick(audioButton, audio, option),
        });

        // Apply high contrast tint
        audioButton.clearTint();
        audioButton.setBlendMode(BlendModes.OVERLAY);
        audioButton.setTint(buttonColor);

        this.audioButtons.push(audioButton);
        this.buttons.push(audioButton);
      });
    }
  }

  private playQuestionAudio(question: SensorialLevel): void {
    if (!this.buttonsEnabled) return;

    this.stopCurrentAudio();

    const audioPath = question.getQuestionAudio();
    if (audioPath) {
      const audioKey = audioPath.replace("sounds/", "").replace(".m4a", "");
      this.currentAudio = this.scene.sound.add(audioKey);
      this.currentAudio.play();

      // Set timer to stop audio after 10 seconds
      this.audioTimer = this.scene.time.delayedCall(
        this.MAX_AUDIO_DURATION,
        () => {
          this.stopCurrentAudio();
        },
      );
    }
  }

  private handleImageClick(selectedOption: string): void {
    if (!this.buttonsEnabled) return;

    this.buttonsEnabled = false;
    const currentQuestion = this.getCurrentQuestion();

    if (currentQuestion.isCorrectAnswer(selectedOption)) {
      this.handleCorrectAnswer();
    } else {
      this.handleWrongAnswer();
    }
  }

  private handleAudioButtonClick(
    button: Button,
    audioPath: string,
    option: string,
  ): void {
    if (!this.buttonsEnabled) return;

    // If clicking the same selected button, show confirmation modal
    if (this.selectedAudioButton === button && !this.modalVisible) {
      this.buttonsEnabled = false; // Disable buttons while modal is open
      this.showConfirmationModal(option);
      return;
    }

    // Deselect previous button
    this.deselectAudioButton();

    // Select new button
    this.selectAudioButton(button);

    // Play audio
    this.stopCurrentAudio();
    const audioKey = audioPath.replace("sounds/", "").replace(".m4a", "");
    this.currentAudio = this.scene.sound.add(audioKey);
    this.currentAudio.play();

    // Set timer to stop audio after 10 seconds
    this.audioTimer = this.scene.time.delayedCall(
      this.MAX_AUDIO_DURATION,
      () => {
        this.stopCurrentAudio();
      },
    );
  }

  private selectAudioButton(button: Button): void {
    this.selectedAudioButton = button;

    // Add lime green selection highlighting
    button.setTint(0x32ff32); // Bright lime green

    // Start pulsing animation
    this.startButtonAnimation(button);
  }

  private deselectAudioButton(): void {
    if (this.selectedAudioButton) {
      // Stop animation
      if (this.selectedButtonTween) {
        this.selectedButtonTween.stop();
        this.selectedButtonTween = null;
      }

      // Reset scale and tint
      this.selectedAudioButton.setScale(1.0);

      // Find original color based on button index
      const buttonIndex = this.audioButtons.indexOf(this.selectedAudioButton);
      if (buttonIndex >= 0) {
        const originalColor =
          this.buttonColors[buttonIndex % this.buttonColors.length];
        this.selectedAudioButton.setTint(originalColor);
      }

      this.selectedAudioButton = null;
    }

    // Remove border graphics
    this.clearSelectionGraphics();
  }

  private clearSelectionGraphics(): void {
    this.buttons = this.buttons.filter((element) => {
      if (element instanceof Phaser.GameObjects.Graphics) {
        element.destroy();
        return false;
      }
      return true;
    });
  }

  private startButtonAnimation(button: Button): void {
    if (this.selectedButtonTween) {
      this.selectedButtonTween.stop();
    }

    this.selectedButtonTween = this.scene.tweens.add({
      targets: button,
      scale: { from: 1, to: 1.1 },
      duration: 1000,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    });
  }

  private showConfirmationModal(selectedOption: string): void {
    if (this.modalVisible) return;

    const { width, height } = this.scene.scale;

    // Create modal overlay
    this.modalOverlay = this.scene.add.graphics();
    this.modalOverlay.fillStyle(0x000000, 0.4);
    this.modalOverlay.fillRect(0, 0, width, height);
    this.modalOverlay.setDepth(1000);

    // Make overlay interactive to close modal when clicking outside
    this.modalOverlay.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, width, height),
      Phaser.Geom.Rectangle.Contains,
    );
    this.modalOverlay.on("pointerdown", () => this.cancelConfirmation());

    // Create modal container
    this.modalContainer = this.scene.add.container(width / 2, height / 2);
    this.modalContainer.setDepth(1001);

    // Modal background
    const modalBg = this.scene.add.graphics();
    modalBg.fillStyle(0x000000, 0.9);
    modalBg.fillRoundedRect(-200, -100, 400, 200, 10);

    // Modal text
    const modalText = this.scene.add
      .text(0, -30, "Confirmar esta resposta?", {
        fontSize: "24px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    // Confirm button
    const confirmButton = this.scene.add.graphics();
    confirmButton.fillStyle(0x00ff00); // Green
    confirmButton.fillRoundedRect(-90, 20, 80, 40, 5);

    const confirmText = this.scene.add
      .text(-50, 40, "Confirmar", {
        fontSize: "16px",
        color: "#000000",
      })
      .setOrigin(0.5);

    confirmButton.setInteractive(
      new Phaser.Geom.Rectangle(-90, 20, 80, 40),
      Phaser.Geom.Rectangle.Contains,
    );
    confirmButton.on("pointerdown", () => this.confirmAnswer(selectedOption));

    // Cancel button
    const cancelButton = this.scene.add.graphics();
    cancelButton.fillStyle(0xff0000); // Red
    cancelButton.fillRoundedRect(10, 20, 80, 40, 5);

    const cancelText = this.scene.add
      .text(50, 40, "Cancelar", {
        fontSize: "16px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    cancelButton.setInteractive(
      new Phaser.Geom.Rectangle(10, 20, 80, 40),
      Phaser.Geom.Rectangle.Contains,
    );
    cancelButton.on("pointerdown", () => this.cancelConfirmation());

    // Add elements to container
    this.modalContainer.add([
      modalBg,
      modalText,
      confirmButton,
      confirmText,
      cancelButton,
      cancelText,
    ]);

    // Set initial alpha to 0 for fade effect
    this.modalContainer.setAlpha(0);
    this.modalOverlay.setAlpha(0);

    // Fade in animation
    this.scene.tweens.add({
      targets: [this.modalContainer, this.modalOverlay],
      alpha: 1,
      duration: 500,
      ease: "Power2",
    });

    this.modalVisible = true;
  }

  private confirmAnswer(selectedOption: string): void {
    this.hideConfirmationModal(() => {
      this.buttonsEnabled = false; // Keep disabled for answer processing
      const currentQuestion = this.getCurrentQuestion();

      if (currentQuestion.isCorrectAnswer(selectedOption)) {
        this.handleCorrectAnswer();
      } else {
        this.handleWrongAnswer();
      }
    });
  }

  private cancelConfirmation(): void {
    this.hideConfirmationModal(() => {
      this.buttonsEnabled = true; // Re-enable buttons when canceling
      this.deselectAudioButton();
    });
  }

  private hideConfirmationModal(callback?: () => void): void {
    if (!this.modalVisible) return;

    // Fade out animation
    this.scene.tweens.add({
      targets: [this.modalContainer, this.modalOverlay],
      alpha: 0,
      duration: 500,
      ease: "Power2",
      onComplete: () => {
        if (this.modalContainer) {
          this.modalContainer.destroy();
          this.modalContainer = null;
        }
        if (this.modalOverlay) {
          this.modalOverlay.destroy();
          this.modalOverlay = null;
        }
        this.modalVisible = false;
        if (callback) callback();
      },
    });
  }

  private stopCurrentAudio(): void {
    if (this.currentAudio) {
      this.currentAudio.stop();
      this.currentAudio = null;
    }

    if (this.audioTimer) {
      this.audioTimer.remove();
      this.audioTimer = null;
    }
  }

  private handleCorrectAnswer(): void {
    this.stopCurrentAudio();

    // Tocar som de acerto
    this.scene.sound.play("correct");

    this.showFeedback("CORRETO!", 0x00ff00, false);

    // Add stats and send to API
    this.gameStats.addHitTime(this.scene.time.now);
    this.gameStats.addMissCount();

    const apiService = new APIDataService(this.scene);
    const uniqueQuestionIndex = this.getQuestionId();

    apiService.sendGameData(this.activityId || 8, uniqueQuestionIndex, {
      attempts: this.gameStats.getCurrentLevelMisses(),
      timeSpent: this.gameStats.getCurrentLevelTimeSpent(this.scene.time.now),
      isCorrect: true,
      answer: this.generateAnswerLog(),
      neededHint: false,
    });

    this.gameStats.resetInitialLevelTime(this.scene.time.now);
    this.gameStats.resetActualLevelMisses();

    this.scene.time.delayedCall(2000, () => {
      this.progressToNext();
    });
  }
  private progressToNext(): void {
    this.currentQuestionIndex++;

    if (this.currentQuestionIndex >= this.getCurrentLevel().questions.length) {
      this.goToNextLevel();
    } else {
      this.saveProgress();
      this.setupLevel();
    }
  }

  private saveProgress(): void {
    this.scene.registry.set("currentSensorialProgress", {
      levelIndex: this.currentLevelIndex,
      questionIndex: this.currentQuestionIndex,
    });
  }

  private clearProgress(): void {
    this.scene.registry.remove("currentSensorialProgress");
  }

  private getUniqueQuestionIndex(): number {
    let index = 1;
    for (let i = 0; i < this.currentLevelIndex; i++) {
      index += this.gameLevels[i].questions.length;
    }
    return index + this.currentQuestionIndex;
  }

  private getQuestionId(): number {
    return this.getCurrentQuestion().getQuestionId();
  }

  goToNextLevel(): void {
    this.currentLevelIndex++;
    this.currentQuestionIndex = 0;

    if (this.currentLevelIndex < this.gameLevels.length) {
      this.saveProgress();
      this.scene.scene.start("LevelCompleteScene");
    } else {
      // Game completed - clear progress for next playthrough
      this.clearProgress();
      this.scene.scene.start("EndScene");
    }
  }

  private generateAnswerLog(): string {
    return JSON.stringify({
      level: this.currentLevelIndex + 1,
      question: this.currentQuestionIndex + 1,
      timestamp: Date.now(),
    });
  }

  private handleWrongAnswer(): void {
    this.stopCurrentAudio();
    this.deselectAudioButton();

    // Tocar som de erro
    this.scene.sound.play("incorrect", { volume: 0.7 });

    this.showFeedback("TENTE NOVAMENTE!", 0xff0000, true);

    // Add miss stats and send to API
    this.gameStats.addMiss();

    const apiService = new APIDataService(this.scene);
    const uniqueQuestionIndex = this.getQuestionId();

    apiService.sendGameData(this.activityId || 8, uniqueQuestionIndex, {
      attempts: this.gameStats.getCurrentLevelMisses(),
      timeSpent: this.gameStats.getCurrentLevelTimeSpent(this.scene.time.now),
      isCorrect: false,
      answer: this.generateAnswerLog(),
      neededHint: false,
    });
  }

  private showFeedback(
    text: string,
    color: number,
    reactivateButtons: boolean = false,
  ): void {
    const { width, height } = this.scene.scale;

    const feedback = this.scene.add
      .text(width / 2, height / 2, text.toUpperCase(), {
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
      .setDepth(98);

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
    this.buttonsEnabled = true;
    this.deselectAudioButton();

    if (this.questionText) {
      this.questionText.destroy();
    }
    this.createQuestion();
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

  private clearButtons(): void {
    this.buttons.forEach((button) => {
      if (button && typeof button.destroy === "function") {
        button.destroy();
      }
    });
    this.buttons = [];
    this.audioButtons = [];
    this.selectedAudioButton = null;

    if (this.selectedButtonTween) {
      this.selectedButtonTween.stop();
      this.selectedButtonTween = null;
    }
  }
}
