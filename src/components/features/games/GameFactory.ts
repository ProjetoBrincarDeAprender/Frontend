import { GameScene as AdressGameScene } from "@/games/address/scenes/GameScene";
import { GameScene as SyllableGameScene } from "@/games/syllable/scenes/GameScene";
import { StartScene } from "@/games/common/scenes/StartScene";
import { LevelCompletedScene } from "@/games/common/scenes/LevelCompletedScene";
import { EndScene } from "@/games/common/scenes/EndScene";
import CoordinationGameScene from "@/games/coordination/scenes/GameScene";
import Phaser from "phaser";
import MazeGameScene from "@/games/maze/scenes/GameScene";
import { GameScene as TonicStress } from "@/games/tonicStress/scenes/GameScene";
import { EventBus } from "@/games/common/utils/EventBus";
import { SpaceHistoryScene } from "@/games/space/scenes/SpaceHistoryScene";
import { SpaceGameScene } from "@/games/space/scenes/SpaceLevelScene";
import { GameScene as LocationsGameScene } from "@/games/locations/scenes/GameScene";
import { MemoryGameScene } from "@/games/memory/scenes/GameScene";
import ClickButtonGameScene from "@/games/clickedButton/scenes/ClickButtonGame";
import { PlantsHistoryScene } from "@/games/plants/scenes/PlantsHistoryScene";
import { PlantsGameScene } from "@/games/plants/scenes/PlantsLevelScene";
import { GameScene as ProfessionsGameScene } from "@/games/professions/GameScene";
import { GameScene as SumGameScene } from "@/games/sum/scenes/GameScene";
import { GameScene as SubtractionGameScene } from "@/games/subtraction/scenes/GameScene";
import { GameScene as HousingGameScene } from "@/games/typesHousing/scenes/GameScene";
import ConsonantSelectionScene from "@/games/common/content/ConsonantSelectionScene";
import { HygieneGameScene } from "@/games/hygiene/scenes/HygieneLevelScene";
import { HygieneHistoryScene } from "@/games/hygiene/scenes/HygieneHistoryScene";
import { ComDatesHistoryScene } from "@/games/comDates/scenes/ComDatesHistoryScene";
import { ComDatesGameScene } from "@/games/comDates/scenes/ComDatesLevelScene";
import { SensorialGameScene } from "@/games/sensorial/scenes/SensorialGameScene";
import { GameScene as ArmedSumGameScene } from "@/games/armedSum/scenes/GameScene";
import SyllableDivision from "@/games/syllableDivision/SyllableDivision";

export class GameFactory {
  static createAddressGame(): Phaser.Types.Core.GameConfig {
    const scenes = [
      StartScene.create(
        "GameScene",
        "/assets/addressGame/bg.svg",
        "locationsBackground",
        "RUAS E BAIRROS",
        "/assets/common/trophy.png",
        "trophy",
      ),
      AdressGameScene,
    ];

    return {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: "game-container",
      backgroundColor: "#87CEEB",
      scene: scenes,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };
  }

  static createArmedSumGame(): Phaser.Types.Core.GameConfig {
    const scenes = [
      StartScene.create(
        "GameScene",
        "/assets/armedSum/background.png",
        "armedSumBg",
        "CONTA ARMADA",
      ),
      ArmedSumGameScene,
    ];

    return {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: "armed-sum-game-container",
      backgroundColor: "#4ECDC4",
      scene: scenes,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };
  }

  static createComDatesGame(): Phaser.Types.Core.GameConfig {
    const scenes = [
      StartScene.create(
        "ComDatesHistoryScene",
        "/assets/comDatesGame/background.png",
        "background",
        "JOGO DAS DATAS\nCOMEMORATIVAS",
        "/assets/comDatesGame/mascot.png",
        "mascot",
      ),
      ComDatesHistoryScene,
      ComDatesGameScene,
      LevelCompletedScene.create(
        "ComDatesGameScene",
        "StartScene",
        "/assets/comDatesGame/background.png",
        "background",
        "/assets/comDatesGame/mascot.png",
        "mascot",
        "EVENTOS CONHECIDOS!",
      ),
      EndScene.create(
        "StartScene",
        "/assets/comDatesGame/background.png",
        "background",
        "PARABÉNS!\nVOCÊ EXPLOROU TODAS AS DATAS!",
        "/assets/common/trophy.png",
        "trophy",
      ),
    ];

    EventBus.once("current-scene-ready", (log: string) => {
      console.log({ log });
    });

    return {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: scenes,
      parent: "game-container",
      backgroundColor: "#96D6F3",
    };
  }

  static createComplexSyllableGame(): Phaser.Types.Core.GameConfig {
    const startScene = new StartScene({
      nextSceneName: "ConsonantSelectionScene",
      backgroundPath: "/assets/complexSyllableGame/images/backgroundMain.png",
      backgroundKey: "startBg",
      gameTitle: "SÍLABAS COMPLEXAS",
    });

    const consonantSelectionScene = new ConsonantSelectionScene({
      backgroundPath: "/assets/complexSyllableGame/images/backgroundMain.png",
      backgroundKey: "consonantSelectionBg",
      nextSceneName: "clickButtonGameScene",
      title: "ESCOLHA UM DÍGRAFO",
      complex: true,
    });

    const gameScene = new ClickButtonGameScene();

    const endScene = new EndScene({
      restartScene: "ConsonantSelectionScene",
      backgroundPath: "/assets/complexSyllableGame/images/backgroundMain.png",
      backgroundKey: "endBg",
    });

    const scenes = [startScene, consonantSelectionScene, gameScene, endScene];

    EventBus.once("current-scene-ready", (log: string) => {
      console.log({ log });
    });

    return {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: scenes,
      backgroundColor: "#ffffff",
    };
  }

  static createCoordinationGame(): Phaser.Types.Core.GameConfig {
    // Instanciar a cena do jogo para poder usar o método de reset
    const gameScene = new CoordinationGameScene();
    const scenes = [
      // Tela inicial padronizada mantendo o background do jogo de formas
      StartScene.create(
        "CoordinationGameScene",
        "/assets/forms/bg2.png",
        "formsBg",
        "JOGO DAS FORMAS",
      ),
      gameScene,
      // Tela de nível completo padronizada mantendo o background
      LevelCompletedScene.create(
        "CoordinationGameScene",
        "StartScene",
        "/assets/forms/bg.png",
        "formsBg",
        undefined, // dudaImagePath
        undefined, // dudaImageKey
        undefined, // levelTitle
        () => {
          // Reset do nível ao voltar ao menu
          CoordinationGameScene.resetRegistry(gameScene);
        },
      ),
      // Tela final comum com customização para o jogo de formas
      EndScene.create(
        "StartScene",
        "/assets/forms/bg.png",
        "formsBg",
        "VOCÊ COMPLETOU AS FORMAS!",
      ),
    ];

    return {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: scenes,
      backgroundColor: "#96D6F3",
      audio: {
        // Evita criação de AudioContext (WebAudio) e usa HTML5 Audio,
        // eliminando os avisos/erros de autoplay no console.
        disableWebAudio: true,
        noAudio: false,
      },
    };
  }

  static createHousingGame(): Phaser.Types.Core.GameConfig {
    const scenes = [
      // StartScene personalizada para Housing
      StartScene.create(
        "GameScene", // Vai para GameScene
        "/assets/housingGame/bg.svg", // Background do Housing
        "housingBackground", // Chave do background
        "TIPOS DE MORADIAS", // Título específico
      ),
      // GameScene (registra automaticamente as outras cenas padrão)
      HousingGameScene,
    ];

    return {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: "game-container",
      backgroundColor: "#AED3E3",
      scene: scenes,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };
  }

  static createHygieneGame(): Phaser.Types.Core.GameConfig {
    const scenes = [
      StartScene.create(
        "HygieneHistoryScene",
        "/assets/hygieneGame/background.png",
        "background",
        "JOGO DA \nHIGIENE PESSOAL",
        "/assets/hygieneGame/mascot.png",
        "mascot",
      ),
      HygieneHistoryScene,
      HygieneGameScene,
      LevelCompletedScene.create(
        "HygieneGameScene",
        "StartScene",
        "/assets/hygieneGame/background.png",
        "background",
        "/assets/hygieneGame/mascot.png",
        "mascot",
        "PARABÉNS! \n VOCÊ CUIDOU BEM DA SUA HIGIENE!",
      ),
      EndScene.create(
        "StartScene",
        "/assets/hygieneGame/background.png",
        "background",
        "PARABÉNS!\nVOCÊ APRENDEU A CUIDAR\nDA SUA HIGIENE!",
        "/assets/common/trophy.png",
        "trophy",
      ),
    ];

    EventBus.once("current-scene-ready", (log: string) => {
      console.log({ log });
    });

    return {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: scenes,
      parent: "game-container",
      backgroundColor: "#96D6F3",
    };
  }

  static createLocationsGame(): Phaser.Types.Core.GameConfig {
    const scenes = [
      StartScene.create(
        "GameScene",
        "/assets/locations/bg.png",
        "locationsBackground",
        "JOGO DAS LOCALIZAÇÕES",
        "/assets/common/trophy.png",
        "trophy",
      ),
      LocationsGameScene,
    ];

    return {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: "game-container",
      backgroundColor: "#87CEEB",
      scene: scenes,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };
  }

  static createMazeGame(): Phaser.Types.Core.GameConfig {
    // Instanciar a cena do jogo para poder usar o método de reset
    const gameScene = new MazeGameScene();
    const scenes = [
      StartScene.create(
        "MazeGameScene",
        "/assets/maze/bg.png",
        "mazeBg",
        "JOGO DO LABIRINTO",
      ),
      gameScene,
      LevelCompletedScene.create(
        "MazeGameScene",
        "StartScene",
        "/assets/maze/bg.png",
        "mazeBg",
        "/assets/common/duda/dudaClap.png",
        "dudaClap",
        "NÍVEL CONCLUÍDO!",
        () => {
          // Reset do nível ao voltar ao menu
          MazeGameScene.resetRegistry(gameScene);
        },
      ),
      EndScene.create(
        "StartScene",
        "/assets/maze/bg.png",
        "mazeBg",
        "VOCÊ VENCEU OS LABIRINTOS!",
      ),
    ];

    return {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      physics: {
        default: "matter",
        matter: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
      scene: scenes,
      backgroundColor: "#E0F6FF",
      audio: {
        disableWebAudio: true,
        noAudio: false,
      },
    };
  }

  static createMemoryGame(): Phaser.Types.Core.GameConfig {
    const scenes = [
      StartScene.create(
        "MemoryGameScene",
        "/assets/memoryGame/fundo.png",
        "background",
        "JOGO DA MEMÓRIA",
        "/assets/common/dudaSentada.png",
        "mascot",
      ),
      MemoryGameScene,
      LevelCompletedScene.create(
        "MemoryGameScene",
        "StartScene",
        "/assets/memoryGame/fundo.png",
        "background",
        "/assets/common/dudaSentada.png",
        "mascot",
        "PARABÉNS! NÍVEL COMPLETO!",
      ),
      EndScene.create(
        "StartScene",
        "/assets/memoryGame/fundo.png",
        "background",
        "PARABÉNS! VOCÊ TERMINOU O JOGO",
        "/assets/common/dudaSentada.png",
        "mascot",
      ),
    ];

    EventBus.once("current-scene-ready", (log: string) => {
      console.log({ log });
    });

    return {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: scenes,
      parent: "game-container",
      backgroundColor: "#96D6F3",
    };
  }

  static createNumbersGame(): Phaser.Types.Core.GameConfig {
    const startScene = StartScene.create(
      "clickButtonGameScene",
      "/assets/numbersGame/background.png",
      "NÚMEROS",
      "SEQUENCIA NUMÉRICA",
    );
    const gameScene = new ClickButtonGameScene(
      "/assets/numbersGame/gameData/mainData.JSON",
      4,
    );
    const levelCompleted = new LevelCompletedScene({
      nextLevelScene: "clickButtonGameScene",
      menuScene: "StartScene",
      backgroundPath: "/assets/numbersGame/background.png",
      backgroundKey: "levelCompletedBg",
      onMenuReturn: () => {
        ClickButtonGameScene.resetRegistry(gameScene);
      },
    });
    const endScene = EndScene.create(
      "clickButtonGameScene",
      undefined,
      undefined,
      "VOCÊ COMPLETOU\nTODAS AS SEQUÊNCIAS!",
    );
    const scenes = [startScene, levelCompleted, gameScene, endScene];

    EventBus.once("current-scene-ready", (log: string) => {
      console.log({ log });
    });

    return {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: scenes,
      backgroundColor: "#ffffff",
    };
  }

  static createPlantsGame(): Phaser.Types.Core.GameConfig {
    const scenes = [
      StartScene.create(
        "PlantsHistoryScene",
        "/assets/plantsGame/background.png",
        "background",
        "JOGO DAS PLANTAS",
        "/assets/plantsGame/mascot.png",
        "mascot",
      ),
      PlantsHistoryScene,
      PlantsGameScene,
      LevelCompletedScene.create(
        "PlantsGameScene",
        "StartScene",
        "/assets/plantsGame/background.png",
        "background",
        "/assets/plantsGame/mascot.png",
        "mascot",
        "PLANTAS CONHECIDAS!",
      ),
      EndScene.create(
        "StartScene",
        "/assets/plantsGame/background.png",
        "background",
        "PARABÉNS!\nVOCÊ EXPLOROU TODAS AS PLANTAS!",
        "/assets/common/trophy.png",
        "trophy",
      ),
    ];

    EventBus.once("current-scene-ready", (log: string) => {
      console.log({ log });
    });

    return {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: scenes,
      parent: "game-container",
      backgroundColor: "#96D6F3",
    };
  }

  static createProfessionsGame(): Phaser.Types.Core.GameConfig {
    const scenes = [
      StartScene.create(
        "GameScene",
        "/assets/professions/bg.svg",
        "professionsBackground",
        "JOGO DAS PROFISSÕES",
      ),
      ProfessionsGameScene,
    ];

    return {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: "game-container",
      backgroundColor: "#AED3E3",
      scene: scenes,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };
  }

  static createPunctuationGame(): Phaser.Types.Core.GameConfig {
    const startScene = new StartScene({
      nextSceneName: "clickButtonGameScene",
      backgroundPath: "/assets/punctuationGame/images/backgroundMain.png",
      backgroundKey: "startBg",
      gameTitle: "PONTUANDO FRASES",
    });

    const gameScene = new ClickButtonGameScene(
      "/assets/punctuationGame/gameData/mainData.JSON",
    );

    const levelCompleted = new LevelCompletedScene({
      nextLevelScene: "clickButtonGameScene",
      menuScene: "StartScene",
      backgroundPath: "/assets/punctuationGame/images/backgroundMain.png",
      backgroundKey: "levelCompletedBg",
      onMenuReturn: () => {
        ClickButtonGameScene.resetRegistry(gameScene);
      },
    });

    const endScene = new EndScene({
      restartScene: "clickButtonGameScene",
      backgroundPath: "/assets/punctuationGame/images/backgroundMain.png",
      // backgroundKey: "endBg",
    });

    const scenes = [startScene, levelCompleted, gameScene, endScene];

    EventBus.once("current-scene-ready", (log: string) => {
      console.log({ log });
    });

    return {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: scenes,
      backgroundColor: "#ffffff",
    };
  }

  static createSensorialGame(): Phaser.Types.Core.GameConfig {
    const scenes = [
      StartScene.create(
        "SensorialGameScene",
        "/assets/sensorialGame/background.png",
        "background",
        "JOGO SENSORIAL",
        "/assets/sensorialGame/mascot.png",
        "mascot",
      ),
      SensorialGameScene,
      LevelCompletedScene.create(
        "SensorialGameScene",
        "StartScene",
        "/assets/sensorialGame/background.png",
        "background",
        "/assets/sensorialGame/mascot.png",
        "mascot",
        "SONS DESCOBERTOS!",
      ),
      EndScene.create(
        "StartScene",
        "/assets/sensorialGame/background.png",
        "background",
        "PARABÉNS!\nVOCÊ EXPLOROU TODOS OS SONS!",
        "/assets/common/trophy.png",
        "trophy",
      ),
    ];

    EventBus.once("current-scene-ready", (log: string) => {
      console.log({ log });
    });

    return {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: scenes,
      parent: "game-container",
      backgroundColor: "#96D6F3",
    };
  }

  static createSimpleSyllableGame(): Phaser.Types.Core.GameConfig {
    const startScene = new StartScene({
      nextSceneName: "ConsonantSelectionScene",
      backgroundPath: "/assets/simpleSyllableGame/images/backgroundStart.png",
      backgroundKey: "startBg",
      gameTitle: "CRIANDO SÍLABAS",
    });

    const consonantSelectionScene = new ConsonantSelectionScene({
      backgroundPath: "/assets/simpleSyllableGame/images/backgroundMain.png",
      backgroundKey: "consonantSelectionBg",
      nextSceneName: "clickButtonGameScene",
      title: "ESCOLHA UMA CONSOANTE",
    });

    const gameScene = new ClickButtonGameScene();

    const endScene = new EndScene({
      restartScene: "ConsonantSelectionScene",
      backgroundPath: "/assets/simpleSyllableGame/images/backgroundMain.png",
      backgroundKey: "endBg",
    });

    const scenes = [startScene, consonantSelectionScene, gameScene, endScene];

    EventBus.once("current-scene-ready", (log: string) => {
      console.log({ log });
    });

    return {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: scenes,
      backgroundColor: "#ffffff",
    };
  }

  static createSpaceGame(): Phaser.Types.Core.GameConfig {
    const scenes = [
      StartScene.create(
        "SpaceHistoryScene",
        "/assets/spaceGame/background.png",
        "background",
        "JOGO DO ESPAÇO",
        "/assets/spaceGame/mascot.png",
        "mascot",
      ),
      SpaceHistoryScene,
      SpaceGameScene,
      LevelCompletedScene.create(
        "SpaceGameScene",
        "StartScene",
        "/assets/spaceGame/background.png",
        "background",
        "/assets/spaceGame/mascot.png",
        "mascot",
        "PLANETA EXPLORADO!",
      ),
      EndScene.create(
        "StartScene",
        "/assets/spaceGame/background.png",
        "background",
        "PARABÉNS!\nVOCÊ EXPLOROU TODO O ESPAÇO!",
        "/assets/common/trophy.png",
        "trophy",
      ),
    ];

    EventBus.once("current-scene-ready", (log: string) => {
      console.log({ log });
    });

    return {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: scenes,
      parent: "game-container",
      backgroundColor: "#96D6F3",
    };
  }

  static createStressSyllableGame(): Phaser.Types.Core.GameConfig {
    const scenes = [
      StartScene.create(
        "GameScene",
        "/assets/tonicStressGame/bg.png",
        "tonicStressBackground",
        "CLASSIFICAÇÃO TÔNICA",
        "/assets/common/trophy.png",
        "trophy",
      ),
      TonicStress,
    ];

    return {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: "game-container",
      backgroundColor: "#87CEEB",
      scene: scenes,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };
  }

  static createSubtractionGame(): Phaser.Types.Core.GameConfig {
    const scenes = [
      StartScene.create(
        "GameScene",
        "/assets/subtractionGame/background.png",
        "subBackground",
        "JOGO DA SUBTRAÇÃO",
      ),
      SubtractionGameScene,
    ];

    return {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: "subtraction-game-container",
      backgroundColor: "#AED3E3",
      scene: scenes,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };
  }

  static createSumGame(): Phaser.Types.Core.GameConfig {
    const scenes = [
      StartScene.create(
        "GameScene",
        "/assets/sumGame/FUNDO.png",
        "sumBackground",
        "JOGO DA SOMA",
      ),
      SumGameScene,
    ];

    return {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: "game-container",
      backgroundColor: "#AED3E3",
      scene: scenes,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };
  }

  static createSyllableDivisionGame(): Phaser.Types.Core.GameConfig {
    const startScene = new StartScene({
      backgroundPath: "/assets/syllableDivisionGame/images/backgroundMain.png",
      gameTitle: "DIVIDINDO SÍLABAS",
      nextSceneName: "SyllableDivision",
    });

    const gameScene = new SyllableDivision({
      audiosPath: "/assets/useSyllableGame/sounds/",
      backgroundPath: "/assets/syllableDivisionGame/images/backgroundMain.png",
      imagesPath: "/assets/useSyllableGame/images/entities/",
      instruction: "SEPARE A PALAVRA",
      levels: [
        ["CA", "SA"],
        ["BO", "LA"],
        ["SO", "FÁ"],
        ["PA", "TO"],
        ["MA", "LA"],
        ["BO", "NE", "CA"],
        ["BA", "NA", "NA"],
        ["CA", "MI", "SA"],
        ["CA", "VA", "LO"],
        ["PI", "PO", "CA"],
        ["PA", "RA", "FU", "SO"],
        ["TE", "LE", "FO", "NE"],
        ["CA", "RA", "ME", "LO"],
        ["A", "LI", "CA", "TE"],
        ["EN", "VE", "LO", "PE"],
      ],
    });

    const levelCompleted = new LevelCompletedScene({
      nextLevelScene: "SyllableDivision",
      menuScene: "StartScene",
    });

    const endScene = new EndScene({
      restartScene: "StartScene",
    });

    const scenes = [startScene, gameScene, levelCompleted, endScene];

    EventBus.once("current-scene-ready", (log: string) => {
      console.log({ log });
    });

    return {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: scenes,
      backgroundColor: "#ffffff",
    };
  }

  static createSyllableGame(): Phaser.Types.Core.GameConfig {
    const scenes = [
      StartScene.create(
        "GameScene",
        "/assets/syllableGame/bg.png",
        "syllableBackground",
        "CLASSIFICAÇÃO\nSILÁBICA",
        "/assets/common/trophy.png",
        "trophy",
      ),
      SyllableGameScene,
    ];

    return {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: "game-container",
      backgroundColor: "#87CEEB",
      scene: scenes,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };
  }

  static createUseSyllableGame(): Phaser.Types.Core.GameConfig {
    const startScene = new StartScene({
      nextSceneName: "clickButtonGameScene",
      backgroundPath: "/assets/useSyllableGame/images/backgroundStart.png",
      backgroundKey: "startBg",
      gameTitle: "USANDO SÍLABAS",
    });

    const gameScene = new ClickButtonGameScene(
      "/assets/useSyllableGame/gameData/mainData.JSON",
    );

    const levelComplete = new LevelCompletedScene({
      nextLevelScene: "clickButtonGameScene",
      backgroundPath: "/assets/useSyllableGame/images/backgroundMain.png",
      backgroundKey: "levelBg",
      onMenuReturn: () => {
        ClickButtonGameScene.resetRegistry(gameScene);
      },
    });

    const endScene = new EndScene({
      restartScene: "clickButtonGameScene",
      backgroundPath: "/assets/useSyllableGame/images/backgroundMain.png",
      backgroundKey: "endBg",
    });

    const scenes = [startScene, levelComplete, gameScene, endScene];

    return {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: scenes,
      backgroundColor: "#ffffff",
    };
  }

  static createVowelsGame(): Phaser.Types.Core.GameConfig {
    const startScene = new StartScene({
      nextSceneName: "clickButtonGameScene",
      backgroundPath: "/assets/vowelsGame/images/backgroundMain.png",
      backgroundKey: "startBg",
      gameTitle: "JOGO DAS VOGAIS",
    });

    const gameScene = new ClickButtonGameScene(
      "/assets/vowelsGame/gameData/mainData.JSON",
    );

    const levelCompleted = new LevelCompletedScene({
      nextLevelScene: "clickButtonGameScene",
      menuScene: "StartScene",
      backgroundPath: "/assets/vowelsGame/images/backgroundMain.png",
      backgroundKey: "levelCompletedBg",
      onMenuReturn: () => {
        ClickButtonGameScene.resetRegistry(gameScene);
      },
    });

    const endScene = new EndScene({
      restartScene: "clickButtonGameScene",
      backgroundPath: "/assets/vowelsGame/images/backgroundMain.png",
      backgroundKey: "endBg",
    });

    const scenes = [startScene, gameScene, levelCompleted, endScene];

    EventBus.once("current-scene-ready", (log: string) => {
      console.log({ log });
    });

    return {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: scenes,
      backgroundColor: "#ffffff",
    };
  }
}
