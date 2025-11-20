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
  private questionMarks: Phaser.GameObjects.Text[] = [];
  private nextButton: Phaser.GameObjects.Container | null = null;

  // Game State
  private isTransitioning: boolean = false;
  private buttonsEnabled: boolean = true;
  private correctAnswerText: Phaser.GameObjects.Text | null = null;

  constructor() {
    super({ key: "GameScene" });
  }

  create(): void {
    const data = this.scene.settings.data as { restart?: boolean; currentLevel?: number; score?: number; gameType?: string } || {};
    
    // Check if restart is explicitly requested (from StartScene or EndScene "Jogar Novamente")
    const shouldRestart = data.restart === true || this.registry.get("shouldRestartAddress");
    
    if (shouldRestart) {
      // Clear all game-related registry entries when restarting
      this.registry.remove("addressGameCompleted");
      this.registry.remove("shouldRestartAddress");
      this.registry.remove("addressCurrentLevel");
      this.registry.remove("addressScore");
      this.currentLevel = 0;
      this.score = 0;
    } else {
      // Continue from where we left off (from LevelCompleteScene or normal progression)
      this.currentLevel = data.currentLevel !== undefined ? data.currentLevel : this.registry.get("addressCurrentLevel") || 0;
      this.score = data.score !== undefined ? data.score : this.registry.get("addressScore") || 0;
    }
    
    // Store current state in registry
    this.registry.set("addressCurrentLevel", this.currentLevel);
    this.registry.set("addressScore", this.score);

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
        onRestart: () => {
          // Clear all game registry when restarting from end scene
          this.registry.remove("addressGameCompleted");
          this.registry.remove("shouldRestartAddress");
          this.registry.remove("addressCurrentLevel");
          this.registry.remove("addressScore");
        }
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

    // Question text placeholder
    this.questionText = this.add.text(400, 230, "", {
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

    // Update title based on current phase
    this.updateTitle();

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

    // Clear question marks
    this.questionMarks.forEach(mark => mark.destroy());
    this.questionMarks = [];

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

    // Reset question position and style for true/false phase
    this.questionText.setPosition(400, 230);
    this.questionText.setStyle({
      fontSize: "32px",
      fontFamily: "Arial",
      color: "#2c3e50",
      fontStyle: "bold",
      align: "center",
      wordWrap: { width: 700 }
    });
    this.questionText.setText(question.question);

    // Add floating question marks animation around the text
    this.addFloatingQuestionMarks();

    // Create True/False buttons
    this.trueButton = new Button(
      this,
      300,
      350,
      "defaultButton",
      "hoverButton", 
      "clickedButton",
      "VERDADEIRO",
      26
    );

    this.falseButton = new Button(
      this,
      500,
      350,
      "defaultButton",
      "hoverButton", 
      "clickedButton",
      "FALSO",
      26
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

    // Set question as title
    this.questionText.setPosition(400, 110);
    this.questionText.setStyle({
      fontSize: "32px",
      fontFamily: "Arial",
      color: "#2c3e50",
      fontStyle: "bold",
      align: "center",
      wordWrap: { width: 700 }
    });
    this.questionText.setText("QUAL O TIPO DE BAIRRO DA IMAGEM?");

    // Load and display the single image
    this.load.image(level.image.key, level.image.path);
    this.load.start();

    this.load.once('complete', () => {
      // Show the big image (lowered position)
      const image = this.add.image(400, 280, level.image.key);
      image.setDisplaySize(400, 300);
      this.images.push(image);

      // Create 3 option buttons
      const buttonY = 500;
      const buttonSpacing = 250;
      const startX = 400 - buttonSpacing;

      level.options.forEach((option, index) => {
        const x = startX + (index * buttonSpacing);
        
        const button = new Button(
          this,
          x,
          buttonY,
          "defaultButton",
          "hoverButton", 
          "clickedButton",
          option.text,
          25
        );

        this.add.existing(button);
        this.imageButtons.push(button);

        button.on("pointerdown", async () => {
          if (this.buttonsEnabled) {
            await this.handleOptionSelection(index, level);
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

      // Only show correct answer if user got it right
      if (isCorrect) {
        if (question.isTrue && this.trueButton) {
          this.trueButton.setTint(0x00ff00);
        } else if (!question.isTrue && this.falseButton) {
          this.falseButton.setTint(0x00ff00);
        }
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

  private async handleOptionSelection(selectedIndex: number, level: ImageSelectionLevel): Promise<void> {
    if (this.isTransitioning || !this.buttonsEnabled) return;

    this.buttonsEnabled = false;
    this.isTransitioning = true;

    const isCorrect = level.options[selectedIndex]?.isCorrect || false;
    this.addressGameService.incrementAttempts();

    // Registrar na API
    try {
      const studentId = this.addressGameService.getStudentId();
      const questionId = this.currentLevel + 1;
      const answerText = level.options[selectedIndex]?.text || 'unknown';

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
      
      // Only highlight correct answer if the user got it right
      if (isCorrect && level.options[index]?.isCorrect) {
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

  private addFloatingQuestionMarks(): void {
    // Only add question marks for true/false phase
    if (!AddressGameData.isInTrueFalsePhase(this.currentLevel)) return;

    const questionMarkPositions = [
      { x: 150, y: 180 },
      { x: 650, y: 200 },
      { x: 120, y: 280 },
      { x: 680, y: 260 },
      { x: 180, y: 320 },
      { x: 620, y: 340 }
    ];

    questionMarkPositions.forEach((pos, index) => {
      const questionMark = this.add.text(pos.x, pos.y, "?", {
        fontSize: "28px",
        fontFamily: "Arial",
        color: "#3498db",
        fontStyle: "bold"
      }).setOrigin(0.5);

      // Add floating animation with different delays and directions
      this.tweens.add({
        targets: questionMark,
        y: pos.y - 20,
        duration: 2000 + (index * 200),
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1,
        delay: index * 300
      });

      // Add slight rotation animation
      this.tweens.add({
        targets: questionMark,
        rotation: index % 2 === 0 ? 0.2 : -0.2,
        duration: 1500 + (index * 100),
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1,
        delay: index * 200
      });

      // Store reference for cleanup
      this.questionMarks.push(questionMark);
    });
  }

  private updateTitle(): void {
    // Remove existing title if any
    const existingTitle = this.children.list.find(child => {
      if (child instanceof Phaser.GameObjects.Text) {
        const text = (child as Phaser.GameObjects.Text).text;
        return text && (text.includes("VERDADEIRO") || text.includes("TIPOS"));
      }
      return false;
    });
    if (existingTitle) {
      existingTitle.destroy();
    }

    // Only add title for true/false phase
    if (AddressGameData.isInTrueFalsePhase(this.currentLevel)) {
      this.add.text(400, 110, "VERDADEIRO OU FALSO?", {
        fontSize: "38px",
        fontFamily: "Arial",
        color: "#2c3e50",
        fontStyle: "bold",
      }).setOrigin(0.5);
    }
  }

  private nextLevel(): void {
    this.currentLevel++;
    this.addressGameService.incrementLevel();
    
    // Update registry with new level
    this.registry.set("addressCurrentLevel", this.currentLevel);
    this.registry.set("addressScore", this.score);

    const total = AddressGameData.getTotalLevels();

    if (this.currentLevel === AddressGameData.getTrueFalseCount()) {
      // Salvar estado no registry antes de ir para LevelCompleteScene
      this.registry.set("addressCurrentLevel", this.currentLevel);
      this.registry.set("addressScore", this.score);
      
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
      totalLevels: AddressGameData.getTotalLevels()
    });
  }
}
