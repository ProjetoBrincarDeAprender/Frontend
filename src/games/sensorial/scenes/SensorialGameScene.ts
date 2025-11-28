import { GameLevels } from "../logic/SensorialGameData";
import SensorialLogic from "../logic/SensorialLogic";

import { AudioManager } from "@/games/common/managers/AudioManager";
import { PreloadScene } from "@/games/common/scenes/PreloadScene";

export class SensorialGameScene extends PreloadScene {
  private logic!: SensorialLogic;
  private activityId?: number;

  constructor() {
    super({ key: "SensorialGameScene" });
  }

  setActivityId(activityId: number) {
    this.activityId = activityId;
  }

  private initializeLogic() {
    this.logic = new SensorialLogic(this, this.activityId);
  }

  init(_data: { continueFromLevel?: boolean } = {}) {
    new AudioManager(this, 0.7);
  }

  preload() {
    super.preload();
    // Background
    this.load.image("background", "/assets/sensorialGame/background.png");

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

    // Áudios comuns
    this.load.audio("correct", "/assets/common/sounds/correct.mp3");
    this.load.audio("incorrect", "/assets/common/sounds/incorrect.mp3");

    // Carregar imagens e áudios das questões
    this.preloadGameAssets();
  }

  create() {
    // Inicializar a lógica com os IDs
    this.initializeLogic();

    // Configurar os níveis
    this.setupLevels();

    // Criar elementos da UI
    this.logic.createBackground();
    this.logic.createQuestion();
    this.logic.createButtons();

    console.log("Jogo Sensorial carregado!");
  }

  private preloadGameAssets(): void {
    // Carregar imagens das questões
    const images = [
      "rain",
      "storm",
      "heavy_rain",
      "drums",
      "guitar",
      "flute",
      "doorbell",
      "microwave",
      "telephone",
      "blender",
    ];

    images.forEach((imageName) => {
      this.load.image(
        imageName,
        `/assets/sensorialGame/images/${imageName}.png`,
      );
    });

    // Carregar áudios das questões
    const sounds = [
      "rain",
      "storm",
      "heavy_rain",
      "drums",
      "guitar",
      "flute",
      "doorbell",
      "microwave",
      "telephone",
      "blender",
    ];

    sounds.forEach((soundName) => {
      this.load.audio(
        soundName,
        `/assets/sensorialGame/sounds/${soundName}.m4a`,
      );
    });
  }

  private setupLevels(): void {
    this.logic.setGameLevels(GameLevels);
  }
}
