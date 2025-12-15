import { EndScene } from "@/games/common/scenes/EndScene";
import { LevelCompletedScene } from "@/games/common/scenes/LevelCompletedScene";
import { StartScene } from "@/games/common/scenes/StartScene";
import { EventBus } from "@/games/common/utils/EventBus";
import { MemoryGameScene } from "@/games/memory/scenes/GameScene";
import { GameWrapper } from "./GameWrapper";
import Phaser from "phaser";

interface MemoryGameProps {
  activityId?: number;
}

export const MemoryGame = ({ activityId = 4 }: MemoryGameProps) => {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [
      StartScene.create(
        "MemoryGameScene",
        "/assets/memoryGame/fundo.png",
        "background",
        "JOGO DA MEMÓRIA",
        "/assets/common/dudaSentada.png",
        "mascot",
      ),
      MemoryGameScene,
      LevelCompletedScene.create(
        "MemoryGameScene",
        "StartScene",
        "/assets/memoryGame/fundo.png",
        "background",
        "/assets/common/dudaSentada.png",
        "mascot",
        "PARABÉNS! NÍVEL COMPLETO!",
      ),
      EndScene.create(
        "StartScene",
        "/assets/memoryGame/fundo.png",
        "background",
        "PARABÉNS! VOCÊ TERMINOU O JOGO",
        "/assets/common/dudaSentada.png",
        "mascot",
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
