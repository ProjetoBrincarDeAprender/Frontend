import { GameLevels } from "../logic/HygieneGameData";
import HygieneLogic from "../logic/HygieneLogic";

import { AudioManager } from "@/games/common/managers/AudioManager";
import { PreloadScene } from "@/games/common/scenes/PreloadScene";

export class HygieneGameScene extends PreloadScene {
  private logic!: HygieneLogic;
  private activityId?: number;

  constructor() {
    super({ key: "HygieneGameScene" });
  }

  setActivityId(activityId: number) {
    this.activityId = activityId;
  }

  private initializeLogic() {
    this.logic = new HygieneLogic(this, this.activityId);
  }

  init(_data: { continueFromLevel?: boolean } = {}) {
    new AudioManager(this, 0.7);
  }

  preload() {
    super.preload();
    // Background
    this.load.image("background", "/assets/hygieneGame/background.png");

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

    // Imagens de higiene (serão carregadas dinamicamente conforme necessário)
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

    console.log("Jogo de Higiene Pessoal carregado!");
  }

  private preloadImages(): void {
    const images = [
      "cortandoUnha",
      "cortaUnha",
      "escovaCabelo",
      "escovandoDente",
      "fioDental",
      "lavandoMao",
      "mascara",
      "pastaEscova",
      "pente",
      "penteandoCabelo",
      "sabao",
      "shampoo",
      "toalha",
      "tomandoBanho",
      "usandoMascara",
    ];

    images.forEach((imageName) => {
      this.load.image(
        imageName,
        `/assets/hygieneGame/history/${imageName}.png`,
      );
    });
  }

  private setupLevels(): void {
    this.logic.setGameLevels(GameLevels);
  }
}
