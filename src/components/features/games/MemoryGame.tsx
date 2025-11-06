import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { BackButton } from "@/components/utils/BackButton";
import { EndScene } from "@/games/common/scenes/EndScene";
import { LevelCompletedScene } from "@/games/common/scenes/LevelCompletedScene";
import { StartScene } from "@/games/common/scenes/StartScene";
import { EventBus } from "@/games/common/utils/EventBus";
import { MemoryGameScene } from "@/games/memory/scenes/GameScene";
import { useUser } from "@/hooks/User/useUser";
import Phaser from "phaser";
import { useEffect, useRef } from "react";

export interface IRefMemoryGame {
  game: Phaser.Game | null;
  scene: Phaser.Scene | null;
}

interface MemoryGameProps {
  activityId?: number;
}

export const MemoryGame = ({ activityId = 4 }: MemoryGameProps) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (gameRef.current) return;

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

    gameRef.current = new Phaser.Game(config);

    if (user) {
      gameRef.current.registry.set("userData", user);
    }

    EventBus.once("current-scene-ready", (log: string) => {
      console.log({ log });
    });

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [activityId]);

  return (
    <>
      <div className="mt-28 mb-20 flex justify-center py-4">
        <Header />
        <BackButton />
        <div
          id="game-container"
          className="relative h-fit min-h-[600px] w-fit min-w-[800px]"
        ></div>
      </div>
      <Footer />
    </>
  );
};
