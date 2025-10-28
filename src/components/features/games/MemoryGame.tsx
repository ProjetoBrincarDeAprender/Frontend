import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { BackButton } from "@/components/utils/BackButton";
import { EventBus } from "@/games/common/utils/EventBus";
import { MemoryEndScene } from "@/games/memory/scenes/EndScene";
import { MemoryGameScene } from "@/games/memory/scenes/GameScene";
import { MemoryLevelCompleteScene } from "@/games/memory/scenes/LevelCompleteScene";
import { MemoryMenuScene } from "@/games/memory/scenes/MenuScene";
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
        MemoryMenuScene,
        MemoryGameScene,
        MemoryLevelCompleteScene,
        MemoryEndScene,
      ],
      parent: "game-container",
      backgroundColor: "#96D6F3",
    };

    gameRef.current = new Phaser.Game(config);

    const setupGame = () => {
      const scene = gameRef.current?.scene.scenes[1] as MemoryGameScene; // MemoryGameScene é a segunda cena
      if (scene && user?.codigo_usuario) {
        scene.setUserId(user.codigo_usuario.toString());
        scene.setActivityId(activityId);
      }
    };
    setTimeout(setupGame, 100);

    EventBus.once("current-scene-ready", (log: string) => {
      console.log({ log });
    });

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [user, activityId]);

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
