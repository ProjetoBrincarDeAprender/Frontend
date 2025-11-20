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
    const data = this.scene.settings.data as { currentLevel?: number; score?: number } || {};
    const hasRegistryData = this.registry.get("addressCurrentLevel") !== undefined;
    
    if (!data.currentLevel && !hasRegistryData) {
      this.currentLevel = 0;
      this.score = 0;
      this.registry.remove("addressCurrentLevel");
      this.registry.remove("addressScore");
      this.registry.remove("addressGameCompleted");
    } else {
      this.currentLevel = data.currentLevel !== undefined ? data.currentLevel : this.registry.get("addressCurrentLevel") || 0;
      this.score = data.score !== undefined ? data.score : this.registry.get("addressScore") || 0;
      this.registry.set("addressCurrentLevel", this.currentLevel);
      this.registry.set("addressScore", this.score);
    }

    this.addressGameService = new AddressGameService(this);
    this.addressGameService.setCurrentLevel(this.currentLevel);

    this.registerStandardScenes();
    this.createUI();
    this.startLevel();
  }

  preload(): void {
    this.load.audio("correct", "/assets/common/sounds/correct.mp3");
    this.load.audio("wrong", "/assets/common/sounds/incorrect.mp3");
    this.load.svg("audioOn", "/assets/common/buttons/audioOn.svg");
    this.load.svg("audioOff", "/assets/common/buttons/audioOff.svg");
    this.load.svg("defaultButton", "/assets/common/buttons/rectangleBlueDefault.svg");
    this.load.svg("hoverButton", "/assets/common/buttons/rectangleBlueHover.svg");
    this.load.svg("clickedButton", "/assets/common/buttons/rectangleBlueClicked.svg");
    this.load.svg("star", "/assets/common/buttons/star.svg");
  }

  private registerStandardScenes(): void {
    if (!this.scene.manager.getScene("LevelCompleteScene")) {
      const levelCompleteScene = new LevelCompletedScene({
        backgroundPath: "/assets/addressGame/bg.svg",
        backgroundKey: "addressBackground",
        onMenuReturn: () => {
          this.registry.remove("addressCurrentLevel");
          this.registry.remove("addressScore");
          this.registry.remove("addressGameCompleted");
        }
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
          this.registry.remove("addressCurrentLevel");
          this.registry.remove("addressScore");
          this.registry.remove("addressGameCompleted");
        }
      });
      this.scene.add("EndScene", addressEndScene);
    }
  }

  private createUI(): void {
    const audioManager = new AudioManager(this);
    audioManager.renderMuteButton();
    this.add.rectangle(400, 300, 800, 600, 0x87CEEB, 0.3);
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

    this.addressGameService.startQuestion();
    this.isTransitioning = false;
    this.buttonsEnabled = true;
    this.clearUI();
    this.updateTitle();

    if (AddressGameData.isInTrueFalsePhase(this.currentLevel)) {
      this.showTrueFalseLevel();
    } else {
      this.showImageSelectionLevel();
    }
  }

  private clearUI(): void {
    if (this.trueButton) {
      this.trueButton.destroy();
      this.trueButton = null;
    }
    if (this.falseButton) {
      this.falseButton.destroy();
      this.falseButton = null;
    }

    this.imageButtons.forEach(button => button.destroy());
    this.imageButtons = [];
    this.images.forEach(image => image.destroy());
    this.images = [];
    this.questionMarks.forEach(mark => mark.destroy());
    this.questionMarks = [];

    if (this.correctAnswerText) {
      this.correctAnswerText.destroy();
      this.correctAnswerText = null;
    }
    if (this.nextButton) {
      this.nextButton.destroy();
      this.nextButton = null;
    }
  }

  private showTrueFalseLevel(): void {
    const question = AddressGameData.getTrueFalseQuestion(this.currentLevel);
    if (!question) return;

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
    this.addFloatingQuestionMarks();

    this.trueButton = new Button(this, 300, 350, "defaultButton", "hoverButton", "clickedButton", "VERDADEIRO", 26);
    this.falseButton = new Button(this, 500, 350, "defaultButton", "hoverButton", "clickedButton", "FALSO", 26);

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

    this.questionText.setPosition(400, 90);
    this.questionText.setStyle({
      fontSize: "32px",
      fontFamily: "Arial",
      color: "#2c3e50",
      fontStyle: "bold",
      align: "center",
      wordWrap: { width: 700 }
    });
    this.questionText.setText("QUAL O TIPO DE BAIRRO DA IMAGEM?");

    this.load.image(level.image.key, level.image.path);
    this.load.start();

    this.load.once('complete', () => {
      const image = this.add.image(400, 280, level.image.key);
      image.setDisplaySize(400, 300);
      this.images.push(image);

      const buttonY = 500;
      const buttonSpacing = 250;
      const startX = 400 - buttonSpacing;

      level.options.forEach((option, index) => {
        const x = startX + (index * buttonSpacing);
        const button = new Button(this, x, buttonY, "defaultButton", "hoverButton", "clickedButton", option.text, 25);
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

    try {
      const studentId = this.addressGameService.getStudentId();
      const questionId = this.currentLevel + 1;
      const answerText = answer ? "VERDADEIRO" : "FALSO";

      if (isCorrect) {
        await this.addressGameService.registerCorrectAnswer(studentId, questionId, answerText);
      } else {
        await this.addressGameService.registerIncorrectAnswer(studentId, questionId, answerText);
      }
    } catch (_error) {
      // Silent fail for API errors
    }

    if (this.trueButton && this.falseButton) {
      this.trueButton.disableInteractive();
      this.falseButton.disableInteractive();

      if (answer) {
        this.trueButton.setTint(isCorrect ? 0x00ff00 : 0xff0000);
      } else {
        this.falseButton.setTint(isCorrect ? 0x00ff00 : 0xff0000);
      }

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
      this.createStarsEffect(400, 300);

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

    try {
      const studentId = this.addressGameService.getStudentId();
      const questionId = this.currentLevel + 1;
      const answerText = level.options[selectedIndex]?.text || 'unknown';

      if (isCorrect) {
        await this.addressGameService.registerCorrectAnswer(studentId, questionId, answerText);
      } else {
        await this.addressGameService.registerIncorrectAnswer(studentId, questionId, answerText);
      }
    } catch (_error) {
      // Silent fail for API errors
    }

    this.imageButtons.forEach((button, index) => {
      button.disableInteractive();
      
      if (index === selectedIndex) {
        button.setTint(isCorrect ? 0x00ff00 : 0xff0000);
      }
      
      if (isCorrect && level.options[index]?.isCorrect) {
        button.setTint(0x00ff00);
      }
    });

    if (isCorrect) {
      this.sound.play("correct", { volume: 0.7 });
      const points = this.addressGameService.calculateScore();
      this.score += points;
      this.addressGameService.addScore(points);
      this.createStarsEffect(400, 350);

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
    if (!AddressGameData.isInTrueFalsePhase(this.currentLevel)) return;

    const positions = [
      { x: 130, y: 120 }, { x: 680, y: 100 }, { x: 110, y: 320 },
      { x: 750, y: 320 }, { x: 180, y: 480 }, { x: 620, y: 440 }
    ];

    positions.forEach((pos, index) => {
      const questionMark = this.add.text(pos.x, pos.y, "?", {
        fontSize: "32px",
        fontFamily: "Arial",
        color: "#da5450",
        fontStyle: "bold"
      }).setOrigin(0.5);

      this.tweens.add({
        targets: questionMark,
        y: pos.y - 20,
        duration: 2000 + (index * 200),
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1,
        delay: index * 300
      });

      this.tweens.add({
        targets: questionMark,
        rotation: index % 2 === 0 ? 0.2 : -0.2,
        duration: 1500 + (index * 100),
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1,
        delay: index * 200
      });

      this.questionMarks.push(questionMark);
    });
  }

  private updateTitle(): void {
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
    this.registry.set("addressCurrentLevel", this.currentLevel);
    this.registry.set("addressScore", this.score);

    const total = AddressGameData.getTotalLevels();

    if (this.currentLevel === AddressGameData.getTrueFalseCount()) {
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



  private createStarsEffect(centerX: number, centerY: number): void {
    const positions = [
      { x: centerX, y: centerY - 80 }, { x: centerX - 60, y: centerY - 40 },
      { x: centerX + 60, y: centerY - 40 }, { x: centerX - 80, y: centerY },
      { x: centerX + 80, y: centerY }, { x: centerX - 40, y: centerY + 40 },
      { x: centerX + 40, y: centerY + 40 }
    ];

    positions.forEach((pos, index) => {
      this.time.delayedCall(index * 80, () => {
        this.starExplosionEffect(pos.x, pos.y);
      });
    });
  }

  private starExplosionEffect(x: number, y: number): void {
    const star = this.add.image(x, y, "star");
    star.setScale(0);
    star.setTint(0xFFD700);
    star.setDepth(100);
    
    this.tweens.add({
      targets: star,
      scaleX: 1.2,
      scaleY: 1.2,
      angle: 360,
      duration: 300,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.createStarParticles(x, y);
        
        this.tweens.add({
          targets: star,
          scaleX: 0,
          scaleY: 0,
          alpha: 0,
          angle: 720,
          duration: 400,
          ease: 'Power2.easeIn',
          onComplete: () => star.destroy()
        });
      }
    });

    this.tweens.add({
      targets: star,
      alpha: { from: 1, to: 0.7 },
      duration: 150,
      yoyo: true,
      repeat: 3,
      ease: 'Power2'
    });
  }

  private createStarParticles(centerX: number, centerY: number): void {
    const particleCount = 6;
    const colors = [0xFFD700, 0xFFA500, 0xFFFF00, 0xFF6347];
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const distance = 40 + Math.random() * 30;
      
      const particle = this.add.image(centerX, centerY, "star");
      particle.setScale(0.2 + Math.random() * 0.2);
      particle.setTint(colors[Math.floor(Math.random() * colors.length)]);
      particle.setDepth(99);
      
      const finalX = centerX + Math.cos(angle) * distance;
      const finalY = centerY + Math.sin(angle) * distance;
      
      this.tweens.add({
        targets: particle,
        x: finalX,
        y: finalY,
        scaleX: 0,
        scaleY: 0,
        alpha: 0,
        angle: 360 + Math.random() * 360,
        duration: 500 + Math.random() * 300,
        ease: 'Power2.easeOut',
        onComplete: () => particle.destroy()
      });
      
      this.tweens.add({
        targets: particle,
        alpha: { from: 1, to: 0 },
        duration: 600,
        delay: 150,
        ease: 'Power2.easeOut'
      });
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
