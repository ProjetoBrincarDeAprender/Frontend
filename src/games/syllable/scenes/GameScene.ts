import { AudioManager } from "@/games/common/managers/AudioManager";
import Button from "@/games/common/models/Button";
import { EndScene } from "@/games/common/scenes/EndScene";
import { LevelCompletedScene } from "@/games/common/scenes/LevelCompletedScene";
import { SyllableGameData, type GameLevel } from "../data/SyllableGameData";
import { SyllableGameService } from "../services/SyllableGameService";

export class GameScene extends Phaser.Scene {
  private syllableGameService!: SyllableGameService;
  private currentLevel: number = 0;
  private score: number = 0;

  private titleText!: Phaser.GameObjects.Text;
  private contentText!: Phaser.GameObjects.Text;
  private wordText!: Phaser.GameObjects.Text;
  private emojiText!: Phaser.GameObjects.Text;
  private optionButtons: Button[] = [];
  private continueButton: Button | null = null;

  private isTransitioning: boolean = false;
  private buttonsEnabled: boolean = true;

  constructor() {
    super({ key: "GameScene" });
  }

  create(): void {
    const data = this.scene.settings.data as { currentLevel?: number; score?: number } || {};
    const hasRegistryData = this.registry.get("syllableCurrentLevel") !== undefined;
    
    if (!data.currentLevel && !hasRegistryData) {
      this.currentLevel = 0;
      this.score = 0;
      this.registry.remove("syllableCurrentLevel");
      this.registry.remove("syllableScore");
      this.registry.remove("syllableGameCompleted");
    } else {
      this.currentLevel = data.currentLevel !== undefined ? data.currentLevel : this.registry.get("syllableCurrentLevel") || 0;
      this.score = data.score !== undefined ? data.score : this.registry.get("syllableScore") || 0;
      this.registry.set("syllableCurrentLevel", this.currentLevel);
      this.registry.set("syllableScore", this.score);
    }

    this.syllableGameService = new SyllableGameService(this);
    this.syllableGameService.setCurrentLevel(this.currentLevel);

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
        backgroundPath: "/assets/syllableGame/bg.svg",
        backgroundKey: "syllableBackground",
        onMenuReturn: () => {
          this.registry.remove("syllableCurrentLevel");
          this.registry.remove("syllableScore");
          this.registry.remove("syllableGameCompleted");
        }
      });
      this.scene.add("LevelCompleteScene", levelCompleteScene);
    }

    if (!this.scene.manager.getScene("EndScene")) {
      const syllableEndScene = new EndScene({
        restartScene: "StartScene",
        backgroundPath: "/assets/syllableGame/bg.svg",
        backgroundKey: "syllableBackground",
        subtitleMessage: "VOCÊ APRENDEU SOBRE \nCLASSIFICAÇÃO SILÁBICA!",
        onRestart: () => {
          this.registry.remove("syllableCurrentLevel");
          this.registry.remove("syllableScore");
          this.registry.remove("syllableGameCompleted");
        }
      });
      this.scene.add("EndScene", syllableEndScene);
    }
  }

  private createUI(): void {
    const audioManager = new AudioManager(this);
    audioManager.renderMuteButton();
    this.add.rectangle(400, 300, 800, 600, 0x87CEEB, 0.3);

    this.titleText = this.add.text(400, 120, "", {
      fontSize: "36px",
      fontFamily: "Arial",
      color: "#2c3e50",
      fontStyle: "bold",
      align: "center"
    }).setOrigin(0.5);

    this.contentText = this.add.text(400, 200, "", {
      fontSize: "24px",
      fontFamily: "Arial",
      color: "#2c3e50",
      align: "center",
      wordWrap: { width: 700 }
    }).setOrigin(0.5);

    this.emojiText = this.add.text(400, 280, "", {
      fontSize: "80px",
      fontFamily: "Arial"
    }).setOrigin(0.5);

    this.wordText = this.add.text(400, 350, "", {
      fontSize: "32px",
      fontFamily: "Arial",
      color: "#2c3e50",
      fontStyle: "bold",
      align: "center"
    }).setOrigin(0.5);
  }

  private startLevel(): void {
    if (this.currentLevel >= SyllableGameData.getTotalLevels()) {
      this.endGame();
      return;
    }

    this.syllableGameService.startQuestion();
    this.isTransitioning = false;
    this.buttonsEnabled = true;
    this.clearUI();

    if (SyllableGameData.isIntroductoryPhase(this.currentLevel)) {
      this.showIntroductoryLevel();
    } else if (SyllableGameData.isLevel1Phase(this.currentLevel)) {
      this.showGameLevel(1);
    } else if (SyllableGameData.isLevel2Phase(this.currentLevel)) {
      this.showGameLevel(2);
    } else if (SyllableGameData.isLevel3Phase(this.currentLevel)) {
      this.showGameLevel(3);
    }
  }

  private clearUI(): void {
    this.optionButtons.forEach(button => button.destroy());
    this.optionButtons = [];

    if (this.continueButton) {
      this.continueButton.destroy();
      this.continueButton = null;
    }

    this.titleText.setText("");
    this.contentText.setText("");
    this.emojiText.setText("");
    this.wordText.setText("");
  }

  private showIntroductoryLevel(): void {
    const level = SyllableGameData.getIntroductoryLevel(this.currentLevel);
    if (!level) return;

    this.titleText.setText(level.title);
    this.contentText.setText(level.content);

    if (level.example) {
      this.emojiText.setText(level.example.emoji);
      this.wordText.setText(level.example.word);
    }

    this.continueButton = new Button(this, 400, 500, "defaultButton", "hoverButton", "clickedButton", "CONTINUAR", 28);
    this.add.existing(this.continueButton);

    this.continueButton.on("pointerdown", () => {
      if (this.buttonsEnabled) {
        this.nextLevel();
      }
    });
  }

  private showGameLevel(levelType: 1 | 2 | 3): void {
    let level: GameLevel | null = null;
    let levelIndex: number = 0;

    if (levelType === 1) {
      levelIndex = this.currentLevel - SyllableGameData.getIntroductoryCount();
      level = SyllableGameData.getLevel1Word(levelIndex);
      this.titleText.setText("QUANTAS SÍLABAS TEM A PALAVRA?");
    } else if (levelType === 2) {
      levelIndex = this.currentLevel - SyllableGameData.getIntroductoryCount() - SyllableGameData.getLevel1Count();
      level = SyllableGameData.getLevel2Word(levelIndex);
      this.titleText.setText("QUANTAS SÍLABAS TEM A PALAVRA?");
    } else if (levelType === 3) {
      levelIndex = this.currentLevel - SyllableGameData.getIntroductoryCount() - SyllableGameData.getLevel1Count() - SyllableGameData.getLevel2Count();
      level = SyllableGameData.getLevel3Word(levelIndex);
      this.titleText.setText("QUAL A CLASSIFICAÇÃO DA PALAVRA?");
    }

    if (!level) return;

    this.emojiText.setText(level.emoji);
    this.wordText.setText(level.word);

    const buttonY = 450;
    const buttonSpacing = levelType === 3 ? 180 : 150;
    const startX = levelType === 3 ? 400 - (buttonSpacing * 1.5) : 400 - (buttonSpacing * 1.5);

    level.options.forEach((option, index) => {
      const x = startX + (index * buttonSpacing);
      const fontSize = levelType === 3 ? 20 : 24;
      const button = new Button(this, x, buttonY, "defaultButton", "hoverButton", "clickedButton", option.text, fontSize);
      this.add.existing(button);
      this.optionButtons.push(button);

      button.on("pointerdown", async () => {
        if (this.buttonsEnabled) {
          await this.handleAnswer(option.value, level!);
        }
      });
    });
  }

  private async handleAnswer(selectedValue: number | string, level: GameLevel): Promise<void> {
    if (this.isTransitioning || !this.buttonsEnabled) return;

    this.buttonsEnabled = false;
    this.isTransitioning = true;

    const isCorrect = this.syllableGameService.isCorrectAnswer(selectedValue, level);
    this.syllableGameService.incrementAttempts();

    try {
      const studentId = this.syllableGameService.getStudentId();
      const questionId = this.currentLevel + 1;
      const answerText = String(selectedValue);

      if (isCorrect) {
        await this.syllableGameService.registerCorrectAnswer(studentId, questionId, answerText);
      } else {
        await this.syllableGameService.registerIncorrectAnswer(studentId, questionId, answerText);
      }
    } catch (_error) {
      // Silent fail for API errors
    }

    this.optionButtons.forEach((button, index) => {
      button.disableInteractive();
      
      const option = level.options[index];
      if (option.value === selectedValue) {
        button.setTint(isCorrect ? 0x00ff00 : 0xff0000);
      }
      
      if (isCorrect && option.isCorrect) {
        button.setTint(0x00ff00);
      }
    });

    if (isCorrect) {
      this.sound.play("correct", { volume: 0.7 });
      const points = this.syllableGameService.calculateScore();
      this.score += points;
      this.syllableGameService.addScore(points);
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
        this.resetButtonStates();
      });
    }
  }

  private resetButtonStates(): void {
    this.optionButtons.forEach(button => {
      button.clearTint();
      button.setInteractive();
    });
  }

  private nextLevel(): void {
    this.currentLevel++;
    this.syllableGameService.incrementLevel();
    this.registry.set("syllableCurrentLevel", this.currentLevel);
    this.registry.set("syllableScore", this.score);

    if (SyllableGameData.shouldShowLevelComplete(this.currentLevel)) {
      this.scene.start("LevelCompleteScene", {
        currentLevel: this.currentLevel,
        totalLevels: SyllableGameData.getTotalLevels(),
        score: this.score,
        gameType: "syllable",
        nextScene: "GameScene",
      });
    } else if (this.currentLevel >= SyllableGameData.getTotalLevels()) {
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
        this.tweens.add({
          targets: star,
          alpha: 0,
          scaleX: 0.5,
          scaleY: 0.5,
          duration: 200,
          ease: 'Power2',
          onComplete: () => {
            star.destroy();
          }
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

  private endGame(): void {
    this.registry.set("syllableGameCompleted", true);
    
    this.scene.start("EndScene", {
      score: this.score,
      totalLevels: SyllableGameData.getTotalLevels()
    });
  }
}