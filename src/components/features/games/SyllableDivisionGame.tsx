import { EventBus } from "@/games/common/utils/EventBus";
import { StartScene } from "@/games/common/scenes/StartScene";
import { LevelCompletedScene } from "@/games/common/scenes/LevelCompletedScene";
import { EndScene } from "@/games/common/scenes/EndScene";
import { GameWrapper } from "./GameWrapper";
import SyllableDivision from "@/games/syllableDivision/SyllableDivision";
import Phaser from "phaser";

const SyllableDivisionGame: React.FC = () => {
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

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [startScene, gameScene, levelCompleted, endScene],
    backgroundColor: "#ffffff",
  };

  EventBus.once("current-scene-ready", (log: string) => {
    console.log({ log });
  });

  return <GameWrapper gameConfig={config} />;
};

export default SyllableDivisionGame;
