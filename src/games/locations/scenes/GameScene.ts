import { AudioManager } from "@/games/common/managers/AudioManager";
import EffectManager from "@/games/common/managers/EffectManager";
import Button from "@/games/common/models/Button";
import { AnimationManager } from "@/games/sum/components/animations/AnimationManager";
import Phaser from "phaser";
import type { LocationLevel } from "../data/LocationsGameData";
import { LocationsGameData } from "../data/LocationsGameData";
import { LocationsGameService } from "../services/LocationsGameService";

export class GameScene extends Phaser.Scene {
  private _animationsManager!: AnimationManager;
  private _effectManager!: EffectManager;
  private locationsGameService!: LocationsGameService;
  private currentLevel: number = 0;
  private score: number = 0;

  private questionText!: Phaser.GameObjects.Text;
  private locationImage!: Phaser.GameObjects.Image;
  private optionButtons: Button[] = [];
  private nextButton: Phaser.GameObjects.Container | null = null;
  private _dudaImage: Phaser.GameObjects.Image | null = null;
  
  // Elementos para níveis de posicionamento
  private dudaPositionImage: Phaser.GameObjects.Image | null = null;
  private catPositionImage: Phaser.GameObjects.Image | null = null;

  private isTransitioning: boolean = false;
  private buttonsEnabled: boolean = true;

  constructor() {
    super({ key: "GameScene" });
  }

  init(data?: { currentLevel?: number; score?: number }) {
    new AudioManager(this, 0.7);

    if (
      !data ||
      (data.currentLevel === undefined && data.score === undefined)
    ) {
      this.currentLevel = 0;
      this.score = 0;
      this.registry.remove("locationsCurrentLevel");
      this.registry.remove("locationsScore");
    } else {
      this.currentLevel = data.currentLevel ?? 0;
      this.score = data.score ?? 0;
      this.registry.set("locationsCurrentLevel", this.currentLevel);
      this.registry.set("locationsScore", this.score);
    }

    this.locationsGameService = new LocationsGameService();
    this.locationsGameService.setCurrentLevel(this.currentLevel);
    this.optionButtons = [];
    this.isTransitioning = false;
  }

  preload() {
    // Carregar assets de áudio
    this.load.audio("audioOn", "/assets/common/sounds/audioOn.mp3");
    this.load.audio("audioOff", "/assets/common/sounds/audioOff.mp3");
    this.load.audio("correct", "/assets/common/sounds/correct.mp3");
    this.load.audio("wrong", "/assets/common/sounds/incorrect.mp3");
    // this.load.audio("click", "/assets/common/sounds/click.mp3");

    // Carregar imagens de áudio
    this.load.svg("audioOn", "/assets/common/buttons/audioOn.svg");
    this.load.svg("audioOff", "/assets/common/buttons/audioOff.svg");

    // Carregar botões do common
    this.load.svg("defaultButton", "/assets/common/buttons/rectangleBlueDefault.svg");
    this.load.svg("hoverButton", "/assets/common/buttons/rectangleBlueHover.svg");
    this.load.svg("clickedButton", "/assets/common/buttons/rectangleBlueClicked.svg");

    // Carregar imagens das localizações
    this.load.svg("acima", "/assets/locations/acima.svg");
    this.load.svg("abaixo", "/assets/locations/abaixo.svg");
    this.load.svg("dentro", "/assets/locations/dentro.svg");
    this.load.svg("frente", "/assets/locations/frente.svg");
    this.load.svg("lado", "/assets/locations/lado.svg");

    // Carregar elementos comuns
    this.load.svg("duda", "/assets/common/duda/duda.svg");
    
    // Carregar imagem do gato para os níveis de posicionamento
    this.load.svg("gato", "/assets/vowelsGame/images/animals/gato.svg");
  }

  create() {
    this.cameras.main.setBackgroundColor("#87CEEB");

    this._animationsManager = new AnimationManager(this);
    this._effectManager = new EffectManager(this);

    this.createUI();
    this.startLevel();
  }

  private createUI(): void {
    // Título do jogo
    // const titleText = this.add
    //   .text(this.cameras.main.centerX, 80, "JOGO DAS LOCALIZAÇÕES", {
    //     fontSize: "48px",
    //     color: "#2c3e50",
    //     fontFamily: "Arial Black",
    //   })
    //   .setOrigin(0.5);

    // titleText.setStroke("#ffffff", 6);
    // titleText.setShadow(2, 2, "#000000", 2, true, true);

    // Duda
    // this._dudaImage = this.add
    //   .image(150, this.cameras.main.centerY, "duda")
    //   .setScale(0.4)
    //   .setOrigin(0.5);

    // Pergunta
    this.questionText = this.add
      .text(this.cameras.main.centerX, 100, "", {
        fontSize: "36px",
        color: "#2c3e50",
        fontFamily: "Arial Black, Arial",
        wordWrap: { width: 800 },
        align: "center",
      })
      .setOrigin(0.5);

    // Container para imagem da localização
    this.locationImage = this.add
      .image(this.cameras.main.centerX, 350, "")
      .setScale(0.3)
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

    this.questionText.setText(levelData.question);
    
    if (levelData.type === 'selection') {
      // Níveis com imagem única (1-5)
      const imageName = levelData.image?.split('/').pop()?.replace('.svg', '') || '';
      this.locationImage.setTexture(imageName);
      this.locationImage.setVisible(true);
    } else if (levelData.type === 'positioning') {
      // Níveis com Duda e gato (6-10)
      this.locationImage.setVisible(false);
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
      // Para níveis de posicionamento, criar apenas 2 botões (ESQUERDA e DIREITA)
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
      // Para níveis de seleção, criar 3 botões como antes
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

    // Desabilitar botões por 2 segundos
    this.buttonsEnabled = false;
    this.isTransitioning = true;

    const isCorrect = this.locationsGameService.isCorrectAnswer(selectedIndex, level);

    // Aplicar feedback visual nos botões
    this.optionButtons.forEach((button, index) => {
      button.disableInteractive();
      
      if (index === selectedIndex) {
        button.setTint(isCorrect ? 0x00ff00 : 0xff0000);
      } else if (index === level.correctAnswer) {
        button.setTint(0x00ff00);
      } else {
        button.setAlpha(0.5);
      }
    });

    if (isCorrect) {
      this.sound.play("correct", { volume: 0.7 });
      const points = this.locationsGameService.calculateScore(level);
      this.score += points;
      this.locationsGameService.addScore(points);
    } else {
      this.sound.play("wrong", { volume: 0.7 });
    }

    // Reabilitar botões e ir para próximo nível após 2 segundos
    this.time.delayedCall(2000, () => {
      this.buttonsEnabled = true;
      this.nextLevel();
    });
  }

  private nextLevel(): void {
    this.currentLevel++;
    this.locationsGameService.incrementLevel();

    this.registry.set("locationsCurrentLevel", this.currentLevel);
    this.registry.set("locationsScore", this.score);

    if (this.currentLevel >= LocationsGameData.getTotalLevels()) {
      this.endGame();
    } else if (this.currentLevel === 5) {
      // Mostrar cena de nível completado apenas após os primeiros 5 níveis
      this.scene.start("LevelCompletedScene", {
        currentLevel: this.currentLevel,
        totalLevels: LocationsGameData.getTotalLevels(),
        score: this.score,
        nextScene: "GameScene",
        gameType: "locations",
      });
    } else {
      // Para outros níveis, continuar diretamente
      this.startLevel();
    }
  }

  private endGame(): void {
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

    // Criar Duda sempre no centro
    this.dudaPositionImage = this.add
      .image(centerX, centerY, "duda")
      .setScale(0.4)
      .setOrigin(0.5);

    // Criar gato à esquerda ou direita baseado na configuração do nível
    let catX = centerX;
    if (level.catPosition === 'left') {
      catX = centerX - 150;
    } else if (level.catPosition === 'right') {
      catX = centerX + 150;
    }

    this.catPositionImage = this.add
      .image(catX, centerY, "gato")
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
        fontFamily: "Arial Black",
      })
      .setOrigin(0.5);

    this.nextButton.add([background, text]);
    this.nextButton.setSize(150, 50);
    this.nextButton.setInteractive();
    this.nextButton.setVisible(false);

    this.nextButton.on("pointerdown", () => {
    //   this.sound.play("click", { volume: 0.5 });
      this.nextLevel();
    });
  }
}
