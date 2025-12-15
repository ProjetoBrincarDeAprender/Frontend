import { EndScene } from "@/games/common/scenes/EndScene";
import { LevelCompletedScene } from "@/games/common/scenes/LevelCompletedScene";
import { StartScene } from "@/games/common/scenes/StartScene";
import { GameWrapper } from "./GameWrapper";
import MazeGameScene from "@/games/maze/scenes/GameScene";
import Phaser from "phaser";

export const MazeGame = ({
  activityId = 5 /* id do jogo do labirinto */,
}: {
  activityId?: number;
}) => {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: "matter",
      matter: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
    scene: [
      StartScene.create(
        "MazeGameScene",
        "/assets/maze/bg.png",
        "mazeBg",
        "JOGO DO LABIRINTO",
      ),
      MazeGameScene,
      LevelCompletedScene.create(
        "MazeGameScene",
        "StartScene",
        "/assets/maze/bg.png",
        "mazeBg",
        "/assets/common/duda/dudaClap.png",
        "dudaClap",
        "NÍVEL CONCLUÍDO!",
      ),
      EndScene.create(
        "StartScene",
        "/assets/maze/bg.png",
        "mazeBg",
        "VOCÊ VENCEU OS LABIRINTOS!",
      ),
    ],
    backgroundColor: "#E0F6FF",
    audio: {
      disableWebAudio: true,
      noAudio: false,
    },
  };

  return <GameWrapper gameConfig={config} activityId={activityId} />;
};
