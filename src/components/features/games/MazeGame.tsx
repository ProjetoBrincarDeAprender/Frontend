import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { BackButton } from "@/components/utils/BackButton";
import { EndScene } from "@/games/common/scenes/EndScene";
import { LevelCompletedScene } from "@/games/common/scenes/LevelCompletedScene";
import { StartScene } from "@/games/common/scenes/StartScene";
import MazeGameScene from "@/games/maze/scenes/GameScene";
import { useUser } from "@/hooks/User/useUser";
import Phaser from "phaser";
import { useEffect, useRef } from "react";

export const MazeGame = ({
  activityId = 5 /* id do jogo do labirinto */,
}: {
  activityId?: number;
}) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { user } = useUser();

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
      parent: containerRef.current,
      backgroundColor: "#E0F6FF",
      audio: {
        disableWebAudio: true,
        noAudio: false,
      },
    };

    gameRef.current = new Phaser.Game(config);

    if (user) {
      gameRef.current.registry.set("userData", user);
    }

    // Define o activityId no registry para ser usado pelo jogo
    if (activityId) {
      gameRef.current.registry.set("activityId", activityId);
    }

    return () => {
      gameRef.current?.destroy(true);
    };
  }, [user, activityId]);

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
