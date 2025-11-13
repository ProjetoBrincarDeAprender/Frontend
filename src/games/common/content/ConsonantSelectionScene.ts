import Phaser from "phaser";
import ButtonManager from "@/games/clickedButton/logic/ButtonManager";
import { SyllableGameDataGenerator } from "../utils/SyllableGameDataGenerator";
import EffectManager from "@/games/clickedButton/logic/EffectManager";
import { ComplexSyllableDataGenerator } from "../utils/ComplexSyllableDataGenerator";

export interface ConsonantSelectionConfig {
  backgroundPath: string;
  backgroundKey: string;
  nextSceneName: string;
  title?: string;
  complex?: boolean;
}

export default class ConsonantSelectionScene extends Phaser.Scene {
  private config: ConsonantSelectionConfig;
  private buttonManager: ButtonManager;
  private consonants: string[];

  constructor(config: ConsonantSelectionConfig) {
    super("ConsonantSelectionScene");
    this.config = config;
    this.buttonManager = new ButtonManager(this);
    if (this.config.complex) {
      this.consonants = ComplexSyllableDataGenerator.getAvailableConsonants();
    } else {
      this.consonants = SyllableGameDataGenerator.getAvailableConsonants();
    }
  }

  preload() {
    this.load.audio("buttonClick", "/assets/common/sounds/correct.mp3");
    this.load.image(this.config.backgroundKey, this.config.backgroundPath);
    this.load.image(
      "defaultButton",
      "/assets/common/buttons/squareBlueDefault.svg",
    );
    this.load.image(
      "hoverButton",
      "/assets/common/buttons/squareBlueHover.svg",
    );
    this.load.image(
      "clickedButton",
      "/assets/common/buttons/squareBlueClicked.svg",
    );
  }

  create() {
    this.createBackground();
    this.createTitle();
    this.createConsonantButtons();
  }

  private createBackground(): void {
    const background = this.add.image(400, 300, this.config.backgroundKey);
    background.setDisplaySize(800, 600);
    new EffectManager(this).overlay(0.6);
  }

  private createTitle(): void {
    const title = this.config.title || "ESCOLHA UMA CONSOANTE";
    this.add
      .text(400, 80, title, {
        font: "bold 48px Arial",
        color: "#fff4c3ff",
      })
      .setOrigin(0.5, 0.5);
  }

  private createConsonantButtons(): void {
    const buttonsPerRow = 7;
    const buttonSpacing = 100;
    const startX = 120;
    const startY = 200;
    const rowSpacing = 100;

    this.consonants.forEach((consonant, index) => {
      const row = Math.floor(index / buttonsPerRow);
      const col = index % buttonsPerRow;

      const x = startX + col * buttonSpacing;
      const y = startY + row * rowSpacing;

      const button = this.buttonManager.createButton({
        positions: { x, y },
        textures: {
          default: "defaultButton",
          hover: "hoverButton",
          clicked: "clickedButton",
        },
        text: consonant,
        fontSize: 32,
        scale: 1.2,
      });

      button.on("released", () => {
        this.handleConsonantSelection(consonant);
      });
    });
  }

  private handleConsonantSelection(consonant: string): void {
    try {
      this.sound.play("buttonClick");
    } catch (error) {
      console.warn("Não foi possível reproduzir o som de clique:", error);
    }

    // Gera os dados do jogo para a consoante selecionada usando o gerador
    const gameData = SyllableGameDataGenerator.generateGameData(consonant);
    this.registry.set("generatedGameData", gameData);
    this.registry.set("selectedConsonant", consonant);

    this.time.delayedCall(300, () => {
      this.scene.start(this.config.nextSceneName);
    });
  }
}
