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
  private previousButton: Button | null = null;
  private wordFrame: Phaser.GameObjects.Graphics | null = null;
  private currentLevelType: 1 | 2 | 3 = 1;

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
    this.load.svg("squareDefaultButton", "/assets/common/buttons/squareBlueDefault.svg");
    this.load.svg("squareHoverButton", "/assets/common/buttons/squareBlueHover.svg");
    this.load.svg("squareClickedButton", "/assets/common/buttons/squareBlueClicked.svg");
    this.load.svg("whiteButton", "/assets/common/buttons/rectangleWhiteDefault.svg");
    this.load.svg("whiteSquareButton", "/assets/common/buttons/squareWhiteDefault.svg");
    this.load.svg("star", "/assets/common/buttons/star.svg");
  }

  private registerStandardScenes(): void {
    if (!this.scene.manager.getScene("LevelCompleteScene")) {
      const levelCompleteScene = new LevelCompletedScene({
        backgroundPath: "/assets/syllableGame/bg.png",
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
        backgroundPath: "/assets/syllableGame/bg.png",
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
    this.add.rectangle(400, 300, 800, 600, 0x98FB98, 0.4);

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

    this.emojiText = this.add.text(400, 235, "", {
      fontSize: "80px",
      fontFamily: "Arial"
    }).setOrigin(0.5);

    this.wordText = this.add.text(400, 295, "", {
      fontSize: "36px",
      fontFamily: "Arial",
      color: "#2c3e50",
      fontStyle: "bold",
      align: "center"
    }).setOrigin(0.5);
  }

  private startLevel(): void {
    const totalGameLevels = SyllableGameData.getLevel1Count() + SyllableGameData.getLevel2Count() + SyllableGameData.getLevel3Count();
    
    if (this.currentLevel >= totalGameLevels) {
      this.endGame();
      return;
    }

    this.syllableGameService.startQuestion();
    this.isTransitioning = false;
    this.buttonsEnabled = true;
    this.clearUI();

    // Começar direto nos níveis jogáveis (sem introdutórias)
    const adjustedLevel = this.currentLevel;
    
    if (adjustedLevel < SyllableGameData.getLevel1Count()) {
      this.showGameLevel(1);
    } else if (adjustedLevel < SyllableGameData.getLevel1Count() + SyllableGameData.getLevel2Count()) {
      this.showGameLevel(2);
    } else {
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

    if (this.previousButton) {
      this.previousButton.destroy();
      this.previousButton = null;
    }

    if (this.wordFrame) {
      this.wordFrame.destroy();
      this.wordFrame = null;
    }

    this.titleText.setText("");
    this.contentText.setText("");
    this.emojiText.setText("");
    this.wordText.setText("");
  }



  private showGameLevel(levelType: 1 | 2 | 3): void {
    this.currentLevelType = levelType;
    let level: GameLevel | null = null;

    if (levelType === 1) {
      level = SyllableGameData.getLevel1Word(this.currentLevel);
      this.titleText.setText("QUANTAS SÍLABAS TEM A PALAVRA?");
    } else if (levelType === 2) {
      const levelIndex = this.currentLevel - SyllableGameData.getLevel1Count();
      level = SyllableGameData.getLevel2Word(levelIndex);
      this.titleText.setText("QUANTAS SÍLABAS TEM A PALAVRA?");
    } else if (levelType === 3) {
      const levelIndex = this.currentLevel - SyllableGameData.getLevel1Count() - SyllableGameData.getLevel2Count();
      level = SyllableGameData.getLevel3Word(levelIndex);
      this.titleText.setText("QUAL A CLASSIFICAÇÃO DA PALAVRA?");
    }

    if (!level) return;

    // Criar quadro branco com borda azul PRIMEIRO (atrás)
    this.wordFrame = this.add.graphics();
    this.wordFrame.fillStyle(0xFFFFFF, 0.9);
    this.wordFrame.lineStyle(4, 0x1E3A8A, 1);
    this.wordFrame.fillRoundedRect(240, 190, 320, 160, 12);
    this.wordFrame.strokeRoundedRect(240, 190, 320, 160, 12);
    this.wordFrame.setDepth(0); // Quadro no fundo

    // Texto e emoji POR CIMA do quadro
    this.emojiText.setText(level.emoji);
    this.emojiText.setDepth(2); // Emoji na frente
    this.wordText.setText(level.word);
    this.wordText.setDepth(2); // Palavra na frente

    // Organizar botões em 2x2 com mais espaçamento do quadro
    const buttonPositions = [
      { x: 280, y: 420 }, // Top left
      { x: 520, y: 420 }, // Top right  
      { x: 280, y: 520 }, // Bottom left
      { x: 520, y: 520 }  // Bottom right
    ];

    level.options.forEach((option, index) => {
      const pos = buttonPositions[index];
      const fontSize = levelType === 3 ? 24 : 38;
      
      // Usar botões quadrados para níveis 1 e 2, retangulares para nível 3
      const buttonAssets = (levelType === 1 || levelType === 2) ? {
        default: "squareDefaultButton",
        hover: "squareHoverButton", 
        clicked: "squareClickedButton"
      } : {
        default: "defaultButton",
        hover: "hoverButton",
        clicked: "clickedButton"
      };
      
      const button = new Button(this, pos.x, pos.y, buttonAssets.default, buttonAssets.hover, buttonAssets.clicked, option.text, fontSize);
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
        if (isCorrect) {
          button.setTint(0x00ff00);
        } else {
          // For incorrect answers, recreate button with white texture and red tint
          const buttonX = button.x;
          const buttonY = button.y;
          const buttonText = option.text;
          const fontSize = this.currentLevelType === 3 ? 24 : 38;
          
          // Destroy old button
          button.destroy();
          
          // Create new white button with red tint
          const isSquareButton = this.currentLevelType === 1 || this.currentLevelType === 2;
          const whiteButtonKey = isSquareButton ? "whiteSquareButton" : "whiteButton";
          const newButton = new Button(this, buttonX, buttonY, whiteButtonKey, whiteButtonKey, whiteButtonKey, buttonText, fontSize);
          newButton.setTint(0xff0000);
          newButton.disableInteractive();
          this.add.existing(newButton);
          this.optionButtons[index] = newButton;
        }
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
    // Get current level data to recreate buttons properly
    let level: GameLevel | null = null;
    
    if (this.currentLevelType === 1) {
      level = SyllableGameData.getLevel1Word(this.currentLevel);
    } else if (this.currentLevelType === 2) {
      const levelIndex = this.currentLevel - SyllableGameData.getLevel1Count();
      level = SyllableGameData.getLevel2Word(levelIndex);
    } else if (this.currentLevelType === 3) {
      const levelIndex = this.currentLevel - SyllableGameData.getLevel1Count() - SyllableGameData.getLevel2Count();
      level = SyllableGameData.getLevel3Word(levelIndex);
    }
    
    if (!level) return;
    
    // Recreate all buttons with original textures
    this.optionButtons.forEach((button, index) => {
      const buttonX = button.x;
      const buttonY = button.y;
      const option = level!.options[index];
      const fontSize = this.currentLevelType === 3 ? 24 : 38;
      
      // Destroy current button
      button.destroy();
      
      // Recreate with original blue texture
      const buttonAssets = (this.currentLevelType === 1 || this.currentLevelType === 2) ? {
        default: "squareDefaultButton",
        hover: "squareHoverButton", 
        clicked: "squareClickedButton"
      } : {
        default: "defaultButton",
        hover: "hoverButton",
        clicked: "clickedButton"
      };
      
      const newButton = new Button(this, buttonX, buttonY, buttonAssets.default, buttonAssets.hover, buttonAssets.clicked, option.text, fontSize);
      newButton.clearTint();
      newButton.setInteractive();
      this.add.existing(newButton);
      this.optionButtons[index] = newButton;
      
      // Re-add click handler
      newButton.on("pointerdown", async () => {
        if (this.buttonsEnabled) {
          await this.handleAnswer(option.value, level!);
        }
      });
    });
  }

  private nextLevel(): void {
    this.currentLevel++;
    this.syllableGameService.incrementLevel();
    this.registry.set("syllableCurrentLevel", this.currentLevel);
    this.registry.set("syllableScore", this.score);

    const totalGameLevels = SyllableGameData.getLevel1Count() + SyllableGameData.getLevel2Count() + SyllableGameData.getLevel3Count();
    
    // Mostrar tela de nível completo após cada fase
    if (this.currentLevel === SyllableGameData.getLevel1Count() || 
        this.currentLevel === SyllableGameData.getLevel1Count() + SyllableGameData.getLevel2Count()) {
      this.scene.start("LevelCompleteScene", {
        currentLevel: this.currentLevel,
        totalLevels: totalGameLevels,
        score: this.score,
        gameType: "syllable",
        nextScene: "GameScene",
      });
    } else if (this.currentLevel >= totalGameLevels) {
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
    
    const totalGameLevels = SyllableGameData.getLevel1Count() + SyllableGameData.getLevel2Count() + SyllableGameData.getLevel3Count();
    
    this.scene.start("EndScene", {
      score: this.score,
      totalLevels: totalGameLevels
    });
  }
}