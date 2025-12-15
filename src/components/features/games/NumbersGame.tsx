import { EndScene } from "@/games/common/scenes/EndScene";
import { LevelCompletedScene } from "@/games/common/scenes/LevelCompletedScene";
import { StartScene } from "@/games/common/scenes/StartScene";
import { GameWrapper } from "./GameWrapper";
import ClickButtonGameScene from "@/games/clickedButton/scenes/ClickButtonGame";
import Phaser from "phaser";

const NumbersGame: React.FC = () => {
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

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [startScene, levelCompleted, gameScene, endScene],
    backgroundColor: "#ffffff",
  };

  return <GameWrapper gameConfig={config} />;
};

export default NumbersGame;
