import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { EventBus } from "@/games/common/utils/EventBus";
import { MemoryEndScene } from "@/games/memory/scenes/EndScene";
import { MemoryGameScene } from "@/games/memory/scenes/GameScene";
import { MemoryMenuScene } from "@/games/memory/scenes/MenuScene";
import Phaser from "phaser";
import { useEffect, useRef } from "react";

export interface IRefMemoryGame {
  game: Phaser.Game | null;
  scene: Phaser.Scene | null;
}

export const MemoryGame = () => {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: [MemoryMenuScene, MemoryGameScene, MemoryEndScene],
      parent: "game-container",
      backgroundColor: "#ffffff",
    };

    gameRef.current = new Phaser.Game(config);

    EventBus.once("current-scene-ready", (log: string) => {
      console.log({ log });
    });

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
      }
    };
  }, []);

  return (
    <>
      <div className="mt-28 mb-20 flex justify-center py-4">
        <Header />
        <div
          id="game-container"
          className="relative h-fit min-h-[600px] w-fit min-w-[800px]"
        ></div>
      </div>
      <Footer />
    </>
  );
};
