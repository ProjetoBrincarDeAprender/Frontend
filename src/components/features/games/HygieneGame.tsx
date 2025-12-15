import { EndScene } from "@/games/common/scenes/EndScene";
import { LevelCompletedScene } from "@/games/common/scenes/LevelCompletedScene";
import { StartScene } from "@/games/common/scenes/StartScene";
import { EventBus } from "@/games/common/utils/EventBus";
import { HygieneHistoryScene } from "@/games/hygiene/scenes/HygieneHistoryScene";
import { HygieneGameScene } from "@/games/hygiene/scenes/HygieneLevelScene";
import { GameWrapper } from "./GameWrapper";
import Phaser from "phaser";

interface HygieneGameProps {
  activityId?: number;
}

export const HygieneGame = ({ activityId = 6 }: HygieneGameProps) => {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [
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
    ],
    parent: "game-container",
    backgroundColor: "#96D6F3",
  };

  EventBus.once("current-scene-ready", (log: string) => {
    console.log({ log });
  });

  return <GameWrapper gameConfig={config} activityId={activityId} />;
};
