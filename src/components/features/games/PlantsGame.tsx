import { EndScene } from "@/games/common/scenes/EndScene";
import { LevelCompletedScene } from "@/games/common/scenes/LevelCompletedScene";
import { StartScene } from "@/games/common/scenes/StartScene";
import { EventBus } from "@/games/common/utils/EventBus";
import { PlantsHistoryScene } from "@/games/plants/scenes/PlantsHistoryScene";
import { PlantsGameScene } from "@/games/plants/scenes/PlantsLevelScene";
import { GameWrapper } from "./GameWrapper";
import Phaser from "phaser";

interface PlantsGameProps {
  activityId?: number;
}

export const PlantsGame = ({ activityId = 5 }: PlantsGameProps) => {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [
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
    ],
    parent: "game-container",
    backgroundColor: "#96D6F3",
  };

  EventBus.once("current-scene-ready", (log: string) => {
    console.log({ log });
  });

  return <GameWrapper gameConfig={config} activityId={activityId} />;
};
