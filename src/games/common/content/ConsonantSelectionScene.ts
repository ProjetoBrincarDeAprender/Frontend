import Phaser from "phaser";
import ButtonManager from "@/games/clickedButton/logic/ButtonManager";
import { SyllableGameDataGenerator } from "../utils/SyllableGameDataGenerator";

export interface ConsonantSelectionConfig {
  backgroundPath: string;
  backgroundKey: string;
  nextSceneName: string;
  title?: string;
}

export default class ConsonantSelectionScene extends Phaser.Scene {
  private config: ConsonantSelectionConfig;
  private buttonManager: ButtonManager;
  private consonants: string[];

  constructor(config: ConsonantSelectionConfig) {
    super("ConsonantSelectionScene");
    this.config = config;
    this.buttonManager = new ButtonManager(this);
    this.consonants = SyllableGameDataGenerator.getAvailableConsonants();
  }

  preload() {
    // Carrega o fundo
    this.load.image(this.config.backgroundKey, this.config.backgroundPath);

    // Carrega as texturas dos botões
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

    // Carrega o áudio de clique
    this.load.audio("buttonClick", "/assets/common/sounds/correct.mp3");
  }

  create() {
    this.createBackground();
    this.createTitle();
    this.createBackButton();
    this.createConsonantButtons();
  }

  private createBackground(): void {
    const background = this.add.image(400, 300, this.config.backgroundKey);
    background.setDisplaySize(800, 600);
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

  private createBackButton(): void {
    // Cria um botão "Voltar" no canto superior esquerdo
    const backButton = this.buttonManager.createButton({
      positions: { x: 80, y: 50 },
      textures: {
        default: "defaultButton",
        hover: "hoverButton",
        clicked: "clickedButton",
      },
      text: "VOLTAR",
      fontSize: 24,
      scale: 0.8,
    });

    backButton.on("released", () => {
      try {
        this.sound.play("buttonClick");
      } catch (error) {
        console.warn("Não foi possível reproduzir o som de clique:", error);
      }

      // Volta para a cena inicial (StartScene)
      this.scene.start("StartScene");
    });
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
    // Toca som de clique
    try {
      this.sound.play("buttonClick");
    } catch (error) {
      console.warn("Não foi possível reproduzir o som de clique:", error);
    }

    // Gera os dados do jogo para a consoante selecionada usando o gerador
    const gameData = SyllableGameDataGenerator.generateGameData(consonant);

    // Armazena os dados no registry para serem usados pela próxima cena
    this.registry.set("generatedGameData", gameData);
    this.registry.set("selectedConsonant", consonant);

    // Adiciona um pequeno delay para feedback visual
    this.time.delayedCall(300, () => {
      this.scene.start(this.config.nextSceneName);
    });
  }
}
