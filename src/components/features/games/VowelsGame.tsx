import { EndScene } from "@/games/common/scenes/EndScene";
import { LevelCompletedScene } from "@/games/common/scenes/LevelCompletedScene";
import { StartScene } from "@/games/common/scenes/StartScene";
import { EventBus } from "@/games/common/utils/EventBus";
import { GameWrapper } from "./GameWrapper";
import ClickButtonGameScene from "@/games/clickedButton/scenes/ClickButtonGame";
import Phaser from "phaser";

const VowelsGame: React.FC = () => {
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

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [startScene, levelCompleted, gameScene, endScene],
    backgroundColor: "#ffffff",
  };

  EventBus.once("current-scene-ready", (log: string) => {
    console.log({ log });
  });

  return <GameWrapper gameConfig={config} />;
};

export default VowelsGame;
