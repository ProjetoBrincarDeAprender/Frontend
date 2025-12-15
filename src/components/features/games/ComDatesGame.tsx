import { ComDatesHistoryScene } from "@/games/comDates/scenes/ComDatesHistoryScene";
import { ComDatesGameScene } from "@/games/comDates/scenes/ComDatesLevelScene";
import { EndScene } from "@/games/common/scenes/EndScene";
import { LevelCompletedScene } from "@/games/common/scenes/LevelCompletedScene";
import { StartScene } from "@/games/common/scenes/StartScene";
import { EventBus } from "@/games/common/utils/EventBus";
import { GameWrapper } from "./GameWrapper";
import Phaser from "phaser";

interface ComDatesGameProps {
  activityId?: number;
}

export const ComDatesGame = ({ activityId = 7 }: ComDatesGameProps) => {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [
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
    ],
    parent: "game-container",
    backgroundColor: "#96D6F3",
  };

  EventBus.once("current-scene-ready", (log: string) => {
    console.log({ log });
  });

  return <GameWrapper gameConfig={config} activityId={activityId} />;
};
