import { EndScene } from "@/games/common/scenes/EndScene";
import { LevelCompletedScene } from "@/games/common/scenes/LevelCompletedScene";
import { StartScene } from "@/games/common/scenes/StartScene";
import { EventBus } from "@/games/common/utils/EventBus";
import { SpaceHistoryScene } from "@/games/space/scenes/SpaceHistoryScene";
import { SpaceGameScene } from "@/games/space/scenes/SpaceLevelScene";
import { GameWrapper } from "./GameWrapper";
import Phaser from "phaser";

interface SpaceGameProps {
  activityId?: number;
}

export const SpaceGame = ({ activityId = 3 }: SpaceGameProps) => {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [
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
    ],
    parent: "game-container",
    backgroundColor: "#96D6F3",
  };

  EventBus.once("current-scene-ready", (log: string) => {
    console.log({ log });
  });

  return <GameWrapper gameConfig={config} activityId={activityId} />;
};
