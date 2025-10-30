import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { BackButton } from "@/components/utils/BackButton";
import MazeGameScene from "@/games/maze/scenes/GameScene";
import { MazeLevelCompleteScene } from "@/games/maze/scenes/LevelCompleteScene";
import { EndScene } from "@/games/common/scenes/EndScene";
import { StartScene } from "@/games/common/scenes/StartScene";
import Phaser from "phaser";
import { useEffect, useRef } from "react";

export const MazeGame = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

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
        new MazeLevelCompleteScene(),
        EndScene.create(
          "StartScene",
          "/assets/maze/bg.png",
          "mazeBg",
          "VOCÊ COMPLETOU TODOS OS LABIRINTOS!",
        ),
      ],
      parent: containerRef.current,
      backgroundColor: "#E0F6FF",
      audio: {
        disableWebAudio: true,
        noAudio: false,
      },
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      gameRef.current?.destroy(true);
    };
  }, []);

  return (
    <>
      <div className="mt-28 mb-20 flex justify-center py-4">
        <Header />
        <BackButton />
        <div
          ref={containerRef}
          className="relative h-fit min-h-[600px] w-fit min-w-[800px]"
        />
      </div>
      <Footer />
    </>
  );
};
