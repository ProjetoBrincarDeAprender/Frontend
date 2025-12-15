import { EndScene } from "@/games/common/scenes/EndScene";
import { LevelCompletedScene } from "@/games/common/scenes/LevelCompletedScene";
import { StartScene } from "@/games/common/scenes/StartScene";
import { EventBus } from "@/games/common/utils/EventBus";
import { SensorialGameScene } from "@/games/sensorial/scenes/SensorialGameScene";
import { GameWrapper } from "./GameWrapper";
import Phaser from "phaser";

interface SensorialGameProps {
  activityId?: number;
}

export const SensorialGame = ({ activityId = 8 }: SensorialGameProps) => {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [
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
    ],
    parent: "game-container",
    backgroundColor: "#96D6F3",
  };

  EventBus.once("current-scene-ready", (log: string) => {
    console.log({ log });
  });

  return <GameWrapper gameConfig={config} activityId={activityId} />;
};
