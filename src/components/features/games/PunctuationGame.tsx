import ClickButtonGameScene from "@/games/clickedButton/scenes/ClickButtonGame";
import { EndScene } from "@/games/common/scenes/EndScene";
import { LevelCompletedScene } from "@/games/common/scenes/LevelCompletedScene";
import { StartScene } from "@/games/common/scenes/StartScene";
import { EventBus } from "@/games/common/utils/EventBus";
import Phaser from "phaser";
import { GameWrapper } from "./GameWrapper";

const PunctuationGame: React.FC = () => {
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

export default PunctuationGame;
