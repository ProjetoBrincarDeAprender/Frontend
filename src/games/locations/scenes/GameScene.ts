import { AudioManager } from "@/games/common/managers/AudioManager";
import Button from "@/games/common/models/Button";
import { EndScene } from "@/games/common/scenes/EndScene";
import { LevelCompletedScene } from "@/games/common/scenes/LevelCompletedScene";
import Phaser from "phaser";
import type { LocationLevel } from "../data/LocationsGameData";
import { LocationsGameData } from "../data/LocationsGameData";
import { LocationsGameService } from "../services/LocationsGameService";

export class GameScene extends Phaser.Scene {
  private locationsGameService!: LocationsGameService;
  private currentLevel: number = 0;
  private score: number = 0;

  private questionText!: Phaser.GameObjects.Text;
  private locationImage!: Phaser.GameObjects.Image;
  private optionButtons: Button[] = [];
  private nextButton: Phaser.GameObjects.Container | null = null;
  
  private dudaPositionImage: Phaser.GameObjects.Image | null = null;
  private catPositionImage: Phaser.GameObjects.Image | null = null;

  private isTransitioning: boolean = false;
  private buttonsEnabled: boolean = true;
  private answerRevealText: Phaser.GameObjects.Text | null = null;
  private greenAnswerText: Phaser.GameObjects.Text | null = null;

  constructor() {
    super({ key: "GameScene" });
  }

  init(data?: { currentLevel?: number; score?: number }) {
    new AudioManager(this, 0.7);


    const shouldRestart = this.registry.get("locationsRestart");
    
    if (shouldRestart || !data || (data.currentLevel === 0 && data.score === 0)) {

      this.currentLevel = 0;
      this.score = 0;
      this.registry.remove("locationsCurrentLevel");
      this.registry.remove("locationsScore");
      this.registry.remove("locationsGameCompleted");
      this.registry.remove("locationsRestart");
    } else {

      const registryLevel = this.registry.get("locationsCurrentLevel") || 0;
      const registryScore = this.registry.get("locationsScore") || 0;

      this.currentLevel =
        data?.currentLevel !== undefined ? data.currentLevel : registryLevel;
      this.score = data?.score !== undefined ? data.score : registryScore;


      this.registry.set("locationsCurrentLevel", this.currentLevel);
      this.registry.set("locationsScore", this.score);
    }

    this.locationsGameService = new LocationsGameService();
    this.locationsGameService.setCurrentLevel(this.currentLevel);
    this.optionButtons = [];
    this.isTransitioning = false;
  }

  preload() {

    this.load.audio("correct", "/assets/common/sounds/correct.mp3");
    this.load.audio("wrong", "/assets/common/sounds/incorrect.mp3");
    

    this.load.svg("audioOn", "/assets/common/buttons/audioOn.svg");
    this.load.svg("audioOff", "/assets/common/buttons/audioOff.svg");


    this.load.svg("defaultButton", "/assets/common/buttons/rectangleBlueDefault.svg");
    this.load.svg("hoverButton", "/assets/common/buttons/rectangleBlueHover.svg");
    this.load.svg("clickedButton", "/assets/common/buttons/rectangleBlueClicked.svg");

    this.load.svg("acima", "/assets/locations/acima.svg");
    this.load.svg("abaixo", "/assets/locations/abaixo.svg");
    this.load.svg("dentro", "/assets/locations/dentro.svg");
    this.load.svg("frente", "/assets/locations/frente.svg");
    this.load.svg("lado", "/assets/locations/lado.svg");


    this.load.image("duda", "/assets/common/duda/girlmainpage.svg");
    this.load.image("duda-lado", "/assets/locations/duda-lado.svg");
    this.load.svg("gato", "/assets/vowelsGame/images/animals/gato.svg");
    this.load.image("gato-locations", "/assets/locations/gato.svg");
  }

  create() {
    this.cameras.main.setBackgroundColor("#e6f7ff");

    this.registerStandardScenes();
    this.createUI();
    this.startLevel();
  }

  private registerStandardScenes(): void {
    if (!this.scene.manager.getScene("LevelCompleteScene")) {
      try {
        const locationsLevelComplete = new LevelCompletedScene({
          nextLevelScene: "GameScene",
          menuScene: "StartScene",
          backgroundPath: "/assets/locations/frente.svg",
          backgroundKey: "locationsBackground",
          onMenuReturn: () => {
            this.registry.remove("locationsCurrentLevel");
            this.registry.remove("locationsScore");
            this.registry.remove("locationsGameCompleted");
            this.registry.set("locationsRestart", true);
          },
        });
        this.scene.add("LevelCompleteScene", locationsLevelComplete);
      } catch (error) {
        console.warn("LevelCompleteScene já existe ou erro ao adicionar:", error);
      }
    }

    if (!this.scene.manager.getScene("EndScene")) {
      try {
        const locationsEndScene = new EndScene({
          restartScene: "StartScene",
          backgroundPath: "/assets/locations/frente.svg",
          backgroundKey: "locationsBackground",
          subtitleMessage: "VOCÊ APRENDEU SOBRE \nLOCALIZAÇÃO ESPACIAL!",
          onRestart: () => {
            this.registry.remove("locationsCurrentLevel");
            this.registry.remove("locationsScore");
            this.registry.remove("locationsGameCompleted");
            this.registry.set("locationsRestart", true);
          },
        });
        this.scene.add("EndScene", locationsEndScene);
      } catch (error) {
        console.warn("EndScene já existe ou erro ao adicionar:", error);
      }
    }
  }

  private createUI(): void {

    this.questionText = this.add
      .text(this.cameras.main.centerX, 100, "", {
        fontSize: "36px",
        color: "#2c3e50",
        fontFamily: "Arial",
        wordWrap: { width: 800 },
        align: "center",
      })
      .setOrigin(0.5);

    this.createNextButton();
  }

  private startLevel(): void {
    const levelData = LocationsGameData.getLevel(this.currentLevel);
    if (!levelData) {
      this.endGame();
      return;
    }

    this.isTransitioning = false;
    this.buttonsEnabled = true;
    this.clearOptionButtons();
    this.clearPositionElements();

    if (this.answerRevealText) {
      (this.answerRevealText as Phaser.GameObjects.Text).destroy();
      this.answerRevealText = null;
    }
    
    if (this.greenAnswerText) {
      this.greenAnswerText.destroy();
      this.greenAnswerText = null;
    }

    this.questionText.setText(levelData.question).setVisible(true);
    
    if (levelData.type === 'selection') {
      if (this.locationImage && this.locationImage.scene) {
        this.locationImage.destroy();
      }
      this.locationImage = this.add
        .image(this.cameras.main.centerX, 310, levelData.locationType!)
        .setOrigin(0.5)
        .setScale(0.4)
        .setVisible(true);
    } else if (levelData.type === 'positioning') {
      if (this.locationImage) {
        this.locationImage.destroy();

        // @ts-expect-error limpar referência
        this.locationImage = undefined;
      }
      this.createPositionElements(levelData);
    }

    this.createOptionButtons(levelData);

    if (this.nextButton) {
      this.nextButton.setVisible(false);
    }
  }

  private createOptionButtons(level: LocationLevel): void {
    const startY = 500;
    const centerX = this.cameras.main.centerX;

    if (level.type === 'positioning') {
      const spacing = 180;
      
      level.options.forEach((option, index) => {
        const x = centerX + (index === 0 ? -spacing/2 : spacing/2);
        const button = new Button(
          this,
          x,
          startY,
          "defaultButton",
          "hoverButton", 
          "clickedButton",
          option.text,
          24
        );

        button.setScale(0.8);
        this.add.existing(button);

        button.on("pointerdown", () => {
          if (this.buttonsEnabled) {
            this.handleOptionClick(index, level);
          }
        });

        this.optionButtons.push(button);
      });
    } else {
      const spacing = 200;
      
      level.options.forEach((option, index) => {
        const x = centerX + (index - 1) * spacing;
        const button = new Button(
          this,
          x,
          startY,
          "defaultButton",
          "hoverButton", 
          "clickedButton",
          option.text,
          24
        );

        button.setScale(0.8);
        this.add.existing(button);

        button.on("pointerdown", () => {
          if (this.buttonsEnabled) {
            this.handleOptionClick(index, level);
          }
        });

        this.optionButtons.push(button);
      });
    }
  }



  private handleOptionClick(selectedIndex: number, level: LocationLevel): void {
    if (this.isTransitioning || !this.buttonsEnabled) return;

    this.buttonsEnabled = false;
    this.isTransitioning = true;

    const isCorrect = this.locationsGameService.isCorrectAnswer(selectedIndex, level);

    this.optionButtons.forEach((button, index) => {
      button.disableInteractive();
      
      if (index === selectedIndex) {
        button.setTint(isCorrect ? 0x00ff00 : 0xff0000);
      }
    });

    if (isCorrect) {
      this.sound.play("correct", { volume: 0.7 });
      const points = this.locationsGameService.calculateScore(level);
      this.score += points;
      this.locationsGameService.addScore(points);

      if (level.type === 'selection') {
        this.questionText.setVisible(false);
        this.showAnswerReveal(level);
      }
      
      this.time.delayedCall(3000, () => {
        this.buttonsEnabled = true;
        this.nextLevel();
      });
    } else {
      this.sound.play("wrong", { volume: 0.7 });
      
      this.time.delayedCall(3000, () => {
        this.buttonsEnabled = true;
        this.isTransitioning = false;
        this.resetButtonStates();
      });
    }
  }

  private showAnswerReveal(level: LocationLevel): void {
    if (level.type !== 'selection') return;

    const correctOption = level.options[level.correctAnswer]?.text || "";
    const fullText = level.question.replace("___", correctOption);

    if (this.answerRevealText) {
      this.answerRevealText.destroy();
      this.answerRevealText = null;
    }

    this.answerRevealText = this.add
      .text(this.cameras.main.centerX, 100, fullText, {
        fontSize: "36px",
        color: "#2c3e50",
        fontFamily: "Arial",
        align: "center",
        wordWrap: { width: 800 },
      })
      .setOrigin(0.5);

    const before = level.question.split("___")[0] || "";
    const baseX = this.cameras.main.centerX;
    const baseY = 100;

    const tempBefore = this.add.text(0, 0, before, { fontSize: "36px", fontFamily: "Arial" }).setVisible(false);
    const tempCorrect = this.add.text(0, 0, correctOption, { fontSize: "36px", fontFamily: "Arial" }).setVisible(false);
    const beforeWidth = tempBefore.width;
    const correctWidth = tempCorrect.width;
    tempBefore.destroy();
    tempCorrect.destroy();

    const fullTemp = this.add.text(0, 0, fullText, { fontSize: "36px", fontFamily: "Arial" }).setVisible(false);
    const totalWidth = fullTemp.width;
    fullTemp.destroy();

    const startX = baseX - totalWidth / 2;
    const correctX = startX + beforeWidth + correctWidth / 2;

    this.greenAnswerText = this.add
      .text(correctX, baseY, correctOption, {
        fontSize: "36px",
        color: "#16a34a",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);
  }

  private nextLevel(): void {
    this.currentLevel++;
    this.locationsGameService.incrementLevel();

    this.registry.set("locationsCurrentLevel", this.currentLevel);
    this.registry.set("locationsScore", this.score);

    const total = LocationsGameData.getTotalLevels();
    if (this.currentLevel >= total) {
      this.endGame();
    } else if (this.currentLevel === 5) {
      this.scene.start("LevelCompleteScene", {
        currentLevel: this.currentLevel,
        totalLevels: total,
        score: this.score,
        gameType: "locations",
        nextScene: "GameScene",
      });
    } else {
      this.startLevel();
    }
  }

  private endGame(): void {

    this.registry.set("locationsGameCompleted", true);
    
    this.scene.start("EndScene", {
      score: this.score,
      totalLevels: LocationsGameData.getTotalLevels(),
      gameType: "locations",
    });
  }

  private clearOptionButtons(): void {
    this.optionButtons.forEach((button) => button.destroy());
    this.optionButtons = [];
  }

  private resetButtonStates(): void {
    this.optionButtons.forEach((button) => {
      button.clearTint();
      button.setInteractive();
    });
  }

  private clearPositionElements(): void {
    if (this.dudaPositionImage) {
      this.dudaPositionImage.destroy();
      this.dudaPositionImage = null;
    }
    if (this.catPositionImage) {
      this.catPositionImage.destroy();
      this.catPositionImage = null;
    }
  }

  private createPositionElements(level: LocationLevel): void {
    const centerX = this.cameras.main.centerX;
    const centerY = 300;


    const dudaKey = (level.id === 8 || level.id === 9) ? "duda-lado" : "duda";
    

    this.dudaPositionImage = this.add
      .image(centerX, centerY, dudaKey)
      .setScale(0.3)
      .setOrigin(0.5);


    const gatoKey = "gato-locations";


    let catX = centerX;
    const catY = centerY;
    
    if (level.catPosition === 'left') {
      catX = centerX - 150;
    } else if (level.catPosition === 'right') {
      catX = centerX + 150;
    } else if (level.catPosition === 'front') {
      catX = centerX - 170;
    } else if (level.catPosition === 'back') {
      catX = centerX + 170;
    }

    this.catPositionImage = this.add
      .image(catX, catY, gatoKey)
      .setScale(0.3)
      .setOrigin(0.5);
  }

  private createNextButton(): void {
    this.nextButton = this.add.container(
      this.cameras.main.centerX,
      this.cameras.main.height - 100
    );

    const background = this.add
      .rectangle(0, 0, 150, 50, 0x27ae60);

    const text = this.add
      .text(0, 0, "PRÓXIMO", {
        fontSize: "20px",
        color: "#ffffff",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    this.nextButton.add([background, text]);
    this.nextButton.setSize(150, 50);
    this.nextButton.setInteractive();
    this.nextButton.setVisible(false);

    this.nextButton.on("pointerdown", () => {

      this.nextLevel();
    });
  }
}
