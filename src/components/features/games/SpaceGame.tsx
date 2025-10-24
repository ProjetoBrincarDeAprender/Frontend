import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { BackButton } from "@/components/utils/BackButton";
import { EventBus } from "@/games/common/utils/EventBus";
import { SpaceEndScene } from "@/games/space/scenes/SpaceEndScene";
import { SpaceLevelCompleteScene } from "@/games/space/scenes/SpaceLevelCompleteScene";
import { SpaceGameScene } from "@/games/space/scenes/SpaceLevelScene";
import { SpaceMenuScene } from "@/games/space/scenes/SpaceMenuScene";
import Phaser from "phaser";
import { useEffect, useRef } from "react";

export interface IRefSpaceGame {
  game: Phaser.Game | null;
  scene: Phaser.Scene | null;
}

export const SpaceGame = () => {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: [
        SpaceMenuScene,
        SpaceGameScene,
        SpaceLevelCompleteScene,
        SpaceEndScene,
      ],
      parent: "game-container",
      backgroundColor: "#96D6F3",
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
