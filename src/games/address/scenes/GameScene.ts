import { AudioManager } from "@/games/common/managers/AudioManager";
import Button from "@/games/common/models/Button";
import { EndScene } from "@/games/common/scenes/EndScene";
import { LevelCompletedScene } from "@/games/common/scenes/LevelCompletedScene";
import Phaser from "phaser";
import { AddressGameData, type TrueFalseQuestion, type ImageSelectionLevel } from "../data/AddressGameData";
import { AddressGameService } from "../services/AddressGameService";

export class GameScene extends Phaser.Scene {
  private addressGameService!: AddressGameService;
  private currentLevel: number = 0;
  private score: number = 0;

  // UI Elements
  private questionText!: Phaser.GameObjects.Text;
  private trueButton: Button | null = null;
  private falseButton: Button | null = null;
  private imageButtons: Button[] = [];
  private images: Phaser.GameObjects.Image[] = [];
  private nextButton: Phaser.GameObjects.Container | null = null;

  // Game State
  private isTransitioning: boolean = false;
  private buttonsEnabled: boolean = true;
  private correctAnswerText: Phaser.GameObjects.Text | null = null;

  constructor() {
    super({ key: "GameScene" });
  }

  create(): void {
    const data = this.scene.settings.data as { restart?: boolean; currentLevel?: number; score?: number } || {};
    
    if (data.restart) {
      this.registry.remove("addressGameCompleted");
      this.currentLevel = 0;
      this.score = 0;
    } else {
      this.currentLevel = data.currentLevel || 0;
      this.score = data.score || 0;
    }

    this.addressGameService = new AddressGameService(this);
    this.addressGameService.setCurrentLevel(this.currentLevel);

    this.registerStandardScenes();
    this.createUI();
    this.startLevel();
  }

  preload(): void {
    // Load audio files
    this.load.audio("correct", "/assets/common/sounds/correct.mp3");
    this.load.audio("wrong", "/assets/common/sounds/incorrect.mp3");
    
    // Load audio manager buttons
    this.load.svg("audioOn", "/assets/common/buttons/audioOn.svg");
    this.load.svg("audioOff", "/assets/common/buttons/audioOff.svg");

    // Load default button assets
    this.load.svg("defaultButton", "/assets/common/buttons/rectangleBlueDefault.svg");
    this.load.svg("hoverButton", "/assets/common/buttons/rectangleBlueHover.svg");
    this.load.svg("clickedButton", "/assets/common/buttons/rectangleBlueClicked.svg");
  }

  private registerStandardScenes(): void {
    if (!this.scene.manager.getScene("LevelCompleteScene")) {
      const levelCompleteScene = new LevelCompletedScene({
        backgroundPath: "/assets/addressGame/bg.svg",
        backgroundKey: "addressBackground",
      });
      this.scene.add("LevelCompleteScene", levelCompleteScene);
    }

    if (!this.scene.manager.getScene("EndScene")) {
      const addressEndScene = new EndScene({
        restartScene: "StartScene",
        backgroundPath: "/assets/addressGame/bg.svg",
        backgroundKey: "addressBackground",
        subtitleMessage: "VOCÊ APRENDEU SOBRE \nENDEREÇOS!",
      });
      this.scene.add("EndScene", addressEndScene);
    }
  }

  private createUI(): void {
    // Create audio manager instance
    const audioManager = new AudioManager(this);
    audioManager.renderMuteButton();

    // Background
    this.add.rectangle(400, 300, 800, 600, 0x87CEEB, 0.3);

    // Title - dynamic based on phase
    let titleText = "VERDADEIRO OU FALSO?";
    if (!AddressGameData.isInTrueFalsePhase(this.currentLevel)) {
      titleText = "TIPOS DE BAIRROS";
    }
    
    this.add.text(400, 50, titleText, {
      fontSize: "32px",
      fontFamily: "Arial",
      color: "#2c3e50",
      fontStyle: "bold",
    }).setOrigin(0.5);

    // Question text placeholder
    this.questionText = this.add.text(400, 150, "", {
      fontSize: "32px",
      fontFamily: "Arial",
      color: "#2c3e50",
      fontStyle: "bold",
      align: "center",
      wordWrap: { width: 700 }
    }).setOrigin(0.5);
  }

  private startLevel(): void {
    if (this.currentLevel >= AddressGameData.getTotalLevels()) {
      this.endGame();
      return;
    }

    // Reiniciar timer para nova pergunta
    this.addressGameService.startQuestion();

    this.isTransitioning = false;
    this.buttonsEnabled = true;
    this.clearUI();

    if (AddressGameData.isInTrueFalsePhase(this.currentLevel)) {
      this.showTrueFalseLevel();
    } else {
      this.showImageSelectionLevel();
    }
  }

  private clearUI(): void {
    // Clear True/False buttons
    if (this.trueButton) {
      this.trueButton.destroy();
      this.trueButton = null;
    }
    if (this.falseButton) {
      this.falseButton.destroy();
      this.falseButton = null;
    }

    // Clear image buttons and images
    this.imageButtons.forEach(button => button.destroy());
    this.imageButtons = [];
    this.images.forEach(image => image.destroy());
    this.images = [];

    // Clear answer text
    if (this.correctAnswerText) {
      this.correctAnswerText.destroy();
      this.correctAnswerText = null;
    }

    // Clear next button
    if (this.nextButton) {
      this.nextButton.destroy();
      this.nextButton = null;
    }
  }

  private showTrueFalseLevel(): void {
    const question = AddressGameData.getTrueFalseQuestion(this.currentLevel);
    if (!question) return;

    this.questionText.setText(question.question);

    // Create True/False buttons
    this.trueButton = new Button(
      this,
      300,
      350,
      "defaultButton",
      "hoverButton", 
      "clickedButton",
      "VERDADEIRO",
      20
    );

    this.falseButton = new Button(
      this,
      500,
      350,
      "defaultButton",
      "hoverButton", 
      "clickedButton",
      "FALSO",
      20
    );

    this.add.existing(this.trueButton);
    this.add.existing(this.falseButton);

    this.trueButton.on("pointerdown", async () => {
      if (this.buttonsEnabled) {
        await this.handleTrueFalseAnswer(true, question);
      }
    });

    this.falseButton.on("pointerdown", async () => {
      if (this.buttonsEnabled) {
        await this.handleTrueFalseAnswer(false, question);
      }
    });
  }

  private showImageSelectionLevel(): void {
    const levelIndex = this.currentLevel - AddressGameData.getTrueFalseCount();
    const level = AddressGameData.getImageSelectionLevel(levelIndex);
    if (!level) return;

    this.questionText.setText(level.question);

    // Load and display images
    const startX = 150;
    const spacing = 200;

    level.images.forEach((imageData) => {
      // Load image with SVG method like locations game
      this.load.image(imageData.key, imageData.path);
    });

    this.load.start();

    this.load.once('complete', () => {
      level.images.forEach((imageData, index) => {
        const x = startX + (index * spacing);
        const image = this.add.image(x, 300, imageData.key);
        image.setDisplaySize(150, 100);
        this.images.push(image);

        // Create button over image
        const button = new Button(
          this,
          x,
          380,
          "defaultButton",
          "hoverButton", 
          "clickedButton",
          "ESCOLHER",
          16
        );

        this.add.existing(button);
        this.imageButtons.push(button);

        button.on("pointerdown", async () => {
          if (this.buttonsEnabled) {
            await this.handleImageSelection(index, level);
          }
        });
      });
    });
  }

  private async handleTrueFalseAnswer(answer: boolean, question: TrueFalseQuestion): Promise<void> {
    if (this.isTransitioning || !this.buttonsEnabled) return;

    this.buttonsEnabled = false;
    this.isTransitioning = true;

    const isCorrect = this.addressGameService.isCorrectTrueFalseAnswer(answer, question);
    this.addressGameService.incrementAttempts();

    // Registrar na API
    try {
      const studentId = this.addressGameService.getStudentId();
      const questionId = this.currentLevel + 1;
      const answerText = answer ? "VERDADEIRO" : "FALSO";

      if (isCorrect) {
        await this.addressGameService.registerCorrectAnswer(studentId, questionId, answerText);
      } else {
        await this.addressGameService.registerIncorrectAnswer(studentId, questionId, answerText);
      }
    } catch (error) {
      console.error("Erro ao registrar interação do jogo de endereços:", error);
    }

    // Visual feedback
    if (this.trueButton && this.falseButton) {
      this.trueButton.disableInteractive();
      this.falseButton.disableInteractive();

      if (answer) {
        this.trueButton.setTint(isCorrect ? 0x00ff00 : 0xff0000);
      } else {
        this.falseButton.setTint(isCorrect ? 0x00ff00 : 0xff0000);
      }

      // Show correct answer
      if (question.isTrue && this.trueButton) {
        this.trueButton.setTint(0x00ff00);
      } else if (!question.isTrue && this.falseButton) {
        this.falseButton.setTint(0x00ff00);
      }
    }

    if (isCorrect) {
      this.sound.play("correct", { volume: 0.7 });
      const points = this.addressGameService.calculateScore();
      this.score += points;
      this.addressGameService.addScore(points);

      // Show explanation
      if (question.explanation) {
        this.correctAnswerText = this.add.text(400, 450, question.explanation, {
          fontSize: "18px",
          fontFamily: "Arial",
          color: "#2c3e50",
          align: "center",
          wordWrap: { width: 600 }
        }).setOrigin(0.5);
      }

      this.time.delayedCall(2000, () => {
        this.buttonsEnabled = true;
        this.nextLevel();
      });
    } else {
      this.sound.play("wrong", { volume: 0.7 });
      
      this.time.delayedCall(2000, () => {
        this.buttonsEnabled = true;
        this.isTransitioning = false;
        this.resetTrueFalseButtonStates();
      });
    }
  }

  private async handleImageSelection(selectedIndex: number, level: ImageSelectionLevel): Promise<void> {
    if (this.isTransitioning || !this.buttonsEnabled) return;

    this.buttonsEnabled = false;
    this.isTransitioning = true;

    const isCorrect = this.addressGameService.isCorrectImageSelection(selectedIndex, level);
    this.addressGameService.incrementAttempts();

    // Registrar na API
    try {
      const studentId = this.addressGameService.getStudentId();
      const questionId = this.currentLevel + 1;
      const answerText = `image_${selectedIndex}_${level.images[selectedIndex]?.type || 'unknown'}`;

      if (isCorrect) {
        await this.addressGameService.registerCorrectAnswer(studentId, questionId, answerText);
      } else {
        await this.addressGameService.registerIncorrectAnswer(studentId, questionId, answerText);
      }
    } catch (error) {
      console.error("Erro ao registrar interação do jogo de endereços:", error);
    }

    // Visual feedback
    this.imageButtons.forEach((button, index) => {
      button.disableInteractive();
      
      if (index === selectedIndex) {
        button.setTint(isCorrect ? 0x00ff00 : 0xff0000);
      }
      
      // Highlight correct answer
      if (level.images[index]?.isCorrect) {
        button.setTint(0x00ff00);
      }
    });

    if (isCorrect) {
      this.sound.play("correct", { volume: 0.7 });
      const points = this.addressGameService.calculateScore();
      this.score += points;
      this.addressGameService.addScore(points);

      this.time.delayedCall(2000, () => {
        this.buttonsEnabled = true;
        this.nextLevel();
      });
    } else {
      this.sound.play("wrong", { volume: 0.7 });
      
      this.time.delayedCall(2000, () => {
        this.buttonsEnabled = true;
        this.isTransitioning = false;
        this.resetImageButtonStates();
      });
    }
  }

  private resetTrueFalseButtonStates(): void {
    if (this.trueButton) {
      this.trueButton.clearTint();
      this.trueButton.setInteractive();
    }
    if (this.falseButton) {
      this.falseButton.clearTint();
      this.falseButton.setInteractive();
    }
  }

  private resetImageButtonStates(): void {
    this.imageButtons.forEach(button => {
      button.clearTint();
      button.setInteractive();
    });
  }

  private nextLevel(): void {
    this.currentLevel++;
    this.addressGameService.incrementLevel();

    const total = AddressGameData.getTotalLevels();

    if (this.currentLevel === AddressGameData.getTrueFalseCount()) {
      // Após terminar as perguntas V/F, mostrar tela de nível completo
      this.scene.start("LevelCompleteScene", {
        currentLevel: this.currentLevel,
        totalLevels: total,
        score: this.score,
        gameType: "address",
        nextScene: "GameScene",
      });
    } else if (this.currentLevel >= total) {
      this.endGame();
    } else {
      this.startLevel();
    }
  }

  private endGame(): void {
    this.registry.set("addressGameCompleted", true);
    
    this.scene.start("EndScene", {
      score: this.score,
      totalLevels: AddressGameData.getTotalLevels(),
    });
  }
}
