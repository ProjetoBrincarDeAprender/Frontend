import { AudioManager } from "@/games/common/managers/AudioManager";
import Button from "@/games/common/models/Button";
import { EndScene } from "@/games/common/scenes/EndScene";
import { LevelCompletedScene } from "@/games/common/scenes/LevelCompletedScene";
import { TonicStressGameData, type TonicStressLevel } from "../data/TonicStressGameData";
import { TonicStressGameService } from "../services/TonicStressGameService";

export class GameScene extends Phaser.Scene {
  private tonicStressGameService!: TonicStressGameService;
  private currentLevel: number = 0;
  private score: number = 0;
  private currentPhase: 1 | 1.5 | 2 = 1;

  private titleText!: Phaser.GameObjects.Text;
  private emojiText!: Phaser.GameObjects.Text;
  private wordText!: Phaser.GameObjects.Text;
  private syllableButtons: Button[] = [];
  private optionButtons: Button[] = [];
  private wordFrame: Phaser.GameObjects.Graphics | null = null;

  private isTransitioning: boolean = false;
  private buttonsEnabled: boolean = true;
  private currentShuffleResult: { shuffled: string[], correctIndex: number } | null = null;

  constructor() {
    super({ key: "GameScene" });
  }

  create(): void {
    const data = this.scene.settings.data as { currentLevel?: number; score?: number } || {};
    const hasRegistryData = this.registry.get("tonicStressCurrentLevel") !== undefined;
    
    if (!data.currentLevel && !hasRegistryData) {
      this.currentLevel = 0;
      this.score = 0;
      this.registry.remove("tonicStressCurrentLevel");
      this.registry.remove("tonicStressScore");
      this.registry.remove("tonicStressGameCompleted");
    } else {
      this.currentLevel = data.currentLevel !== undefined ? data.currentLevel : this.registry.get("tonicStressCurrentLevel") || 0;
      this.score = data.score !== undefined ? data.score : this.registry.get("tonicStressScore") || 0;
      this.registry.set("tonicStressCurrentLevel", this.currentLevel);
      this.registry.set("tonicStressScore", this.score);
    }

    this.tonicStressGameService = new TonicStressGameService(this);
    this.tonicStressGameService.setCurrentLevel(this.currentLevel);

    this.updateCurrentPhase();

    this.registerStandardScenes();
    this.createUI();
    this.startLevel();
  }

  preload(): void {
    const assets = {
      audio: [["correct", "correct.mp3"], ["wrong", "incorrect.mp3"]],
      svg: [["audioOn", "audioOn.svg"], ["audioOff", "audioOff.svg"], ["defaultButton", "rectangleBlueDefault.svg"], 
            ["hoverButton", "rectangleBlueHover.svg"], ["clickedButton", "rectangleBlueClicked.svg"], 
            ["squareDefaultButton", "squareBlueDefault.svg"], ["squareHoverButton", "squareBlueHover.svg"], 
            ["squareClickedButton", "squareBlueClicked.svg"], ["whiteButton", "rectangleWhiteDefault.svg"], 
            ["whiteSquareButton", "squareWhiteDefault.svg"], ["star", "star.svg"]]
    };
    
    assets.audio.forEach(([key, file]) => this.load.audio(key, `/assets/common/sounds/${file}`));
    assets.svg.forEach(([key, file]) => this.load.svg(key, `/assets/common/buttons/${file}`));
  }

  private registerStandardScenes(): void {
    const clearRegistry = () => {
      this.registry.remove("tonicStressCurrentLevel");
      this.registry.remove("tonicStressScore");
      this.registry.remove("tonicStressGameCompleted");
    };

    const sceneConfig = {
      backgroundPath: "/assets/syllableGame/bg.svg",
      backgroundKey: "tonicStressBackground"
    };

    if (!this.scene.manager.getScene("LevelCompleteScene")) {
      this.scene.add("LevelCompleteScene", new LevelCompletedScene({...sceneConfig, onMenuReturn: clearRegistry}));
    }

    if (!this.scene.manager.getScene("EndScene")) {
      this.scene.add("EndScene", new EndScene({...sceneConfig, restartScene: "StartScene", 
        subtitleMessage: "VOCÊ APRENDEU SOBRE \nCLASSIFICAÇÃO TÔNICA!", onRestart: clearRegistry}));
    }
  }

  private createUI(): void {
    const audioManager = new AudioManager(this);
    audioManager.renderMuteButton();
    this.add.rectangle(400, 300, 800, 600, 0x1a237e, 1);

    this.titleText = this.add.text(400, 80, "", {
      fontSize: "42px",
      fontFamily: "Arial",
      color: "#ffffff",
      fontStyle: "bold",
      align: "center",
      stroke: "#FFA500",
      strokeThickness: 2
    }).setOrigin(0.5);

    this.emojiText = this.add.text(400, 210, "", {
      fontSize: "80px",
      fontFamily: "Arial"
    }).setOrigin(0.5);

    this.wordText = this.add.text(400, 280, "", {
      fontSize: "44px",
      fontFamily: "Arial",
      color: "#2c3e50",
      fontStyle: "bold",
      align: "center",
    //   stroke: "#FFA500",
    //   strokeThickness: 1
    }).setOrigin(0.5);
    
    // Create twinkling stars
    this.createTwinklingStars();
  }

  private updateCurrentPhase(): void {
    const phase1Count = TonicStressGameData.getPhase1Count();
    const phase15Count = TonicStressGameData.getPhase15Count();
    
    this.currentPhase = this.currentLevel < phase1Count ? 1 : 
                       this.currentLevel < phase1Count + phase15Count ? 1.5 : 2;
  }

  private createTwinklingStars(): void {
    // Create stars near the borders
    const starPositions = [
      // Top border
      { x: 100, y: 50 }, { x: 250, y: 40 }, { x: 550, y: 35 }, { x: 700, y: 45 },
      // Right border
      { x: 750, y: 150 }, { x: 770, y: 250 }, { x: 760, y: 400 }, { x: 745, y: 500 },
      // Bottom border
      { x: 650, y: 560 }, { x: 450, y: 570 }, { x: 250, y: 565 }, { x: 100, y: 555 },
      // Left border
      { x: 30, y: 450 }, { x: 25, y: 350 }, { x: 35, y: 200 }, { x: 45, y: 100 }
    ];

    starPositions.forEach((pos, index) => {
      const star = this.add.text(pos.x, pos.y, "★", {
        fontSize: "16px",
        color: "#FFD700"
      }).setOrigin(0.5);
      star.setDepth(1);
      
      // Create twinkling animation with different delays
      this.tweens.add({
        targets: star,
        alpha: { from: 1, to: 0.3 },
        scale: { from: 1, to: 0.7 },
        duration: 1000 + (index * 100),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: index * 200
      });
    });
  }

  private startLevel(): void {
    if (this.currentLevel >= TonicStressGameData.getTotalLevels()) {
      this.endGame();
      return;
    }

    this.tonicStressGameService.startQuestion();
    this.isTransitioning = false;
    this.buttonsEnabled = true;
    this.clearUI();
    this.updateCurrentPhase();

    const showMethods = { 1: this.showPhase1Level, 1.5: this.showPhase15Level, 2: this.showPhase2Level };
    showMethods[this.currentPhase]?.call(this);
  }

  private clearUI(): void {
    [this.syllableButtons, this.optionButtons].forEach(buttons => {
      buttons.forEach(button => button.destroy());
      buttons.length = 0;
    });

    if (this.wordFrame) {
      this.wordFrame.destroy();
      this.wordFrame = null;
    }

    [this.titleText, this.emojiText, this.wordText].forEach(text => text.setText(""));
    this.emojiText.setDepth(10);
    this.wordText.setDepth(10);
    this.currentShuffleResult = null;
  }

  private showPhase1Level(): void {
    const level = TonicStressGameData.getPhase1Level(this.currentLevel);
    if (!level) return;
    this.showLevel(level, "CLIQUE NA SÍLABA TÔNICA", () => this.createSyllableButtons(level));
  }

  private showPhase15Level(): void {
    const levelIndex = this.currentLevel - TonicStressGameData.getPhase1Count();
    const level = TonicStressGameData.getPhase15Level(levelIndex);
    if (!level) return;
    this.showLevel(level, "CLIQUE NA SÍLABA TÔNICA", () => this.createShuffledSyllableButtons(level));
  }

  private showPhase2Level(): void {
    const levelIndex = this.currentLevel - TonicStressGameData.getPhase1Count() - TonicStressGameData.getPhase15Count();
    const level = TonicStressGameData.getPhase2Level(levelIndex);
    if (!level) return;
    this.titleText.setFontSize(36);
    this.showLevel(level, "QUAL A CLASSIFICAÇÃO DA PALAVRA?", () => this.createClassificationButtons(level));
  }

  private showLevel(level: TonicStressLevel, title: string, buttonCreator: () => void): void {
    this.titleText.setText(title);
    this.emojiText.setText(level.emoji);
    this.wordText.setText(level.word);
    this.createImageWordFrame();
    buttonCreator();
  }

  private createImageWordFrame(): void {
    const frameWidth = 400;
    const frameHeight = 180;
    const frameX = 400 - (frameWidth / 2);
    const frameY = 150;

    this.wordFrame = this.add.graphics();
    this.wordFrame.fillStyle(0xFFFFFF, 0.9);
    this.wordFrame.lineStyle(4, 0x1E3A8A, 1);
    this.wordFrame.fillRoundedRect(frameX, frameY, frameWidth, frameHeight, 12);
    this.wordFrame.strokeRoundedRect(frameX, frameY, frameWidth, frameHeight, 12);
    this.wordFrame.setDepth(0);
  }

  private createSyllableButtons(level: TonicStressLevel): void {
    this.createButtons(level.syllables, 32, (index) => this.handleTonicSyllableAnswer(index, level));
  }

  private createShuffledSyllableButtons(level: TonicStressLevel): void {
    if (!this.currentShuffleResult) {
      this.currentShuffleResult = TonicStressGameData.shuffleSyllables(level.syllables, level.tonicSyllableIndex);
    }
    const { shuffled, correctIndex } = this.currentShuffleResult;
    this.createButtons(shuffled, 24, (index) => this.handleShuffledSyllableAnswer(index, correctIndex, level, shuffled));
  }

  private createButtons(items: string[], fontSize: number, clickHandler: (index: number) => Promise<void>): void {
    const buttonWidth = 200;
    const buttonSpacing = 10;
    const startX = 400 - ((items.length * buttonWidth + (items.length - 1) * buttonSpacing) / 2) + (buttonWidth / 2);

    items.forEach((item, index) => {
      const button = new Button(this, startX + index * (buttonWidth + buttonSpacing), 440, 
        "squareDefaultButton", "squareHoverButton", "squareClickedButton", item, fontSize);
      button.setScale(1.5).setDepth(10);
      this.add.existing(button);
      this.syllableButtons.push(button);
      button.on("pointerdown", async () => this.buttonsEnabled && await clickHandler(index));
    });
  }

  private createClassificationButtons(level: TonicStressLevel): void {
    if (!level.options) return;
    const buttonSpacing = 250;
    const startX = 400 - ((level.options.length - 1) * buttonSpacing) / 2;
    
    level.options.forEach((option, index) => {
      const button = new Button(this, startX + index * buttonSpacing, 450, 
        "defaultButton", "hoverButton", "clickedButton", option.text, 20);
      this.add.existing(button);
      this.optionButtons.push(button);
      button.on("pointerdown", async () => this.buttonsEnabled && 
        await this.handleClassificationAnswer(option.value as string, level));
    });
  }

  private async handleTonicSyllableAnswer(selectedIndex: number, level: TonicStressLevel): Promise<void> {
    const isCorrect = this.tonicStressGameService.isCorrectTonicSyllable(selectedIndex, level.tonicSyllableIndex);
    const answerText = level.syllables[selectedIndex];
    await this.processAnswer(isCorrect, answerText, selectedIndex, level.syllables, () => this.resetSyllableButtonStates(level));
  }

  private async handleShuffledSyllableAnswer(selectedIndex: number, correctIndex: number, level: TonicStressLevel, shuffledSyllables: string[]): Promise<void> {
    const isCorrect = selectedIndex === correctIndex;
    const answerText = shuffledSyllables[selectedIndex];
    await this.processAnswer(isCorrect, answerText, selectedIndex, shuffledSyllables, () => this.resetShuffledSyllableButtonStates(level));
  }

  private async processAnswer(isCorrect: boolean, answerText: string, selectedIndex: number, items: string[], resetCallback: () => void): Promise<void> {
    if (this.isTransitioning || !this.buttonsEnabled) return;

    this.buttonsEnabled = false;
    this.isTransitioning = true;
    this.tonicStressGameService.incrementAttempts();

    try {
      const questionId = this.currentLevel + 1;
      
      if (isCorrect) {
        await this.tonicStressGameService.registerCorrectAnswer(questionId, answerText);
      } else {
        await this.tonicStressGameService.registerIncorrectAnswer(questionId, answerText);
      }
    } catch { /* Silent fail */ }

    this.updateButtonVisuals(selectedIndex, isCorrect, items);

    if (isCorrect) {
      this.sound.play("correct", { volume: 0.7 });
      const points = this.tonicStressGameService.calculateScore();
      this.score += points;
      this.tonicStressGameService.addScore(points);
      this.createStarsEffect(400, 360);
      this.time.delayedCall(2000, () => {
        this.buttonsEnabled = true;
        this.nextLevel();
      });
    } else {
      this.sound.play("wrong", { volume: 0.7 });
      this.time.delayedCall(2000, () => {
        this.buttonsEnabled = true;
        this.isTransitioning = false;
        resetCallback();
      });
    }
  }

  private async handleClassificationAnswer(selectedValue: string, level: TonicStressLevel): Promise<void> {
    const isCorrect = this.tonicStressGameService.isCorrectClassification(selectedValue, level.classification);
    
    if (this.isTransitioning || !this.buttonsEnabled) return;
    this.buttonsEnabled = false;
    this.isTransitioning = true;
    this.tonicStressGameService.incrementAttempts();

    try {
      const questionId = this.currentLevel + 1;
      
      if (isCorrect) {
        await this.tonicStressGameService.registerCorrectAnswer(questionId, selectedValue);
      } else {
        await this.tonicStressGameService.registerIncorrectAnswer(questionId, selectedValue);
      }
    } catch { /* Silent fail */ }

    this.optionButtons.forEach((button, index) => {
      button.disableInteractive();
      const option = level.options![index];
      if (option.value === selectedValue) {
        if (isCorrect) {
          button.setTint(0x00ff00);
        } else {
          const newButton = new Button(this, button.x, button.y, "whiteButton", "whiteButton", "whiteButton", option.text, 20);
          newButton.setTint(0xff0000);
          newButton.disableInteractive();
          this.add.existing(newButton);
          button.destroy();
          this.optionButtons[index] = newButton;
        }
      }
    });

    this.sound.play(isCorrect ? "correct" : "wrong", { volume: 0.7 });
    
    if (isCorrect) {
      const points = this.tonicStressGameService.calculateScore();
      this.score += points;
      this.tonicStressGameService.addScore(points);
      this.createStarsEffect(400, 420);
      this.time.delayedCall(2000, () => {
        this.buttonsEnabled = true;
        this.nextLevel();
      });
    } else {
      this.time.delayedCall(2000, () => {
        this.buttonsEnabled = true;
        this.isTransitioning = false;
        this.resetClassificationButtonStates(level);
      });
    }
  }

  private updateButtonVisuals(selectedIndex: number, isCorrect: boolean, items: string[]): void {
    this.syllableButtons.forEach((button, index) => {
      button.disableInteractive();
      if (index === selectedIndex) {
        if (isCorrect) {
          button.setTint(0x00ff00);
        } else {
          const newButton = new Button(this, button.x, button.y, "whiteSquareButton", "whiteSquareButton", "whiteSquareButton", items[index], 32);
          newButton.setScale(1.5);
          newButton.setTint(0xff0000);
          newButton.disableInteractive();
          newButton.setDepth(2);
          this.add.existing(newButton);
          button.destroy();
          this.syllableButtons[index] = newButton;
        }
      }
    });
  }

  private resetSyllableButtonStates(level: TonicStressLevel): void {
    this.resetButtons(level.syllables, 32, (index) => this.handleTonicSyllableAnswer(index, level));
  }

  private resetShuffledSyllableButtonStates(level: TonicStressLevel): void {
    if (!this.currentShuffleResult) {
      this.currentShuffleResult = TonicStressGameData.shuffleSyllables(level.syllables, level.tonicSyllableIndex);
    }
    const { shuffled, correctIndex } = this.currentShuffleResult;
    this.resetButtons(shuffled, 24, (index) => this.handleShuffledSyllableAnswer(index, correctIndex, level, shuffled));
  }

  private resetButtons(items: string[], fontSize: number, clickHandler: (index: number) => Promise<void>): void {
    const buttonWidth = 200;
    const buttonSpacing = 10;
    const startX = 400 - ((items.length * buttonWidth + (items.length - 1) * buttonSpacing) / 2) + (buttonWidth / 2);

    this.syllableButtons.forEach((button, index) => {
      const newButton = new Button(this, startX + index * (buttonWidth + buttonSpacing), 440, 
        "squareDefaultButton", "squareHoverButton", "squareClickedButton", items[index], fontSize);
      newButton.setScale(1.5);
      newButton.clearTint();
      newButton.setInteractive();
      newButton.setDepth(2);
      this.add.existing(newButton);
      button.destroy();
      this.syllableButtons[index] = newButton;
      newButton.on("pointerdown", async () => this.buttonsEnabled && await clickHandler(index));
    });
  }

  private resetClassificationButtonStates(level: TonicStressLevel): void {
    if (!level.options) return;

    const buttonSpacing = 250;
    const startX = 400 - ((level.options.length - 1) * buttonSpacing) / 2;

    this.optionButtons.forEach((button, index) => {
      const buttonX = startX + index * buttonSpacing;
      const buttonY = 450;
      const option = level.options![index];
      
      button.destroy();
      
      const newButton = new Button(this, buttonX, buttonY, "defaultButton", "hoverButton", "clickedButton", option.text, 20);
      newButton.clearTint();
      newButton.setInteractive();
      this.add.existing(newButton);
      this.optionButtons[index] = newButton;
      
      newButton.on("pointerdown", async () => {
        if (this.buttonsEnabled) {
          await this.handleClassificationAnswer(option.value as string, level);
        }
      });
    });
  }

  private nextLevel(): void {
    this.currentLevel++;
    this.tonicStressGameService.incrementLevel();
    this.registry.set("tonicStressCurrentLevel", this.currentLevel);
    this.registry.set("tonicStressScore", this.score);

    const totalLevels = TonicStressGameData.getTotalLevels();
    
    if (TonicStressGameData.shouldShowLevelComplete(this.currentLevel)) {
      this.scene.start("LevelCompleteScene", {
        currentLevel: this.currentLevel, totalLevels, score: this.score,
        gameType: "tonicStress", nextScene: "GameScene"
      });
    } else if (this.currentLevel >= totalLevels) {
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
    positions.forEach((pos, index) => this.time.delayedCall(index * 80, () => this.starExplosionEffect(pos.x, pos.y)));
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
    this.registry.set("tonicStressGameCompleted", true);
    this.scene.start("EndScene", { score: this.score, totalLevels: TonicStressGameData.getTotalLevels() });
  }
}