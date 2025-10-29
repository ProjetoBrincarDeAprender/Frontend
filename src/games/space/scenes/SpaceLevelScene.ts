import { AudioManager } from "@/games/common/managers/AudioManager";
import { PreloadScene } from "@/games/common/scenes/PreloadScene";
import { gameData } from "../logic/SpaceGameData";
import SpaceLevel from "../logic/SpaceLevel";
import SpaceLogic from "../logic/SpaceLogic";

export class SpaceGameScene extends PreloadScene {
  private logic: SpaceLogic;
  private continueFromLevel: boolean = false;

  constructor() {
    super({ key: "SpaceGameScene" });
    this.logic = new SpaceLogic(this);
  }

  init(data: { continueFromLevel?: boolean } = {}) {
    this.continueFromLevel = data.continueFromLevel || false;
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
    const levels: SpaceLevel[] = gameData.levels.map(
      (levelData) =>
        new SpaceLevel(
          levelData.question,
          levelData.options,
          levelData.optionsImages,
          levelData.answer,
          levelData.difficulty,
        ),
    );

    this.logic.setLevelManager(levels);
  }
}
