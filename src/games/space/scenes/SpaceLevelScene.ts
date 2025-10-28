import Phaser from "phaser";
import { GameLevels } from "../logic/SpaceGameData";
import SpaceLogic from "../logic/SpaceLogic";

export class SpaceGameScene extends Phaser.Scene {
  private logic!: SpaceLogic;
  private continueFromLevel: boolean = false;
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

  init(data: { continueFromLevel?: boolean } = {}) {
    this.continueFromLevel = data.continueFromLevel || false;
  }

  preload() {
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

    // Se for continuação, não resetar - o nível já foi avançado
    if (!this.continueFromLevel) {
      // Primeira vez ou restart - começar do nível 0
    }

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
