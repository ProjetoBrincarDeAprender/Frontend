import { GameLevels } from "../logic/PlantsGameData";
import PlantsLogic from "../logic/PlantsLogic";

import { AudioManager } from "@/games/common/managers/AudioManager";
import { PreloadScene } from "@/games/common/scenes/PreloadScene";

export class PlantsGameScene extends PreloadScene {
  private logic!: PlantsLogic;
  private activityId?: number;

  constructor() {
    super({ key: "PlantsGameScene" });
  }

  setActivityId(activityId: number) {
    this.activityId = activityId;
  }

  private initializeLogic() {
    this.logic = new PlantsLogic(this, this.activityId);
  }

  init(_data: { continueFromLevel?: boolean } = {}) {
    new AudioManager(this, 0.7);
  }

  preload() {
    super.preload();
    // Background
    this.load.image("background", "/assets/spaceGame/background.png");

    // Botões
    this.load.image(
      "defaultButton",
      "/assets/common/buttons/rectangleBlueDefault.svg",
    );
    this.load.image(
      "hoverButton",
      "/assets/common/buttons/rectangleBlueHover.svg",
    );
    this.load.image(
      "clickedButton",
      "/assets/common/buttons/rectangleBlueClicked.svg",
    );

    // Áudios
    this.load.audio("correct", "/assets/common/sounds/correct.mp3");
    this.load.audio("incorrect", "/assets/common/sounds/incorrect.mp3");

    // Imagens dos planetas (serão carregadas dinamicamente conforme necessário)
    this.preloadImages();
  }

  create() {
    // Inicializar a lógica com os IDs
    this.initializeLogic();

    // Configurar os níveis
    this.setupLevels();

    // A cena LevelCompletedScene já está sendo criada no componente React

    // Criar elementos da UI
    this.logic.createBackground();
    this.logic.createQuestion();
    this.logic.createButtons();

    console.log("Jogo do Sistema Solar carregado!");
  }

  private preloadImages(): void {
    const images = [
      "banana",
      "manga",
      "laranja",
      "fruta",
      "raizes",
      "folhas",
      "flores",
      "caule",
    ];

    images.forEach((imageName) => {
      this.load.image(imageName, `/assets/plantsGame/history/${imageName}.png`);
    });
  }

  private setupLevels(): void {
    this.logic.setGameLevels(GameLevels);
  }
}
