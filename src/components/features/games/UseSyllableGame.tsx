import { EndScene } from "@/games/common/scenes/EndScene";
import { LevelCompletedScene } from "@/games/common/scenes/LevelCompletedScene";
import { StartScene } from "@/games/common/scenes/StartScene";
import { GameWrapper } from "./GameWrapper";
import ClickButtonGameScene from "@/games/clickedButton/scenes/ClickButtonGame";
import Phaser from "phaser";

const UseSyllableGame: React.FC = () => {
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

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [startScene, levelComplete, gameScene, endScene],
    backgroundColor: "#ffffff",
  };

  return <GameWrapper gameConfig={config} />;
};

export default UseSyllableGame;
