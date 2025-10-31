import { GameLevels } from "../logic/SpaceGameData";
import SpaceLogic from "../logic/SpaceLogic";

import { AudioManager } from "@/games/common/managers/AudioManager";
import { PreloadScene } from "@/games/common/scenes/PreloadScene";

export class SpaceGameScene extends PreloadScene {
  private logic!: SpaceLogic;
  private userId?: string;
  private activityId?: number;

  constructor() {
    super({ key: "SpaceGameScene" });
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  setActivityId(activityId: number) {
    this.activityId = activityId;
  }

  private initializeLogic() {
    this.logic = new SpaceLogic(this, this.userId, this.activityId);
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
    this.preloadPlanetImages();
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

  private preloadPlanetImages(): void {
    // Carregar todas as imagens de planetas que podem ser usadas
    const planetImages = [
      "earth.png",
      "moon.png",
      "sun.png",
      "saturn.png",
      "mars.png",
      "comet.png",
      "venus.png",
      "mercury.png",
      "jupiter.png",
      "uranus.png",
      "neptune.png",
    ];

    planetImages.forEach((image) => {
      this.load.image(
        image.replace(".png", ""),
        `/assets/spaceGame/planets/${image}`,
      );
    });
  }

  private setupLevels(): void {
    this.logic.setGameLevels(GameLevels);
  }
}
